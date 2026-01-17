import { useState } from 'react'
import useSWR from 'swr'
import StatusCard from './components/StatusCard'
import AddMonitorForm from './components/AddMonitorForm'

interface Check {
    id: number
    url: string
    status_code: number
    latency: number
    created_at: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function App() {
    const [refreshKey, setRefreshKey] = useState(0)
    const { data, error, isLoading } = useSWR<Check[]>(
        `http://localhost:8080/api/status?refresh=${refreshKey}`,
        fetcher,
        {
            refreshInterval: 10000,
        }
    )

    const handleMonitorAdded = () => {
        setRefreshKey((prev) => prev + 1)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto px-4 py-8">
                <header className="mb-12">
                    <h1 className="text-5xl font-bold text-slate-800 mb-2">
                        Uptime Sentinel
                    </h1>
                    <p className="text-slate-600 text-lg">
                        Self-hosted microservice monitoring
                    </p>
                </header>

                <div className="mb-8">
                    <AddMonitorForm onMonitorAdded={handleMonitorAdded} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading && (
                        <div className="col-span-full text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-blue-600"></div>
                            <p className="mt-4 text-slate-600">Loading monitors...</p>
                        </div>
                    )}

                    {error && (
                        <div className="col-span-full bg-red-50 border border-red-200 rounded-lg p-6">
                            <p className="text-red-800 font-medium">
                                Failed to load monitoring data
                            </p>
                            <p className="text-red-600 text-sm mt-1">
                                Make sure the backend server is running on port 8080
                            </p>
                        </div>
                    )}

                    {data && data.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-slate-500 text-lg">
                                No monitors yet. Add a URL to get started.
                            </p>
                        </div>
                    )}

                    {data &&
                        data.map((check) => (
                            <StatusCard key={check.id} check={check} />
                        ))}
                </div>
            </div>
        </div>
    )
}

export default App
