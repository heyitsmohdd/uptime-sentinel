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
            className="bg-zinc-900/40 rounded-2xl hover:bg-zinc-900/60 transition-all duration-300 p-6 border border-zinc-800/50 flex flex-col h-full cursor-pointer group hover:border-zinc-700/50"
        >
            <div className="flex items-start justify-between mb-6 gap-4">
                <h3 className="text-lg font-semibold text-zinc-100 break-all group-hover:text-white transition-colors">
                    {stat.url}
                </h3>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="text-zinc-600 hover:text-red-400 transition-colors p-1 bg-zinc-950/50 rounded-lg hover:bg-zinc-900"
                    title="Delete monitor"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/30 flex flex-col items-center text-center">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mb-2">Uptime</span>
                    <span className="text-xl font-bold text-zinc-100">
                        {stat.uptime_percentage ? `${stat.uptime_percentage.toFixed(2)}%` : '--%'}
                    </span>
                </div>
                <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/30 flex flex-col items-center text-center">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mb-2">Latency</span>
                    <span className="text-xl font-bold text-zinc-100">
                        {stat.average_latency ? `${Math.round(stat.average_latency)}ms` : '--'}
                    </span>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-500">Current Status</span>
                    {stat.status_code ? <StatusBadge statusCode={stat.status_code} /> : <span className="text-sm font-medium text-zinc-600">Pending</span>}
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-500">Current Latency</span>
                    <span className="text-sm font-mono font-semibold text-zinc-300">
                        {stat.latency ? `${stat.latency}ms` : '--'}
                    </span>
                </div>
            </div>

            <div className="mt-auto pt-5 border-t border-zinc-800/50">
                <div className="flex items-end justify-end gap-1 h-8 mb-4 opacity-80 group-hover:opacity-100 transition-opacity w-full overflow-hidden">
                    {stat.history && stat.history.length > 0 ? (
                        stat.history.slice(-40).map((h, i) => {
                            const isUp = h.status_code >= 200 && h.status_code < 400;
                            return (
                                <div 
                                    key={i} 
                                    className={`w-2 h-full rounded-sm flex-shrink-0 ${isUp ? 'bg-emerald-500/80' : 'bg-red-500/80'}`}
                                    title={`${new Date(h.created_at).toLocaleTimeString()} | Status: ${h.status_code} | Latency: ${h.latency}ms`}
                                />
                            )
                        })
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-zinc-600 font-medium tracking-wide">No history yet</div>
                    )}
                </div>
                
                <div className="flex items-center justify-between">
                    <p className="text-[10px] text-zinc-600 font-medium tracking-wider uppercase truncate max-w-[60%]">
                        Last checked: {formatDate(stat.created_at)}
                    </p>
                    <span className="text-[10px] font-bold text-zinc-500 group-hover:text-emerald-400 transition-colors uppercase tracking-wider flex items-center gap-1">
                        View History <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </span>
                </div>
            </div>
        </div>
    )
}
