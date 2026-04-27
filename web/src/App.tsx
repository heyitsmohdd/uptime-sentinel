import { useState, useEffect } from 'react'
import useSWR from 'swr'
import StatusCard from './components/StatusCard'
import AddMonitorForm from './components/AddMonitorForm'
import MonitorDetailsModal from './components/MonitorDetailsModal'
import LandingPage from './components/LandingPage'
import MarketingLayout from './components/MarketingLayout'
import BenefitsPage from './components/BenefitsPage'

interface CheckHistory {
    status_code: number
    latency: number
    created_at: string
}

interface MonitorStats {
    url: string
    status_code: number
    latency: number
    created_at: string
    history: CheckHistory[]
    uptime_percentage: number
    average_latency: number
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function App() {
    const [refreshKey, setRefreshKey] = useState(0)
    const [apiKey, setApiKey] = useState(localStorage.getItem('uptime_api_key') || '')
    const [keyInput, setKeyInput] = useState('')
    const [selectedMonitor, setSelectedMonitor] = useState<string | null>(null)
    const [view, setView] = useState<'home' | 'benefits' | 'dashboard'>('home')

    const { data, error, isLoading } = useSWR<MonitorStats[]>(
        [`${API_URL}/api/status?refresh=${refreshKey}`, apiKey],
        async ([url, key]) => {
            if (!key) return null
            const res = await fetch(url as string, {
                headers: { 'X-API-Key': key }
            })
            if (!res.ok) throw new Error('Not authorized or server error')
            return res.json()
        },
        { refreshInterval: 60000, revalidateOnFocus: false }
    )

    useEffect(() => {
        if (apiKey) {
            localStorage.setItem('uptime_api_key', apiKey)
        } else {
            localStorage.removeItem('uptime_api_key')
        }
    }, [apiKey])

    const handleMonitorAdded = () => {
        setRefreshKey(prev => prev + 1)
    }

    const handleDeleteMonitor = async (url: string) => {
        if (!confirm(`Are you sure you want to stop monitoring ${url}?`)) return
        try {
            await fetch(`${API_URL}/api/monitor?url=${encodeURIComponent(url)}`, {
                method: 'DELETE',
                headers: { 'X-API-Key': apiKey }
            })
            setRefreshKey(prev => prev + 1)
        } catch (err) {
            console.error('Failed to delete monitor:', err)
        }
    }

    const handleAuth = () => {
        if (keyInput.trim()) {
            setApiKey(keyInput.trim())
            setKeyInput('')
        }
    }

    const handleLogout = () => {
        setApiKey('')
    }

    if (view === 'home') {
        return (
            <MarketingLayout currentView="home" onNavigate={setView}>
                <LandingPage onGetStarted={() => setView('dashboard')} />
            </MarketingLayout>
        )
    }

    if (view === 'benefits') {
        return (
            <MarketingLayout currentView="benefits" onNavigate={setView}>
                <BenefitsPage onNavigate={setView} />
            </MarketingLayout>
        )
    }

    return (
        <MarketingLayout currentView="dashboard" onNavigate={setView}>
            <div className="relative selection:bg-zinc-800 pb-24">
                {!data && !error && apiKey === '' && (
                    <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-center z-[60] p-4">
                        <div className="bg-zinc-900/80 backdrop-blur-md p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md border border-zinc-800/50">
                            <div className="flex justify-center mb-6">
                                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-center text-zinc-100 mb-6 tracking-tight">Authentication Required</h2>
                            <input
                                type="password"
                                placeholder="Enter Dashboard API Key"
                                value={keyInput}
                                onChange={(e) => setKeyInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAuth()
                                }}
                                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent text-zinc-100 mb-4 placeholder-zinc-600 transition-all"
                            />
                            <button 
                                onClick={handleAuth}
                                className="w-full bg-zinc-100 text-zinc-950 font-semibold py-3 rounded-xl transition-all hover:bg-white hover:shadow-lg hover:shadow-zinc-100/10 active:scale-[0.98]"
                            >
                                Unlock Dashboard
                            </button>
                        </div>
                    </div>
                )}

                {selectedMonitor && (
                    <MonitorDetailsModal 
                        url={selectedMonitor} 
                        apiKey={apiKey} 
                        onClose={() => setSelectedMonitor(null)} 
                    />
                )}

                <div className="container mx-auto px-6 py-12 max-w-6xl animate-in opacity-0">
                    <header className="mb-12 flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-700 flex items-center justify-center shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-100"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight leading-none mb-1">Dashboard</h1>
                                <p className="text-zinc-500 text-sm font-medium">Manage and view your active monitors</p>
                            </div>
                        </div>
                        {apiKey && (
                            <button 
                                onClick={handleLogout}
                                className="px-5 py-2 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                            >
                                Logout
                            </button>
                        )}
                    </header>

                    <div className="mb-10 animate-in opacity-0 delay-100">
                        <AddMonitorForm onMonitorAdded={handleMonitorAdded} apiKey={apiKey} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading && (
                            <div className="col-span-full text-center py-20">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-zinc-800 border-t-zinc-400"></div>
                                <p className="mt-4 text-zinc-500 font-medium tracking-wide">Loading monitors...</p>
                            </div>
                        )}

                        {error && (
                            <div className="col-span-full bg-red-950/30 border border-red-900/50 rounded-xl p-6 backdrop-blur-sm">
                                <p className="text-red-400 font-medium mb-1">
                                    Failed to load monitoring data
                                </p>
                                <p className="text-red-500/70 text-sm">
                                    Make sure the backend server is running on port 8080 and your API key is correct.
                                </p>
                            </div>
                        )}

                        {data && data.length === 0 && (
                            <div className="col-span-full text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
                                <p className="text-zinc-500 text-lg font-medium">
                                    No monitors yet. Add a URL to get started.
                                </p>
                            </div>
                        )}

                        {data &&
                            data.map((stat, idx) => (
                                <div key={stat.url} className={`animate-in opacity-0`} style={{ animationDelay: `${(idx % 6) * 100 + 200}ms` }}>
                                    <StatusCard 
                                        stat={stat} 
                                        onDelete={() => handleDeleteMonitor(stat.url)} 
                                        onClick={() => setSelectedMonitor(stat.url)}
                                    />
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </MarketingLayout>
    )
}

export default App
