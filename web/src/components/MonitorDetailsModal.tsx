import { useEffect, useState } from 'react'

interface DailyUptime {
    date: string
    uptime_percentage: number
    has_data: boolean
}

interface Incident {
    start_time: string
    end_time?: string
    duration: string
    status: string
}

interface MonitorDetails {
    url: string
    daily_uptimes: DailyUptime[]
    incidents: Incident[]
}

interface Props {
    url: string
    apiKey: string
    onClose: () => void
}

export default function MonitorDetailsModal({ url, apiKey, onClose }: Props) {
    const [details, setDetails] = useState<MonitorDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedDay, setSelectedDay] = useState<DailyUptime | null>(null)

    useEffect(() => {
        const fetchDetails = async () => {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
            try {
                const res = await fetch(`${API_URL}/api/monitor/details?url=${encodeURIComponent(url)}`, {
                    headers: { 'X-API-Key': apiKey }
                })
                if (!res.ok) throw new Error('Failed to fetch details')
                const data = await res.json()
                setDetails(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error')
            } finally {
                setLoading(false)
            }
        }
        fetchDetails()
    }, [url, apiKey])

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <h2 className="text-2xl font-bold text-slate-800 mb-6 pr-8 break-all">{url}</h2>

                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-300 border-t-blue-600"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {details && (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-3">90-Day Uptime History</h3>
                            <div className="flex flex-wrap gap-1">
                                {details.daily_uptimes.map((day, i) => {
                                    let bgColor = 'bg-slate-200'
                                    if (day.has_data) {
                                        bgColor = day.uptime_percentage >= 99 ? 'bg-emerald-400' : (day.uptime_percentage >= 90 ? 'bg-yellow-400' : 'bg-red-500')
                                    }
                                    return (
                                        <div 
                                            key={i} 
                                            onClick={() => setSelectedDay(day)}
                                            className={`w-3 h-8 sm:w-4 sm:h-10 rounded-sm ${bgColor} hover:brightness-90 transition-all cursor-pointer ${selectedDay?.date === day.date ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                                            title={`${day.date}: ${day.has_data ? day.uptime_percentage.toFixed(2) + '%' : 'No Data'}`}
                                        />
                                    )
                                })}
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 mt-2">
                                <span>90 days ago</span>
                                <span className="flex items-center gap-4">
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-400 rounded-sm"></div> 100%</span>
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-400 rounded-sm"></div> &gt;90%</span>
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-sm"></div> &lt;90%</span>
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-200 rounded-sm"></div> No Data</span>
                                </span>
                                <span>Today</span>
                            </div>

                            {selectedDay && (
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
                                    <div>
                                        <span className="font-semibold text-slate-800">{new Date(selectedDay.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className={`font-mono font-bold ${selectedDay.has_data ? (selectedDay.uptime_percentage >= 99 ? 'text-emerald-600' : 'text-red-600') : 'text-slate-500'}`}>
                                            {selectedDay.has_data ? `${selectedDay.uptime_percentage.toFixed(2)}% Uptime` : 'No Data'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Incidents</h3>
                            {details.incidents.length === 0 ? (
                                <p className="text-slate-500 text-sm">No incidents recorded in the last 30 days.</p>
                            ) : (
                                <div className="space-y-3">
                                    {details.incidents.map((inc, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50">
                                            <div className="mt-1">
                                                {inc.status === 'Resolved' ? (
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                                ) : (
                                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <span className="font-semibold text-slate-800">
                                                        {inc.status === 'Resolved' ? 'Outage Resolved' : 'Active Outage'}
                                                    </span>
                                                    <span className="text-sm font-mono text-slate-600">{inc.duration}</span>
                                                </div>
                                                <p className="text-sm text-slate-500">
                                                    Started: {new Date(inc.start_time).toLocaleString()}
                                                </p>
                                                {inc.end_time && (
                                                    <p className="text-sm text-slate-500">
                                                        Ended: {new Date(inc.end_time).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
