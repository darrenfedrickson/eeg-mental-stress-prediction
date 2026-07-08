import React, { useState } from "react";
import FileUploadCard from "./shared/FileUploadCard";
import ChannelSelector from "./shared/ChannelSelector";
import { FiUpload, FiInfo } from "react-icons/fi";
import { useToast } from "../context/ToastContext";

const DataUpload = ({ setPrediction, setStressScore, setVisualizations, setFeatures, setExplanation, setHeatmap, setActiveTab }) => {
  const { addToast } = useToast();
  const [file, setFile] = useState(null);
  const [selectedChannels, setSelectedChannels] = useState([
    "F3", "FC5", "F8", "Fp1", "F4", "P7", "Fp2", "F7"
  ]);
  const [modelType, setModelType] = useState("freqband");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("channels", JSON.stringify(selectedChannels));
    formData.append("model", modelType); // Send selected model

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success") {
        addToast("Analysis Complete! Results Ready.", "success");
        setPrediction(data.prediction); // "High", "Medium", "Low"
        setStressScore(data.stress_score);
        if (data.visualizations) {
          setVisualizations(data.visualizations);
        }
        // setFeatures(data.features); // Backend doesn't return this yet
        if (data.explanation) {
          setExplanation(data.explanation);
        }
        if (data.heatmap) {
          setHeatmap(data.heatmap);
        }

        // --- SAVE TO HISTORY ---
        const historyItem = {
          id: Date.now(),
          date: new Date().toLocaleString(),
          fileName: file.name,
          prediction: data.prediction,
          score: data.stress_score,
          model: data.model_used || modelType, // Save Model Type
          explanation: data.explanation,
          heatmap: data.heatmap,
        };



        try {
          const history = JSON.parse(localStorage.getItem("analysis_history") || "[]");
          const newHistory = [historyItem, ...history].slice(0, 50); // Keep last 50
          localStorage.setItem("analysis_history", JSON.stringify(newHistory));
        } catch (e) {
          console.error("Failed to save history:", e);
        }

        // --- AUTO NAVIGATE TO STRESS PREDICTION ---
        if (setActiveTab) {
          setActiveTab("prediction");
        }

      } else {
        addToast("Error: " + data.message, "error");
      }
    } catch (err) {
      console.error("Upload error:", err);
      addToast("Upload Failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Data Upload</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          <FileUploadCard
            file={file}
            setFile={setFile}
            modelType={modelType}
            setModelType={setModelType}
          />

          {/* Upload & Analyze button */}
          <div className="flex justify-end">
            <button
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-medium transition-all shadow-lg hover:shadow-xl ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1e6c80] hover:bg-[#165a6b] hover:scale-[1.02]"
                }`}
              onClick={handleAnalyze}
              disabled={loading || !file}
            >
              <FiUpload size={20} className="text-white" />
              <span>{loading ? "Processing..." : "Upload & Analyze"}</span>
            </button>
          </div>
        </div>

        {/* Right Column: System Info */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md h-full border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <FiInfo className="text-blue-500" size={20} />
              Analysis Pipeline
            </h3>

            <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300">

              {/* Preprocessing */}
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs">1</span>
                  Preprocessing
                </h4>
                <ul className="list-disc pl-9 space-y-1 mt-2">
                  <li><strong>Filtering:</strong> 1-50Hz Bandpass Filter to remove noise.</li>
                  <li><strong>Normalization:</strong> Z-Score Standardization for scaling.</li>
                  <li><strong>8 Channels:</strong> Best used for stress prediction (F3, FC5, F8, Fp1, F4, P7, Fp2, F7).</li>
                </ul>
              </div>

              {/* Model Logic */}
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs">2</span>
                  AI Model Logic
                </h4>
                <div className="space-y-4 py-2 pl-8">
                  <p className="leading-relaxed">
                    We use <span className="font-semibold text-gray-800 dark:text-gray-200">ANFIS</span> (Neuro-Fuzzy System) which fuses <strong>Neural Networks</strong> with <strong>Fuzzy Logic</strong> for human-like reasoning.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex gap-2">
                      <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                      <span><strong>Different Lenses:</strong> PSD analyzes wave <strong>Energy</strong> (colors), while Hybrid also analyzes wave <strong>Shape/Complexity</strong> (details).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-purple-500 mt-1 flex-shrink-0">•</span>
                      <span><strong>Micro-Patterns:</strong> Captures irregularities (complexity) that pure frequency models might miss, leading to more precise detection.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Accuracy Stats */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-xs uppercase tracking-wider">Model Accuracy</h4>
                <div className="space-y-3">

                  <div className="flex justify-between items-center group">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Hybrid (PSD + Hjorth)</span>
                    </div>
                    <span className="font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded text-xs">94.28%</span>
                  </div>

                  <div className="flex justify-between items-center opacity-75 group">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      <span className="font-medium">PSD Only</span>
                    </div>
                    <span className="font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded text-xs">80.56%</span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DataUpload;
