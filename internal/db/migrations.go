package db

func (db *Database) runMigrations() error {
	query := `
	CREATE TABLE IF NOT EXISTS checks (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		url TEXT NOT NULL,
		status_code INTEGER NOT NULL,
		latency INTEGER NOT NULL,
		created_at DATETIME NOT NULL
	);
	CREATE INDEX IF NOT EXISTS idx_url ON checks(url);
	CREATE INDEX IF NOT EXISTS idx_created_at ON checks(created_at);
	`

	_, err := db.conn.Exec(query)
	return err
}
