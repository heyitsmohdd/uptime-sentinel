package db

import (
	"database/sql"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type Check struct {
	ID        int       `json:"id"`
	URL       string    `json:"url"`
	StatusCode int      `json:"status_code"`
	Latency   int64     `json:"latency"`
	CreatedAt time.Time `json:"created_at"`
}

type CheckHistory struct {
	StatusCode int       `json:"status_code"`
	Latency    int64     `json:"latency"`
	CreatedAt  time.Time `json:"created_at"`
}

type MonitorStats struct {
	URL              string         `json:"url"`
	CurrentStatus    int            `json:"status_code"`
	CurrentLatency   int64          `json:"latency"`
	LastChecked      time.Time      `json:"created_at"`
	UptimePercentage float64        `json:"uptime_percentage"`
	AverageLatency   float64        `json:"average_latency"`
	History          []CheckHistory `json:"history"`
}

type DailyUptime struct {
	Date             string  `json:"date"`
	UptimePercentage float64 `json:"uptime_percentage"`
	HasData          bool    `json:"has_data"`
}

type Incident struct {
	StartTime time.Time  `json:"start_time"`
	EndTime   *time.Time `json:"end_time,omitempty"`
	Duration  string     `json:"duration"`
	Status    string     `json:"status"`
}

type MonitorDetails struct {
	URL          string        `json:"url"`
	DailyUptimes []DailyUptime `json:"daily_uptimes"`
	Incidents    []Incident    `json:"incidents"`
}

type Database struct {
	conn *sql.DB
}

func NewDatabase(dsn string) (*Database, error) {
	conn, err := sql.Open("sqlite3", dsn)
	if err != nil {
		return nil, err
	}

	db := &Database{conn: conn}
	if err := db.runMigrations(); err != nil {
		return nil, err
	}

	return db, nil
}

func (db *Database) Close() error {
	return db.conn.Close()
}

func (db *Database) InsertCheck(url string, statusCode int, latency int64) error {
	query := `INSERT INTO checks (url, status_code, latency, created_at) VALUES (?, ?, ?, ?)`
	_, err := db.conn.Exec(query, url, statusCode, latency, time.Now())
	return err
}

func (db *Database) GetDashboardStats() ([]MonitorStats, error) {
	urls, err := db.GetMonitoredURLs()
	if err != nil {
		return nil, err
	}

	var stats []MonitorStats

	for _, u := range urls {
		stat := MonitorStats{URL: u, History: []CheckHistory{}}

		// 1. Aggregations
		aggQuery := `
			SELECT 
				SUM(CASE WHEN status_code >= 200 AND status_code < 400 THEN 1 ELSE 0 END) * 100.0 / COUNT(*),
				AVG(CASE WHEN status_code >= 200 AND status_code < 400 THEN latency ELSE NULL END)
			FROM checks 
			WHERE url = ?
		`
		var uptime *float64
		var avgLatency *float64
		err := db.conn.QueryRow(aggQuery, u).Scan(&uptime, &avgLatency)
		if err == nil {
			if uptime != nil {
				stat.UptimePercentage = *uptime
			}
			if avgLatency != nil {
				stat.AverageLatency = *avgLatency
			}
		}

		// 2. Recent History & Latest Check
		historyQuery := `
			SELECT status_code, latency, created_at 
			FROM checks 
			WHERE url = ? 
			ORDER BY created_at DESC 
			LIMIT 20
		`
		rows, err := db.conn.Query(historyQuery, u)
		if err == nil {
			isFirst := true
			for rows.Next() {
				var code int
				var lat int64
				var t time.Time
				if err := rows.Scan(&code, &lat, &t); err == nil {
					if isFirst {
						stat.CurrentStatus = code
						stat.CurrentLatency = lat
						stat.LastChecked = t
						isFirst = false
					}
					// Prepend to history so oldest is on the left
					stat.History = append([]CheckHistory{{StatusCode: code, Latency: lat, CreatedAt: t}}, stat.History...)
				}
			}
			rows.Close()
		}

		stats = append(stats, stat)
	}

	return stats, nil
}

func (db *Database) GetMonitoredURLs() ([]string, error) {
	query := `SELECT DISTINCT url FROM checks ORDER BY url`
	rows, err := db.conn.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var urls []string
	for rows.Next() {
		var url string
		if err := rows.Scan(&url); err != nil {
			return nil, err
		}
		urls = append(urls, url)
	}

	return urls, rows.Err()
}

func (db *Database) GetMonitorDetails(url string) (*MonitorDetails, error) {
	details := &MonitorDetails{URL: url, DailyUptimes: []DailyUptime{}, Incidents: []Incident{}}

	// 1. Generate last 90 days grid
	today := time.Now().UTC()
	dayMap := make(map[string]int)
	for i := 89; i >= 0; i-- {
		d := today.AddDate(0, 0, -i).Format("2006-01-02")
		du := DailyUptime{Date: d, UptimePercentage: 100.0, HasData: false}
		details.DailyUptimes = append(details.DailyUptimes, du)
		dayMap[d] = 89 - i
	}

	uptimeQuery := `
		SELECT 
			date(created_at) as day,
			SUM(CASE WHEN status_code >= 200 AND status_code < 400 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as uptime
		FROM checks
		WHERE url = ? AND created_at >= datetime('now', '-90 days')
		GROUP BY day
	`
	rows, err := db.conn.Query(uptimeQuery, url)
	if err == nil {
		for rows.Next() {
			var day string
			var uptime float64
			if err := rows.Scan(&day, &uptime); err == nil {
				if idx, exists := dayMap[day]; exists {
					details.DailyUptimes[idx].UptimePercentage = uptime
					details.DailyUptimes[idx].HasData = true
				}
			}
		}
		rows.Close()
	}

	// 2. Incident History (last 30 days)
	incidentQuery := `SELECT status_code, created_at FROM checks WHERE url = ? AND created_at >= datetime('now', '-30 days') ORDER BY created_at ASC`
	incRows, err := db.conn.Query(incidentQuery, url)
	if err == nil {
		var currentIncident *Incident
		for incRows.Next() {
			var code int
			var t time.Time
			incRows.Scan(&code, &t)
			
			isUp := code >= 200 && code < 400
			
			if !isUp && currentIncident == nil {
				currentIncident = &Incident{StartTime: t, Status: "Ongoing"}
			} else if isUp && currentIncident != nil {
				end := t
				currentIncident.EndTime = &end
				currentIncident.Status = "Resolved"
				currentIncident.Duration = end.Sub(currentIncident.StartTime).Round(time.Second).String()
				details.Incidents = append([]Incident{*currentIncident}, details.Incidents...)
				currentIncident = nil
			}
		}
		if currentIncident != nil {
			currentIncident.Duration = time.Since(currentIncident.StartTime).Round(time.Second).String()
			details.Incidents = append([]Incident{*currentIncident}, details.Incidents...)
		}
		incRows.Close()
	}

	return details, nil
}

func (db *Database) DeleteOldChecks(days int) error {
	cutoff := time.Now().AddDate(0, 0, -days)
	query := `DELETE FROM checks WHERE created_at < ?`
	_, err := db.conn.Exec(query, cutoff)
	return err
}

func (db *Database) DeleteMonitorAndChecks(url string) error {
	query := `DELETE FROM checks WHERE url = ?`
	_, err := db.conn.Exec(query, url)
	return err
}
