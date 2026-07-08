import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import brainLogo from "./components/assets/brain.png";
import LoadingScreen from "./components/LoadingScreen";

const LandingPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [fading, setFading] = useState(false);

    // Simulate system initialization with fade out
    useEffect(() => {
        // Start fade out after 2s
        const fadeTimer = setTimeout(() => {
            setFading(true);
        }, 2000);

        // Remove loading screen after fade finishes (2s + 0.8s transition)
        const removeTimer = setTimeout(() => {
            setLoading(false);
        }, 2800);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 text-white overflow-hidden relative font-sans selection:bg-blue-500 selection:text-white">
            {/* Show Loading Screen until fully removed */}
            {loading && <LoadingScreen fading={fading} text="Welcome!" />}

            {/* Video Background (Static from public folder) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                {/* Fallback color */}
                <div className="absolute inset-0 bg-slate-900" />
                <video
                    key="landing-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    src="/landing_v2.mp4"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ opacity: 0.3 }}
                />
                {/* Subtle Overlays */}
                <div className="absolute inset-0 bg-slate-950/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                {/* Animated Mesh Gradients */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Navbar / Header */}
            <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <img src={brainLogo} alt="Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white/90 flex flex-col leading-none">
                        <span>Neurostress</span>
                        <span>Insight</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/app')}
                        className="group relative px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/40 transition-all duration-300 font-medium text-sm flex items-center gap-2"
                    >
                        <span>Try Demo</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-20 pb-32 max-w-5xl mx-auto">
                <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 backdrop-blur-md text-blue-200 text-xs font-semibold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    AI-Powered Analysis
                </div>

                <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-slate-100">
                    Decode Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Mental State</span> <br />
                    With Precision
                </h2>

                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
                    Advanced EEG analysis meets state-of-the-art machine learning.
                    Real-time stress prediction, comprehensive insights, and
                    data-driven mental health monitoring.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <button
                        onClick={() => navigate('/app')}
                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-bold text-lg shadow-xl shadow-blue-600/20 transition-all transform hover:scale-105"
                    >
                        Get Started Now
                    </button>
                    <button
                        onClick={() => navigate('/learn-more')}
                        className="px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-lg shadow-xl shadow-black/40 transition-all transform hover:scale-105"
                    >
                        Learn More
                    </button>
                </div>

                <div className="mt-20 mb-4 italic text-2xl md:text-3xl font-serif text-slate-300 opacity-90 text-center max-w-3xl">
                    "Mental Health Is Not Optional—It’s <span className="text-blue-400 font-bold not-italic">fundaMental</span>."
                </div>

                {/* Info Section */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
                    {[
                        { title: "Real-time Processing", desc: "Instant feedback on your mental state using advanced signal processing.", color: "bg-blue-500" },
                        { title: "High Accuracy", desc: "Leveraging Hjorth parameters and PSD for precise stress detection.", color: "bg-teal-500" },
                        { title: "Visual Analytics", desc: "Interactive charts and stress meters for intuitive understanding.", color: "bg-indigo-500" }
                    ].map((feature, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-slate-400">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-32 w-full">
                    <h3 className="text-3xl font-bold text-white mb-10 text-center">System Impact & Analysis</h3>
                    <div className="relative w-full max-w-sm mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/20 aspect-[9/16] bg-slate-900">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            controls
                            src="/landing_v2.mp4"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

            </main>
        </div>
    );
};

export default LandingPage;
