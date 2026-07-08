import React, { useState, useEffect } from "react";
import { FiEye, FiX } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { useToast } from "../context/ToastContext";

const Dashboard = ({ setActiveTab }) => {
  const { addToast } = useToast();
  const [history, setHistory] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null); // For Modal

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("analysis_history") || "[]");
    setHistory(saved);
  }, []);

  const [confirmAction, setConfirmAction] = useState({ isOpen: false, type: null, id: null });

  const handleDeleteClick = (id) => {
    setConfirmAction({ isOpen: true, type: 'delete', id });
  };

  const handleClearAllClick = () => {
    setConfirmAction({ isOpen: true, type: 'clear', id: null });
  };

  const confirmActionHandler = () => {
    if (confirmAction.type === 'delete') {
      const updated = history.filter(item => item.id !== confirmAction.id);
      setHistory(updated);
      localStorage.setItem("analysis_history", JSON.stringify(updated));
      addToast("Analysis record deleted.", "success");
    } else if (confirmAction.type === 'clear') {
      setHistory([]);
      localStorage.removeItem("analysis_history");
      addToast("All history cleared.", "success");
    }
    setConfirmAction({ isOpen: false, type: null, id: null });
  };

  // --- CONFIRM MODAL ---
  const ConfirmModal = () => {
    if (!confirmAction.isOpen) return null;

    const isClearAll = confirmAction.type === 'clear';
    const title = isClearAll ? "Clear All History?" : "Delete Analysis?";
    const message = isClearAll
      ? "Are you sure you want to delete ALL records? This action cannot be undone."
      : "Are you sure you want to delete this record? This cannot be undone.";

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100 animate-pop-in border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isClearAll ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
              }`}>
              <FiX size={24} />
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message}</p>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setConfirmAction({ isOpen: false, type: null, id: null })}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmActionHandler}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition font-medium shadow-sm ${isClearAll ? "bg-red-600 hover:bg-red-700" : "bg-orange-500 hover:bg-orange-600"
                  }`}
              >
                {isClearAll ? "Yes, Clear All" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Calculations
  const avgScore = history.length > 0
    ? history.reduce((acc, item) => acc + (parseFloat(item.score) || 0), 0) / history.length
    : 0;

  let scoreColor = "text-green-500";
  if (avgScore > 1.5) scoreColor = "text-red-500";
  else if (avgScore > 0.5) scoreColor = "text-yellow-500";

  // --- RESULT MODAL ---
  const ResultModal = ({ analysis, onClose }) => {
    if (!analysis) return null;

    // Transform explanation for chart
    // analysis.explanation could be undefined for old records
    const limeData = (analysis.explanation || []).map((item) => ({
      name: item[0],
      importance: item[1],
      fill: item[1] > 0 ? "#ff4d4f" : "#52c41a"
    }));

    const hasExplanation = limeData.length > 0;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col relative animate-pop-in">

          {/* Header */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
            <div>
              <h2 className="text-xl font-bold">Analysis Results</h2>
              <p className="text-xs text-gray-500 mt-1 font-mono">{analysis.fileName} • {analysis.date}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
              <FiX size={24} />
            </button>
          </div>

          <div className="p-6 space-y-8">

            {/* Score & Prediction Summary */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Stress Level</h4>
                <div className={`text-2xl font-bold px-3 py-1 inline-block rounded-full ${analysis.prediction === "Low" ? "bg-green-100 text-green-800" :
                  analysis.prediction === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                  }`}>
                  {analysis.prediction} Stress
                </div>
              </div>
              <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Peak Score</h4>
                <div className="text-3xl font-mono font-bold text-gray-900 dark:text-gray-100">
                  {Number(analysis.score).toFixed(4)}
                </div>
              </div>
              <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Model Used</h4>
                <div className="text-lg font-medium text-gray-700 dark:text-gray-300 uppercase">
                  {analysis.model === 'freqband' ? 'PSD Analysis' : analysis.model === 'hjorth' ? 'Hybrid Analysis' : analysis.model || 'Unknown'}
                </div>
              </div>
            </div>

            {/* Visualizations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* LIME Chart */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Top Influential Features (LIME)
                </h3>
                {hasExplanation ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={limeData} margin={{ left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis type="number" domain={[-0.004, 0.004]} hide />
                        <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10 }} interval={0} />
                        <Tooltip />
                        <Bar dataKey="importance" name="Impact" radius={[0, 4, 4, 0]}>
                          {limeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400 text-sm bg-gray-50 dark:bg-gray-800 rounded-lg">
                    No explanation data recorded for this run.
                  </div>
                )}
              </div>

              {/* Heatmap */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center">
                <h3 className="text-sm font-bold mb-4 w-full flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Stress Localization
                </h3>
                {analysis.heatmap ? (
                  <div className="relative">
                    <img src={analysis.heatmap} alt="Stress Heatmap" className="w-56 h-56 object-contain" />
                    <div className="absolute bottom-0 right-0 bg-white/80 dark:bg-black/50 text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                      Red = High Stress Contribution
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 flex items-center justify-center text-gray-400 text-sm bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-100 dark:border-gray-700">
                    No heatmap generated.
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <ConfirmModal />
      {selectedAnalysis && (
        <ResultModal analysis={selectedAnalysis} onClose={() => setSelectedAnalysis(null)} />
      )}

      <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>

      {/* 3-card grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Recent Analysis -> Total Analyses */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Analysis Count</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {history.length}
            </div>
            <div className="text-sm text-gray-500 mt-2">Total Files Analyzed</div>
          </div>
        </div>

        {/* Data Quality -> Avg Stress Score */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Average Stress Score</h3>
          <div className="text-center">
            <div className={`text-4xl font-bold ${scoreColor}`}>
              {avgScore.toFixed(3)}
            </div>
            <div className="text-sm text-gray-500 mt-2">Based on History (Baseline)</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
          <button
            onClick={() => setActiveTab('upload')}
            className="w-full py-2 px-4 bg-[#1e6c80] text-white rounded-lg hover:bg-[#165a6b] transition shadow-sm font-medium"
          >
            New Analysis
          </button>
        </div>
      </div>

      {/* Analysis History */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Analysis History</h3>
          {history.length > 0 && (
            <button
              onClick={handleClearAllClick}
              className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition text-xs font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">File</th>
                <th className="px-4 py-2">Model</th>
                <th className="px-4 py-2">Stress Level</th>
                <th className="px-4 py-2">Peak Score</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {history.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                    No analysis history found. Upload a file to start.
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition group">
                    <td className="px-4 py-2">{item.date}</td>
                    <td className="px-4 py-2 font-mono text-xs">{item.fileName}</td>
                    <td className="px-4 py-2 text-xs text-gray-500 uppercase font-semibold">
                      {item.model === 'freqband' ? 'PSD' : item.model === 'hjorth' ? 'Hybrid' : item.model || '-'}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.prediction === "Low" ? "bg-green-100 text-green-800" :
                          item.prediction === "Medium" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }`}
                      >
                        {item.prediction}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      {Number(item.score).toFixed(4)}
                    </td>
                    <td className="px-4 py-2 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedAnalysis(item)}
                        className="text-gray-400 hover:text-blue-600 transition p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="View Results"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className="text-gray-400 hover:text-red-600 transition p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete Record"
                      >
                        {/* Trash Icon SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

