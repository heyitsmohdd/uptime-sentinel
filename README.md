# Uptime Sentinel

A lightweight, self-hosted monitoring tool for tracking the uptime and performance of your web services. Built with Go and React, it's designed to run on your own infrastructure without any external dependencies.

## What It Does

Uptime Sentinel continuously monitors your websites and APIs by making HTTP requests at regular intervals. For each check, it records the response status code and latency, giving you real-time insight into service health. The dashboard displays all your monitored endpoints with visual status indicators (green for healthy, red for issues) and performance metrics.

Think of it as a simple, no-frills alternative to services like Pingdom or StatusCake, but running entirely on your own server.

## Why Use This?

- **Self-Hosted**: Your monitoring data stays on your infrastructure
- **Lightweight**: Uses SQLite for storage, no complex database setup required
- **Simple Setup**: One backend binary and a static frontend
- **Real-Time Updates**: Dashboard auto-refreshes every 10 seconds
- **Concurrent Checks**: Uses Go routines to check multiple URLs in parallel

## Tech Stack

**Backend:**
- Go with standard library `net/http` (no heavy frameworks)
- SQLite for data persistence
- Structured logging with `slog`

**Frontend:**
- React + TypeScript
- Vite for development and building
- Tailwind CSS for styling
- SWR for API polling

## Getting Started

### Prerequisites

You'll need:
- Go 1.21 or higher
- Node.js 18 or higher
- npm (comes with Node.js)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/shariqattarr/uptime-sentinel.git
cd uptime-sentinel
```

**2. Install Go dependencies**

```bash
go mod download
```

**3. Install frontend dependencies**

```bash
cd web
npm install
cd ..
```

### Running the Application

**Option 1: Development Mode**

Start the backend server:

```bash
go run cmd/server/main.go
```

The API will be available at `http://localhost:8080`.

In a separate terminal, start the frontend:

```bash
cd web
npm run dev
```

The dashboard will open at `http://localhost:5173`.

**Option 2: Production Build**

Build the backend:

```bash
go build -o uptime-server cmd/server/main.go
./uptime-server
```

Build the frontend:

```bash
cd web
npm run build
```

The production files will be in `web/dist/`. Serve them with any static file server.

## Using the Dashboard

Once both servers are running, open `http://localhost:5173` in your browser.

**Adding a monitor:**
1. Enter a URL in the "Add New Monitor" section
2. Click "Add Monitor"
3. The system will start checking that URL every 60 seconds

**Viewing status:**
- Green badge = HTTP 200-299 (healthy)
- Red badge = Any other status or timeout
- Latency is shown in milliseconds

## API Endpoints

### GET /api/status

Returns the latest check results for all monitored URLs.

**Example response:**
```json
[
  {
    "id": 1,
    "url": "https://example.com",
    "status_code": 200,
    "latency": 142,
    "created_at": "2024-01-18T00:00:00Z"
  }
]
```

### POST /api/monitor

Adds a new URL to the monitoring list.

**Request body:**
```json
{
  "url": "https://yoursite.com"
}
```

**Response:**
```json
{
  "status": "added"
}
```

## Project Structure

```
uptime-sentinel/
├── cmd/server/          # Main entry point for the HTTP server
├── internal/
│   ├── db/             # Database layer (SQLite operations)
│   └── monitor/        # Monitoring service (polling logic)
├── web/                # React frontend
│   └── src/
│       └── components/ # UI components
├── go.mod              # Go dependencies
└── README.md
```

## How It Works

**Backend Flow:**
1. On startup, the monitor service loads any existing URLs from the database
2. A ticker fires every 60 seconds to trigger checks
3. For each URL, a goroutine makes an HTTP request with a 10-second timeout
4. Results (status code, latency) are saved to SQLite
5. The API serves the latest check for each URL

**Frontend Flow:**
1. Dashboard fetches `/api/status` every 10 seconds using SWR
2. Results are displayed in a responsive grid
3. Users can add new URLs via a form that POSTs to `/api/monitor`

## Configuration

By default:
- Backend runs on port `8080`
- Frontend dev server runs on port `5173`
- Check interval is `60 seconds`
- HTTP timeout is `10 seconds`

To change these, modify the constants in the respective files:
- Backend: `cmd/server/main.go` and `internal/monitor/service.go`
- Frontend: `web/vite.config.ts` and `web/src/App.tsx`

## Data Storage

All check results are stored in an SQLite database file (`uptime.db`) created in the directory where you run the server. The schema includes:

- `id`: Auto-incrementing primary key
- `url`: The monitored endpoint
- `status_code`: HTTP response status
- `latency`: Response time in milliseconds
- `created_at`: Timestamp of the check

## Contributing

This is a straightforward project built with standard tools. If you find bugs or want to add features, feel free to open issues or submit pull requests.

## License

MIT License - feel free to use this in your own projects.

## Future Ideas

- Historical uptime graphs
- Email/Slack notifications on downtime
- Configurable check intervals per URL
- Multi-user authentication
- Export data to CSV or JSON
