import React from 'react'

interface Props {
    onNavigate: (view: 'home' | 'benefits' | 'dashboard') => void
}

export default function BenefitsPage({ onNavigate }: Props) {
    return (
        <div className="w-full pb-24">
            {/* Header */}
            <div className="pt-24 pb-16 text-center px-6 border-b border-zinc-900 animate-in opacity-0">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 text-zinc-100">
                    Why Uptime Sentinel?
                </h1>
                <p className="text-xl text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed">
                    We built the exact monitoring tool we always wanted. Fast, self-hosted, extremely minimal, and built to catch outages before your customers do.
                </p>
            </div>

            {/* Benefit 1: 24/7 Engine */}
            <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-16 border-b border-zinc-900/50 animate-in opacity-0 delay-100">
                <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase">
                        Performance
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 tracking-tight">Sleep peacefully. We poll every 60 seconds.</h2>
                    <p className="text-lg text-zinc-400 leading-relaxed font-light">
                        Our high-performance Go backend utilizes lightweight goroutines to continuously ping your endpoints. Whether you are tracking 1 URL or 1000, the polling engine handles it with microsecond precision, ensuring you never miss a blip in your infrastructure.
                    </p>
                </div>
                <div className="flex-1 w-full relative">
                    <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full"></div>
                    <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-zinc-800/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                                </div>
                                <div>
                                    <div className="text-zinc-100 font-semibold text-lg">Polling Engine</div>
                                    <div className="text-zinc-500 text-sm">Active & Healthy</div>
                                </div>
                            </div>
                            <span className="text-emerald-500 font-mono bg-emerald-500/10 px-3 py-1 rounded-full text-sm">1.2ms latency</span>
                        </div>
                        <div className="space-y-3 font-mono text-sm text-zinc-400">
                            <div className="flex justify-between"><span className="text-zinc-500">GET https://api.yoursite.com</span><span className="text-emerald-400">200 OK</span></div>
                            <div className="flex justify-between"><span className="text-zinc-500">GET https://auth.yoursite.com</span><span className="text-emerald-400">200 OK</span></div>
                            <div className="flex justify-between"><span className="text-zinc-500">GET https://db.yoursite.com</span><span className="text-emerald-400">200 OK</span></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefit 2: Instant Alerts */}
            <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col md:flex-row-reverse items-center gap-16 border-b border-zinc-900/50">
                <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold tracking-wide uppercase">
                        Alerting
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 tracking-tight">Instant Webhooks. Zero delay.</h2>
                    <p className="text-lg text-zinc-400 leading-relaxed font-light">
                        The exact second an outage begins, Uptime Sentinel fires a webhook to your Discord, Slack, or PagerDuty. You'll know your site is down before your users even have a chance to complain. And when it comes back up, you get a beautiful recovery ping.
                    </p>
                </div>
                <div className="flex-1 w-full relative">
                    <div className="absolute inset-0 bg-red-500/10 blur-[100px] rounded-full"></div>
                    <div className="relative bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 backdrop-blur-sm">
                        {/* Mock Discord Message */}
                        <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
                            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            </div>
                            <div>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="font-bold text-zinc-100">Uptime Bot</span>
                                    <span className="text-xs text-zinc-500 bg-zinc-800 px-1 rounded">APP</span>
                                    <span className="text-xs text-zinc-600">Today at 4:32 AM</span>
                                </div>
                                <div className="bg-[#2b2d31] border-l-4 border-red-500 rounded p-3 mt-2">
                                    <div className="font-bold text-red-400 mb-1">Monitor DOWN: api.startup.com</div>
                                    <div className="text-zinc-300 text-sm mb-2">The service returned a 503 Service Unavailable error.</div>
                                    <div className="text-xs text-zinc-500 font-mono">Downtime started: 4:32:01 AM</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefit 3: Beautiful Analytics */}
            <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
                        Analytics
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 tracking-tight">90-Day Analytics. Crystal clear.</h2>
                    <p className="text-lg text-zinc-400 leading-relaxed font-light">
                        We don't just tell you if you're up right now. We aggregate every single ping into a massive, highly optimized SQLite database. Click on any monitor to instantly visualize a beautiful 90-day uptime grid and an automated log of all historical incidents.
                    </p>
                </div>
                <div className="flex-1 w-full relative">
                    <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full"></div>
                    <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
                        <h3 className="text-zinc-100 font-semibold mb-4">90-Day Uptime History</h3>
                        <div className="flex flex-wrap gap-1 mb-4">
                            {Array.from({length: 60}).map((_, i) => (
                                <div key={i} className={`w-3 h-8 rounded-sm ${Math.random() > 0.05 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-zinc-500 uppercase tracking-wider font-medium">
                            <span>60 days ago</span>
                            <span>99.9% Uptime</span>
                            <span>Today</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="max-w-4xl mx-auto px-6 mt-16">
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-6 tracking-tight">Ready to gain absolute visibility?</h2>
                    <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
                        Stop guessing if your services are online. Deploy Uptime Sentinel in seconds and start monitoring immediately.
                    </p>
                    <button 
                        onClick={() => onNavigate('dashboard')}
                        className="px-8 py-4 bg-zinc-100 text-zinc-950 rounded-xl font-semibold text-lg hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    )
}
