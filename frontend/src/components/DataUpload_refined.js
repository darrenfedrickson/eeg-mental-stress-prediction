import React, { useState } from "react";
import FileUploadCard from "./shared/FileUploadCard";
import ChannelSelector from "./shared/ChannelSelector";
import { FiUpload } from "react-icons/fi";
import API_BASE_URL from "../config";

const DataUpload = () => {
  const [file, setFile] = useState(null);
  const [selectedChannels, setSelectedChannels] = useState([
    "F3", "FC5", "F8", "Fp1", "F4", "P7", "Fp2", "F7"
  ]);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [features, setFeatures] = useState([]);
  const [explanation, setExplanation] = useState(null);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setPrediction(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("channels", JSON.stringify(selectedChannels));

    try {
      const res = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setPrediction(data.predicted_level);
      setFeatures(data.features);
      setExplanation(data.explanation);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error: Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          EEG Stress Prediction System
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload EEG data, select your preferred channel combination, and predict stress levels automatically.
        </p>
      </div>

      {/* Upload Section */}
      <FileUploadCard file={file} setFile={setFile} />

      {/* Channel Selection */}
      <ChannelSelector
        selectedChannels={selectedChannels}
        onChannelChange={setSelectedChannels}
      />

      {/* Analyze Button */}
      <div className="flex justify-end">
        <button
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium ${loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
            }`}
          onClick={handleAnalyze}
          disabled={loading || !file}
        >
          <FiUpload size={20} className="text-white" />
          <span>{loading ? "Processing EEG..." : "Upload & Analyze"}</span>
        </button>
      </div>

      {/* Results Section */}
      {prediction !== null && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            🧠 Stress Prediction Result
          </h3>

          <p className="text-lg">
            Prediction:{" "}
            <span
              className={`font-bold ${prediction > 0.5 ? "text-red-500" : "text-green-600"
                }`}
            >
              {prediction > 0.5 ? "Stressed" : "Relaxed"}
            </span>
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Channels used: {selectedChannels.join(", ")}
          </p>

          <div className="mt-4 border-t border-gray-300 dark:border-gray-700 pt-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Explanation (Top contributing features):</strong>
            </p>
            <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400">
              {explanation?.important_features?.map((feat, i) => (
                <li key={i}>
                  Feature #{feat} — Weight: {explanation.weights[i]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataUpload;
