import React, { useState } from "react";
import FileUploadCard from "./shared/FileUploadCard";
import ChannelSelector from "./shared/ChannelSelector";
import { FiUpload } from "react-icons/fi";
import API_BASE_URL from "../config";

const DataUpload = ({ setPrediction, setStressScore, setVisualizations, setFeatures, setExplanation, setHeatmap, setActiveTab }) => {
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
      const res = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success") {
        console.log("✅ Analysis Complete. Model Used:", data.model_used); // Debug Log
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
          score: data.stress_score
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
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Data Upload</h2>

      {/* File Upload (Includes Model Select) */}
      <FileUploadCard
        file={file}
        setFile={setFile}
        modelType={modelType}
        setModelType={setModelType}
      />

      {/* Channel Selector */}
      <ChannelSelector
        selectedChannels={selectedChannels}
        onChannelChange={setSelectedChannels}
      />

      {/* Upload & Analyze button */}
      <div className="flex justify-end">
        <button
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white ${loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
            }`}
          onClick={handleAnalyze}
          disabled={loading || !file}
        >
          <FiUpload size={20} className="text-white" />
          <span>{loading ? "Processing..." : "Upload & Analyze"}</span>
        </button>
      </div>
    </div>
  );
};

export default DataUpload;
