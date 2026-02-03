import React, { useState, useEffect } from "react";

const Dashboard = ({ setActiveTab }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("analysis_history") || "[]");
    setHistory(saved);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this analysis record? This cannot be undone.")) {
      const updated = history.filter(item => item.id !== id);
      setHistory(updated);
      localStorage.setItem("analysis_history", JSON.stringify(updated));
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to CLEAR ALL history?")) {
      setHistory([]);
      localStorage.removeItem("analysis_history");
    }
  };

  // Calculations
  const avgScore = history.length > 0
    ? history.reduce((acc, item) => acc + (parseFloat(item.score) || 0), 0) / history.length
    : 0;

  let scoreColor = "text-green-500";
  if (avgScore > 1.5) scoreColor = "text-red-500";
  else if (avgScore > 0.5) scoreColor = "text-yellow-500";

  return (
    <div className="space-y-6">
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
            className="w-full mb-3 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
          >
            New Analysis
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className="w-full py-2 px-4 bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition shadow-sm font-medium"
          >
            View Reports
          </button>
        </div>
      </div>

      {/* Analysis History */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Analysis History</h3>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
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
                <th className="px-4 py-2">Stress Level</th>
                <th className="px-4 py-2">Peak Score</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {history.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-400">
                    No analysis history found. Upload a file to start.
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition group">
                    <td className="px-4 py-2">{item.date}</td>
                    <td className="px-4 py-2 font-mono text-xs">{item.fileName}</td>
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
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
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
