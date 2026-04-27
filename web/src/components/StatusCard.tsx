import StatusBadge from './StatusBadge'

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
    uptime_percentage: number
    average_latency: number
    history: CheckHistory[]
}

interface StatusCardProps {
    stat: MonitorStats
    onDelete: () => void
    onClick: () => void
}

export default function StatusCard({ stat, onDelete, onClick }: StatusCardProps) {
    const formatDate = (dateString: string) => {
        if (!dateString || dateString === '0001-01-01T00:00:00Z') return 'Pending...'
        const date = new Date(dateString)
        return date.toLocaleString()
    }

    return (
        <div 
            onClick={onClick}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-slate-200 flex flex-col h-full cursor-pointer"
        >
            <div className="flex items-start justify-between mb-4 gap-4">
                <h3 className="text-lg font-semibold text-slate-800 break-all">
                    {stat.url}
                </h3>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    title="Delete monitor"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col items-center text-center">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Uptime</span>
                    <span className="text-xl font-bold text-slate-800">
                        {stat.uptime_percentage ? `${stat.uptime_percentage.toFixed(2)}%` : '--%'}
                    </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col items-center text-center">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Avg Latency</span>
                    <span className="text-xl font-bold text-slate-800">
                        {stat.average_latency ? `${Math.round(stat.average_latency)}ms` : '--'}
                    </span>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Current Status</span>
                    {stat.status_code ? <StatusBadge statusCode={stat.status_code} /> : <span className="text-sm font-medium text-slate-400">Pending</span>}
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Current Latency</span>
                    <span className="text-sm font-mono font-semibold text-slate-800">
                        {stat.latency ? `${stat.latency}ms` : '--'}
                    </span>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100">
                <div className="flex items-end gap-[2px] h-8 mb-3">
                    {stat.history && stat.history.length > 0 ? (
                        stat.history.map((h, i) => {
                            const isUp = h.status_code >= 200 && h.status_code < 400;
                            return (
                                <div 
                                    key={i} 
                                    className={`flex-1 h-full rounded-sm ${isUp ? 'bg-emerald-400' : 'bg-red-500'} hover:brightness-90 transition-all cursor-pointer`}
                                    title={`${new Date(h.created_at).toLocaleTimeString()} | Status: ${h.status_code} | Latency: ${h.latency}ms`}
                                />
                            )
                        })
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No history yet</div>
                    )}
                </div>
                <p className="text-xs text-slate-500 text-center">
                    Last checked: {formatDate(stat.created_at)}
                </p>
            </div>
        </div>
    )
}
