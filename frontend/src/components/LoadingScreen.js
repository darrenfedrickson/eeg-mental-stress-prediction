import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ fading, text = "Initializing System..." }) => {
    return (
        <div className={`loading-screen-container ${fading ? 'fade-out' : ''}`}>
            {/* Background ambient effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="scanline"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
            </div>

            <div className="signal-wrapper">
                <div className="signal-glow"></div>
                <div className="signal-container flex items-center justify-center">
                    <svg viewBox="0 0 500 150" className="w-full h-full">
                        {/* Minimal grid lines for tech feel */}
                        <pattern id="grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        </pattern>
                        <rect width="500" height="150" fill="url(#grid)" />

                        {/* Static baseline - faint */}
                        <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" strokeDasharray="4 4" />

                        {/* Ghost signal (delayed) */}
                        <path
                            className="eeg-wave-ghost"
                            d="M0,75 L100,75 L110,60 L120,90 L130,50 L140,100 L150,40 L160,110 L170,75 L250,75 L260,75 L270,55 L280,95 L290,75 L400,75 L410,65 L420,85 L430,75 L500,75"
                        />

                        {/* Main Animated signal path */}
                        <path
                            className="eeg-wave"
                            d="M0,75 L100,75 L110,60 L120,90 L130,50 L140,100 L150,40 L160,110 L170,75 L250,75 L260,75 L270,55 L280,95 L290,75 L400,75 L410,65 L420,85 L430,75 L500,75"
                        />
                    </svg>
                </div>
            </div>

            <div className="loading-text mt-8 text-4xl md:text-6xl font-medium tracking-tight leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 drop-shadow-sm font-sans z-10 pb-1">
                {text}
            </div>

            {/* Small status indicator below text */}
            <div className="mt-4 flex items-center gap-2 text-slate-500 text-xs uppercase tracking-[0.2em] font-medium z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                Processing Signals
            </div>
        </div>
    );
};

export default LoadingScreen;
