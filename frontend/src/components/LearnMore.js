import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import profilePhoto from "./assets/IMG_5823.jpg";
import fypPoster from "./assets/FYP POSTER.pdf";

const LearnMore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [fading, setFading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copiedSupervisor, setCopiedSupervisor] = useState(false);

    // Initial load animation
    useEffect(() => {
        const fadeTimer = setTimeout(() => setFading(true), 800);
        const removeTimer = setTimeout(() => setLoading(false), 1600);
        return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
    }, []);

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans relative selection:bg-teal-500 selection:text-white">
            {loading && <LoadingScreen fading={fading} text="Accessing Archives..." />}

            <div className="max-w-4xl mx-auto px-6 py-12">
                <header className="mb-12 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Neurostress Insight</h1>
                        <p className="text-slate-500 text-sm uppercase tracking-widest">Research & Development Division</p>
                    </div>
                    <button
                        onClick={handleBack}
                        className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
                    >
                        ← Return Home
                    </button>
                </header>

                <main className="space-y-16">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-6 border-l-4 border-blue-500 pl-4">The Science of Stress</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            Mental stress triggers distinct physiological responses in the brain. Using EEG signals, we can detect specific patterns—specifically changes in Alpha and Beta wave activity—that correlate with cognitive load and emotional strain.
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            Our system utilizes Hjorth parameters (Activity, Mobility, Complexity) and Power Spectral Density (PSD) to quantify these signals in real-time, providing an objective measure of your mental state.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-6 border-l-4 border-blue-500 pl-4">Data Source: SAM-40 Dataset</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            This project is built upon the <strong>SAM-40 (Stress Assessment Model)</strong> dataset, a comprehensive collection of EEG recordings from 40 participants subjected to various stress-inducing tasks.
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            The dataset specifically isolates the physiological markers of stress during the <strong>Stroop Color-Word Test</strong>, providing a high-fidelity ground truth for training our predictive models.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-6 border-l-4 border-teal-500 pl-4">Cognitive Baseline Tests</h2>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-teal-500/50 transition-all group">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                                        <h3 className="text-xl font-bold text-white">The Stroop Color Test</h3>
                                    </div>
                                    <p className="text-slate-400 mb-6">
                                        A neuropsychological test widely used to assess the ability to inhibit cognitive interference.
                                    </p>

                                    <div className="bg-slate-950/50 rounded-lg p-4 mb-6 border border-slate-800">
                                        <h4 className="text-sm font-bold text-teal-400 mb-2 uppercase tracking-widest">Mission Directives</h4>
                                        <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside">
                                            <li><strong>Objective:</strong> Identify the <span className="text-white">COLOR</span> of the text, NOT the word itself.</li>
                                            <li><strong>Controls:</strong> Select the matching button from the grid.</li>
                                            <li><strong>Lives:</strong> You have <span className="text-red-400">3 LIVES</span>. Mistakes or timeouts lose a life.</li>
                                            <li><strong>Difficulty:</strong> Speed increases with every correct answer.</li>
                                        </ul>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="px-3 py-1 bg-slate-800 rounded text-xs text-slate-400 font-mono">SOURCE: SAM-40</div>
                                        <div className="px-3 py-1 bg-slate-800 rounded text-xs text-slate-400 font-mono">TYPE: COGNITIVE</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/stroop-test')}
                                    className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg shadow-lg shadow-teal-900/20 transition-all transform group-hover:translate-x-1 whitespace-nowrap"
                                >
                                    Start Protocol →
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="border-t border-slate-800 pt-16">
                        <h2 className="text-2xl font-semibold text-white mb-8 border-l-4 border-indigo-500 pl-4">Project Team</h2>

                        <div className="flex flex-col gap-6">
                            {/* Student Card */}
                            <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800 flex flex-col md:flex-row items-center gap-8 backdrop-blur-sm shadow-xl shadow-black/20">
                                {/* Avatar */}
                                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-600 to-teal-400 p-[3px] shrink-0 shadow-lg shadow-blue-500/20">
                                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden relative">
                                        <img
                                            src={profilePhoto}
                                            alt="Darryl"
                                            className="w-full h-full object-cover object-top"
                                            style={{ imageRendering: '-webkit-optimize-contrast' }}
                                        />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="text-center md:text-left flex-1">
                                    <h3 className="text-3xl font-bold text-white mb-2">Darren Fedrickson Anak Jonathan</h3>
                                    <div className="text-teal-400 font-mono text-xs tracking-widest uppercase mb-4 font-semibold">Lead Researcher & Full Stack Developer</div>
                                    <p className="text-slate-400 leading-relaxed text-sm md:text-base mb-6">
                                        Final Year Student in Universiti Teknologi Mara (UiTM) Shah Alam specializing in Neuro-Computing and AI. Dedicated to bridging the gap between biological signals and digital interpretation to create accessible mental health monitoring solutions.
                                    </p>

                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                                        <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">React.js & Tailwind</span>
                                        <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">Python (FastAPI)</span>
                                        <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">Neuro-Fuzzy (ANFIS)</span>
                                        <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">Signal Processing (MNE)</span>
                                        <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">Docker</span>
                                    </div>

                                    <a
                                        href={fypPoster}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/50 rounded-lg text-indigo-300 text-sm font-semibold transition-all hover:text-white group"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l5.414 5.414a1 1 0 01.586 1.414V19a2 2 0 01-2 2z" />
                                        </svg>
                                        View Research Poster
                                    </a>

                                    <div className="flex flex-wrap gap-3 mt-4">
                                        {/* Instagram */}
                                        <a
                                            href="https://www.instagram.com/dfdrksn/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600/10 hover:bg-pink-600/30 border border-pink-500/30 rounded-lg text-pink-300 text-sm font-semibold transition-all hover:text-white group"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                            </svg>
                                            Instagram
                                        </a>

                                        {/* LinkedIn */}
                                        <a
                                            href="https://www.linkedin.com/in/darren-fedrickson-jonathan-a41039204/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-300 text-sm font-semibold transition-all hover:text-white group"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                            </svg>
                                            LinkedIn
                                        </a>

                                        {/* Email (Copy to Clipboard) */}
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText("dafedrickson1380@gmail.com");
                                                setCopied(true);
                                                setTimeout(() => setCopied(false), 2000);
                                            }}
                                            className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold transition-all group ${copied
                                                ? "bg-green-500/20 border-green-500/50 text-green-300"
                                                : "bg-slate-700/30 hover:bg-slate-700/50 border-slate-600/50 text-slate-300 hover:text-white"
                                                }`}
                                        >
                                            {copied ? (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    dafedrickson1380@gmail.com
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Supervisor Card */}
                            <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800 flex flex-col md:flex-row items-center gap-8 backdrop-blur-sm shadow-xl shadow-black/20">
                                {/* Avatar */}
                                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-400 p-[3px] shrink-0 shadow-lg shadow-purple-500/20">
                                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden relative">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="text-center md:text-left flex-1">
                                    <div className="text-center md:text-left flex-1">
                                        <h3 className="text-3xl font-bold text-white mb-2">Dr. Azlin Binti Ahmad</h3>
                                        <div className="text-indigo-400 font-mono text-xs tracking-widest uppercase mb-4 font-semibold">Project Supervisor</div>
                                        <p className="text-slate-400 leading-relaxed text-sm md:text-base mb-6">
                                            Faculty of Computer and Mathematical Sciences, Universiti Teknologi Mara (UiTM) Shah Alam.
                                        </p>

                                        <div className="flex flex-wrap gap-3">
                                            {/* Email (Copy to Clipboard) */}
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText("azlin121@uitm.edu.my");
                                                    setCopiedSupervisor(true);
                                                    setTimeout(() => setCopiedSupervisor(false), 2000);
                                                }}
                                                className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold transition-all group ${copiedSupervisor
                                                    ? "bg-green-500/20 border-green-500/50 text-green-300"
                                                    : "bg-slate-700/30 hover:bg-slate-700/50 border-slate-600/50 text-slate-300 hover:text-white"
                                                    }`}
                                            >
                                                {copiedSupervisor ? (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                        azlin121@uitm.edu.my
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div >
    );
};

export default LearnMore;
