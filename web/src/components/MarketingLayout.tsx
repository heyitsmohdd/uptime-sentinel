import React from 'react'

interface Props {
    children: React.ReactNode
    currentView: 'home' | 'benefits'
    onNavigate: (view: 'home' | 'benefits' | 'dashboard') => void
}

export default function MarketingLayout({ children, currentView, onNavigate }: Props) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col selection:bg-zinc-800">
            {/* Global Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-900/80 transition-all">
                <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div 
                        onClick={() => onNavigate('home')}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-700 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-100"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-zinc-100">Uptime Sentinel</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <button 
                            onClick={() => onNavigate('home')}
                            className={`text-sm font-medium transition-colors ${currentView === 'home' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                        >
                            Home
                        </button>
                        <button 
                            onClick={() => onNavigate('benefits')}
                            className={`text-sm font-medium transition-colors ${currentView === 'benefits' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                        >
                            Benefits & Features
                        </button>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors">
                            Documentation
                        </a>
                    </div>

                    <button 
                        onClick={() => onNavigate('dashboard')}
                        className="px-5 py-2.5 bg-zinc-100 text-zinc-950 text-sm font-semibold rounded-lg hover:bg-white hover:shadow-lg hover:shadow-zinc-100/10 transition-all active:scale-[0.98]"
                    >
                        Dashboard
                    </button>
                </div>
            </nav>

            {/* Page Content */}
            <main className="flex-1 pt-20">
                {children}
            </main>

            {/* Global Footer */}
            <footer className="w-full bg-zinc-950 border-t border-zinc-900 pt-16 pb-8 px-6 z-10 relative">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            </div>
                            <span className="text-lg font-bold text-zinc-100 tracking-tight">Uptime Sentinel</span>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mb-6">
                            The minimal, self-hosted microservice monitoring tool for modern builders. Track your endpoints with precision.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons Dummy */}
                            <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white cursor-pointer transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                            </div>
                            <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white cursor-pointer transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="text-zinc-100 font-semibold mb-4">Product</h4>
                        <ul className="space-y-3">
                            <li><button onClick={() => onNavigate('benefits')} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Features</button></li>
                            <li><button onClick={() => onNavigate('benefits')} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Integrations</button></li>
                            <li><button className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Changelog</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-zinc-100 font-semibold mb-4">Resources</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Documentation</a></li>
                            <li><a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">API Reference</a></li>
                            <li><a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Community</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto pt-8 border-t border-zinc-900/50 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-zinc-600 text-sm">© 2026 Uptime Sentinel. Open Source & Self Hosted.</p>
                    <div className="flex gap-6">
                        <span className="text-zinc-600 text-sm hover:text-zinc-400 cursor-pointer">Privacy Policy</span>
                        <span className="text-zinc-600 text-sm hover:text-zinc-400 cursor-pointer">Terms of Service</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}
