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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const fetcher = ([url, apiKey]: [string, string]) => 
    fetch(url, { headers: { 'X-API-Key': apiKey } }).then(async (res) => {
        if (!res.ok) throw new Error(await res.text())
        return res.json()
    })

function App() {
    const [refreshKey, setRefreshKey] = useState(0)
    const [apiKey, setApiKey] = useState(localStorage.getItem('uptime_api_key') || '')
    const [keyInput, setKeyInput] = useState('')

    const { data, error, isLoading } = useSWR<Check[]>(
        [`${API_URL}/api/status?refresh=${refreshKey}`, apiKey],
        fetcher,
        {
            refreshInterval: 10000,
            shouldRetryOnError: false
        }
    )

    const handleSaveKey = (e: React.FormEvent) => {
        e.preventDefault()
        localStorage.setItem('uptime_api_key', keyInput)
        setApiKey(keyInput)
        setRefreshKey(k => k + 1)
    }

    const handleLogout = () => {
        localStorage.removeItem('uptime_api_key')
        setApiKey('')
    }

    const handleMonitorAdded = () => {
        setRefreshKey((prev) => prev + 1)
    }

    const handleDeleteMonitor = async (url: string) => {
        try {
            await fetch(`${API_URL}/api/monitor?url=${encodeURIComponent(url)}`, {
                method: 'DELETE',
                headers: { 'X-API-Key': apiKey }
            })
            setRefreshKey((prev) => prev + 1)
        } catch (err) {
            console.error('Failed to delete monitor', err)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Auth Modal overlay if no API Key is set and unauthorized */}
            {(!apiKey || (error && error.message.includes('unauthorized'))) && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Authentication Required</h2>
                        <p className="text-slate-600 mb-6">Please enter your API Key to access the dashboard.</p>
                        <form onSubmit={handleSaveKey} className="flex flex-col gap-4">
                            <input
                                type="password"
                                value={keyInput}
                                onChange={(e) => setKeyInput(e.target.value)}
                                placeholder="Enter API Key"
                                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Access Dashboard
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                <header className="mb-12 flex justify-between items-start">
                    <div>
                        <h1 className="text-5xl font-bold text-slate-800 mb-2">
                            Uptime Sentinel
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Self-hosted microservice monitoring
                        </p>
                    </div>
                    {apiKey && (
                        <button 
                            onClick={handleLogout}
                            className="text-sm px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Logout
                        </button>
                    )}
                </header>

                <div className="mb-8">
                    <AddMonitorForm onMonitorAdded={handleMonitorAdded} apiKey={apiKey} />
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
                            <StatusCard 
                                key={check.id} 
                                check={check} 
                                onDelete={() => handleDeleteMonitor(check.url)} 
                            />
                        ))}
                </div>
            </div>
        </div>
    )
}

export default App
