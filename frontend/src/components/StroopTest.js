import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../StroopTest.css';

// Difficulty config
const LEVELS = {
    1: { time: 7.0, label: 'Standard' },
    2: { time: 7.0, label: 'Elevated' },
    3: { time: 7.0, label: 'Critical' }
};



const COLORS = [
    { name: 'RED', hex: '#ef4444' },
    { name: 'BLUE', hex: '#3b82f6' },
    { name: 'GREEN', hex: '#22c55e' },
    { name: 'YELLOW', hex: '#eab308' },
    { name: 'PURPLE', hex: '#a855f7' },
    { name: 'ORANGE', hex: '#f97316' },
    { name: 'WHITE', hex: '#ffffff' },
    { name: 'BLACK', hex: '#000000' }
];

const StroopTest = () => {
    const navigate = useNavigate();

    // States: 'entry', 'instructions', 'playing', 'summary'
    const [gameState, setGameState] = useState('entry');
    const [playerName, setPlayerName] = useState('');
    const [highScores, setHighScores] = useState([]);

    // Game Logic State
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [level, setLevel] = useState(1);
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentWord, setCurrentWord] = useState(null); // { text: "RED", color: "#3b82f6" }
    const [options, setOptions] = useState([]); // Array of color objects
    const [flashState, setFlashState] = useState(''); // 'flash-correct' or 'flash-wrong'

    const timerRef = useRef(null);

    // Initial Load: Get High Scores
    useEffect(() => {
        const saved = localStorage.getItem('stroop_highscores');
        if (saved) {
            setHighScores(JSON.parse(saved));
        }
    }, []);

    // Timer Logic
    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 0.1), 100);
        } else if (gameState === 'playing' && timeLeft <= 0) {
            handleMiss();
        }
        return () => clearTimeout(timerRef.current);
    }, [timeLeft, gameState]);

    // --- LOGIC HELPERS ---

    const handleMiss = () => {
        setFlashState('flash-wrong');
        const newLives = lives - 1;
        setLives(newLives);

        if (newLives <= 0) {
            handleGameOver(score); // Pass current score
        } else {
            // Setup next round despite miss
            generateRound(level);
        }
    };

    const generateRound = (currentLevel) => {
        // Difficulty scaling
        const availableColors = currentLevel === 1 ? COLORS.slice(0, 4) : COLORS;

        // Pick a word (text)
        const wordObj = availableColors[Math.floor(Math.random() * availableColors.length)];

        // Pick a color (ink) - Force mismatch often? No, pure random is fine but mismatch is stroop.
        // Let's ensure mismatch sometimes for stroop effect.
        let colorObj = availableColors[Math.floor(Math.random() * availableColors.length)];
        // 50% chance to force mismatch if match
        if (wordObj === colorObj && Math.random() > 0.5) {
            colorObj = availableColors.filter(c => c !== wordObj)[0] || wordObj;
        }

        // Options: Scale with level
        const numOptions = currentLevel >= 2 ? 6 : 4;
        let roundOptions = [colorObj];

        while (roundOptions.length < numOptions) {
            const r = availableColors[Math.floor(Math.random() * availableColors.length)];
            // Avoid duplicates
            if (!roundOptions.includes(r)) roundOptions.push(r);
        }
        // Shuffle options
        roundOptions.sort(() => Math.random() - 0.5);

        setCurrentWord({ text: wordObj.name, color: colorObj.hex, answer: colorObj.name });
        setOptions(roundOptions);



        // Set Timer based on level and progress within level
        // Calculate points gained in current level
        let levelBaseScore = 0;
        if (currentLevel === 2) levelBaseScore = 6;
        if (currentLevel === 3) levelBaseScore = 16;

        const pointsInLevel = score - levelBaseScore;
        const decay = pointsInLevel * 0.5; // Decrease by 0.5s per correct answer
        let newTime = LEVELS[currentLevel].time - decay;

        // Clamp minimum time
        if (newTime < 0.8) newTime = 0.8;

        setTimeLeft(newTime);
    };

    const handleStartGame = () => {
        setScore(0);
        setLives(3);
        setLevel(1);
        setGameState('playing');
        generateRound(1);
    };

    const handleAnswer = (selectedColorName) => {
        if (selectedColorName === currentWord.answer) {
            // Correct
            const newScore = score + 1;
            setScore(newScore);

            setFlashState('flash-correct');
            setTimeout(() => setFlashState(''), 300);

            // Progression
            let nextLevel = level;
            if (newScore > 15) nextLevel = 3;
            else if (newScore > 5) nextLevel = 2;

            if (nextLevel !== level) {
                setLevel(nextLevel);
            }

            generateRound(nextLevel);
        } else {
            // Wrong
            handleMiss();
        }
    };

    const handleGameOver = (finalScore) => {
        // Use param or state score
        const s = finalScore !== undefined ? finalScore : score;
        setGameState('summary');
        // Update High Scores
        const newEntry = { name: playerName, score: s, date: new Date().toLocaleDateString() };
        const updatedScores = [...highScores, newEntry]
            .sort((a, b) => b.score - a.score)
            .slice(0, 5); // Keep top 5
        setHighScores(updatedScores);
        localStorage.setItem('stroop_highscores', JSON.stringify(updatedScores));
    };

    const handleDeleteScore = (index) => {
        const updatedScores = highScores.filter((_, i) => i !== index);
        setHighScores(updatedScores);
        localStorage.setItem('stroop_highscores', JSON.stringify(updatedScores));
    };

    // --- RENDERERS ---

    const renderEntry = () => (
        <div className="stroop-panel animate-fade-in-up">
            <div className="stroop-header">
                <div className="stroop-title">Stroop Protocol</div>
                <div className="stroop-subtitle">Subject Identification Required</div>
            </div>

            <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Subject Name</label>
                <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                    className="w-full bg-slate-900 border border-slate-700 p-3 text-white font-mono focus:border-blue-500 outline-none"
                    placeholder="ENTER ID..."
                    maxLength={10}
                />
            </div>

            <div className="mb-6">
                <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">Performance Archives</div>
                {highScores.length === 0 ? (
                    <div className="text-sm text-slate-600 italic py-4 text-center">No records found.</div>
                ) : (
                    <table className="highscore-table">
                        <tbody>
                            {highScores.map((s, i) => (
                                <tr key={i} className="highscore-row">
                                    <td>#{i + 1}</td>
                                    <td>{s.name}</td>
                                    <td className="text-right">{s.score}</td>
                                    <td className="text-right">
                                        <button
                                            onClick={() => handleDeleteScore(i)}
                                            className="text-red-500 hover:text-red-400 font-bold px-2 ml-2"
                                            title="Remove Entry"
                                        >
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <button
                className="stroop-btn"
                disabled={!playerName.trim()}
                onClick={() => setGameState('instructions')}
            >
                Initialize Protocol
            </button>
            <button className="stroop-btn text-xs mt-2 border-none hover:bg-transparent text-slate-500" onClick={() => navigate('/learn-more')}>Abort</button>
        </div>
    );

    const renderInstructions = () => (
        <div className="stroop-panel animate-fade-in-up">
            <div className="stroop-header">
                <div className="stroop-title text-red-500">WARNING</div>
                <div className="stroop-subtitle">Cognitive Dissonance Expected</div>
            </div>
            <p className="text-sm mb-4 leading-relaxed font-mono">
                PROTOCOL: You will be presented with a series of words.
            </p>
            <p className="text-lg mb-6 font-bold text-center text-white">
                IGNORE THE WORD. <br /> IDENTIFY THE COLOR.
            </p>
            <p className="text-xs text-slate-500 mb-6 border p-2 border-dashed border-slate-700">
                EXAMPLE: If you see <span style={{ color: '#3b82f6' }}>RED</span>, the answer is <span className="text-blue-500 font-bold">BLUE</span>.
            </p>
            <button className="stroop-btn" onClick={handleStartGame}>
                BEGIN TEST
            </button>
        </div>
    );

    const renderGame = () => (
        <div className="stroop-panel relative">
            <div className="flex justify-between text-xs text-slate-500 font-mono mb-4">
                <span>SUBJ: {playerName}</span>
                <span>LVL: {level} ({LEVELS[level].label})</span>
                <span>LIVES: <span className={lives < 2 ? 'text-red-500 animate-pulse' : 'text-teal-500'}>{"♥".repeat(lives)}</span></span>
                <span>SCORE: {score}</span>
            </div>

            {/* Timer Bar */}
            <div className="w-full h-2 bg-slate-800 mb-8 relative overflow-hidden">
                <div
                    className={`h-full ${timeLeft < 0.5 ? 'bg-red-500' : 'bg-teal-500'} transition-all duration-100 ease-linear`}
                    style={{ width: `${(timeLeft / LEVELS[level].time) * 100}%` }}
                ></div>
            </div>

            {/* Stimulus */}
            {currentWord && (
                <div className="stroop-word" style={{ color: currentWord.color }}>
                    {currentWord.text}
                </div>
            )}

            {/* Options */}
            <div className={`options-grid ${level >= 2 ? 'grid-6' : ''}`}>
                {options.map((opt, idx) => (
                    <button
                        key={idx}
                        className={`option-btn ${level === 3 && Math.random() > 0.7 ? 'distraction-glitch' : ''}`}
                        onClick={() => handleAnswer(opt.name)}
                    >
                        {opt.name}
                    </button>
                ))}
            </div>

            {/* Level 3 Overlay */}
            {level === 3 && (
                <div className="distraction-overlay" style={{ animationDuration: `${Math.random() * 2 + 1}s` }}></div>
            )}
        </div>
    );

    const renderSummary = () => (
        <div className="stroop-panel animate-fade-in-up text-center">
            <div className="stroop-header">
                <div className="stroop-title">TEST TERMINATED</div>
                <div className="stroop-subtitle">Data Saved</div>
            </div>

            <div className="my-8">
                <div className="text-slate-500 text-sm">FINAL SCORE</div>
                <div className="text-6xl font-bold text-white mb-2">{score}</div>
                <div className="text-teal-500 text-xs tracking-widest uppercase">
                    {score > 15 ? 'Excellent Cognitive Function' : score > 5 ? 'Standard Response' : 'Cognitive Strain Detected'}
                </div>
            </div>

            <button className="stroop-btn" onClick={() => setGameState('entry')}>
                Retry Protocol
            </button>
            <button className="stroop-btn mt-2" onClick={() => navigate('/learn-more')}>
                Return to Menu
            </button>
        </div>
    );

    return (
        <div className="stroop-container">
            <div className="stroop-scanlines"></div>
            <div className="stroop-overlay"></div>
            <div className={`fixed inset-0 pointer-events-none z-30 transition-colors duration-100 ${flashState === 'flash-wrong' ? 'bg-red-500/20' : flashState === 'flash-correct' ? 'bg-green-500/10' : ''}`}></div>

            {gameState === 'entry' && renderEntry()}
            {gameState === 'instructions' && renderInstructions()}
            {gameState === 'playing' && renderGame()}
            {gameState === 'summary' && renderSummary()}
        </div>
    );
};

export default StroopTest;
