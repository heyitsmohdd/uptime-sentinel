import React from 'react'

interface Props {
    onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: Props) {
    return (
        <div className="w-full flex flex-col items-center">
            {/* Hero */}
            <main className="flex-1 w-full max-w-6xl flex flex-col items-center justify-center px-6 text-center z-10 relative mt-16 md:mt-24">
                {/* Subtle background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-800/20 blur-[120px] rounded-full pointer-events-none animate-in opacity-0"></div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 mb-8 backdrop-blur-md animate-in opacity-0 delay-100">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-[pulse_2s_ease-in-out_infinite]"></span>
                    <span className="text-xs font-semibold text-zinc-300 tracking-wider uppercase">All Systems Operational</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 pb-2 leading-tight animate-in opacity-0 delay-200">
                    Monitor your services <br/> with absolute clarity.
                </h1>
                
                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 font-light tracking-wide leading-relaxed animate-in opacity-0 delay-300">
                    A beautiful, self-hosted microservice monitoring tool. Track 24/7 uptime, analyze historical latency, and get instant webhook alerts before your users even notice.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-in opacity-0" style={{ animationDelay: '400ms' }}>
                    <button 
                        onClick={onGetStarted}
                        className="group relative px-8 py-4 bg-zinc-100 text-zinc-950 rounded-xl font-semibold text-lg overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-zinc-100/10"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                        <span className="relative flex items-center gap-2">
                            Get Started
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                        </span>
                    </button>
                    <a 
                        href="https://github.com" 
                        target="_blank" rel="noreferrer"
                        className="px-8 py-4 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 text-zinc-300 rounded-xl font-medium text-lg transition-all hover:bg-zinc-800 hover:text-white flex items-center justify-center gap-2 hover:border-zinc-700"
                    >
                        View Documentation
                    </a>
                </div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-32 w-full text-left border-t border-zinc-900/50 pt-16">
                    <div className="p-8 rounded-2xl bg-zinc-900/20 border border-zinc-800/30 backdrop-blur-md hover:border-zinc-700/50 transition-colors animate-in opacity-0" style={{ animationDelay: '500ms' }}>
                        <div className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mb-6 text-zinc-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </div>
                        <h3 className="text-xl font-semibold text-zinc-100 mb-3">24/7 Polling Engine</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed font-light">High-performance Go backend continuously checks your endpoints with microsecond precision and persists data efficiently.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-zinc-900/20 border border-zinc-800/30 backdrop-blur-md hover:border-zinc-700/50 transition-colors animate-in opacity-0" style={{ animationDelay: '600ms' }}>
                        <div className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mb-6 text-zinc-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path></svg>
                        </div>
                        <h3 className="text-xl font-semibold text-zinc-100 mb-3">90-Day Analytics</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed font-light">Beautifully visualize historical uptime grids and automatically log detailed incident timelines for complete operational transparency.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-zinc-900/20 border border-zinc-800/30 backdrop-blur-md hover:border-zinc-700/50 transition-colors animate-in opacity-0" style={{ animationDelay: '700ms' }}>
                        <div className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mb-6 text-zinc-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"></path><polyline points="15 9 18 9 22 13"></polyline><path d="M16 22v-2"></path></svg>
                        </div>
                        <h3 className="text-xl font-semibold text-zinc-100 mb-3">Instant Webhooks</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed font-light">Get pinged in Discord or Slack the exact second an outage begins or resolves, keeping your team instantly informed.</p>
                    </div>
                </div>
            </main>
        </div>
    )
}
