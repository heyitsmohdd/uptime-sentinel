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
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative border border-zinc-800/50">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-zinc-500 hover:text-zinc-300 transition-colors bg-zinc-800/50 hover:bg-zinc-800 p-2 rounded-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <h2 className="text-2xl font-bold text-zinc-100 mb-6 pr-12 break-all">{url}</h2>

                {loading && (
                    <div className="flex justify-center py-16">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-zinc-800 border-t-zinc-400"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-950/30 border border-red-900/50 text-red-400 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {details && (
                    <div className="space-y-10">
                        <div>
                            <h3 className="text-lg font-semibold text-zinc-100 mb-4 tracking-wide">90-Day Uptime History</h3>
                            <div className="flex flex-wrap gap-1">
                                {details.daily_uptimes.map((day, i) => {
                                    let bgColor = 'bg-zinc-800/50'
                                    if (day.has_data) {
                                        bgColor = day.uptime_percentage >= 99 ? 'bg-emerald-500' : (day.uptime_percentage >= 90 ? 'bg-yellow-500' : 'bg-red-500')
                                    }
                                    return (
                                        <div 
                                            key={i} 
                                            onClick={() => setSelectedDay(day)}
                                            className={`w-3 h-8 sm:w-4 sm:h-10 rounded-sm ${bgColor} hover:brightness-110 transition-all cursor-pointer ${selectedDay?.date === day.date ? 'ring-2 ring-zinc-400 ring-offset-2 ring-offset-zinc-900' : ''}`}
                                            title={`${day.date}: ${day.has_data ? day.uptime_percentage.toFixed(2) + '%' : 'No Data'}`}
                                        />
                                    )
                                })}
                            </div>
                            <div className="flex justify-between text-xs text-zinc-500 mt-3 font-medium uppercase tracking-wider">
                                <span>90 days ago</span>
                                <span className="flex items-center gap-4">
                                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-500 rounded-sm"></div> 100%</span>
                                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-yellow-500 rounded-sm"></div> &gt;90%</span>
                                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-red-500 rounded-sm"></div> &lt;90%</span>
                                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-zinc-800/50 rounded-sm border border-zinc-700/50"></div> No Data</span>
                                </span>
                                <span>Today</span>
                            </div>

                            {selectedDay && (
                                <div className="mt-6 p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl flex items-center justify-between shadow-inner">
                                    <div>
                                        <span className="font-medium text-zinc-300">{new Date(selectedDay.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className={`font-mono font-bold text-lg ${selectedDay.has_data ? (selectedDay.uptime_percentage >= 99 ? 'text-emerald-400' : 'text-red-400') : 'text-zinc-500'}`}>
                                            {selectedDay.has_data ? `${selectedDay.uptime_percentage.toFixed(2)}% Uptime` : 'No Data Recorded'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-zinc-800/50 pt-8">
                            <h3 className="text-lg font-semibold text-zinc-100 mb-4 tracking-wide">Recent Incidents</h3>
                            {details.incidents.length === 0 ? (
                                <div className="p-6 rounded-xl border border-dashed border-zinc-800 flex items-center justify-center">
                                    <p className="text-zinc-500 text-sm font-medium">No incidents recorded in the last 30 days. Perfect uptime!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {details.incidents.map((inc, i) => (
                                        <div key={i} className="flex items-start gap-4 p-5 rounded-xl border border-zinc-800/50 bg-zinc-950/30 hover:bg-zinc-950/50 transition-colors">
                                            <div className="mt-1">
                                                {inc.status === 'Resolved' ? (
                                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                                ) : (
                                                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-2">
                                                    <span className={`font-semibold ${inc.status === 'Resolved' ? 'text-zinc-200' : 'text-red-400'}`}>
                                                        {inc.status === 'Resolved' ? 'Outage Resolved' : 'Active Outage'}
                                                    </span>
                                                    <span className="text-sm font-mono font-medium text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">{inc.duration}</span>
                                                </div>
                                                <p className="text-sm text-zinc-500 font-medium">
                                                    Started: {new Date(inc.start_time).toLocaleString()}
                                                </p>
                                                {inc.end_time && (
                                                    <p className="text-sm text-zinc-500 font-medium">
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
