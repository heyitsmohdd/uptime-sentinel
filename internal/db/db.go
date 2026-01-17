package db

import (
	"database/sql"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type Check struct {
	ID         int       `json:"id"`
	URL        string    `json:"url"`
	StatusCode int       `json:"status_code"`
	Latency    int64     `json:"latency"`
	CreatedAt  time.Time `json:"created_at"`
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

func (db *Database) GetLatestChecks() ([]Check, error) {
	query := `
		SELECT id, url, status_code, latency, created_at
		FROM checks
		WHERE id IN (
			SELECT MAX(id)
			FROM checks
			GROUP BY url
		)
		ORDER BY created_at DESC
	`

	rows, err := db.conn.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var checks []Check
	for rows.Next() {
		var c Check
		if err := rows.Scan(&c.ID, &c.URL, &c.StatusCode, &c.Latency, &c.CreatedAt); err != nil {
			return nil, err
		}
		checks = append(checks, c)
	}

	return checks, rows.Err()
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
