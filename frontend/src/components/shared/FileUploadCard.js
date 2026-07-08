import React, { useRef, useState, useEffect } from "react";
import { FiUpload, FiChevronUp } from "react-icons/fi";

export default function FileUploadCard({
  file,
  setFile,
  modelType,
  setModelType,
}) {
  const fileInputRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const models = [
    {
      id: "freqband",
      label: "PSD Model",
      category: "Frequency Analysis"
    },
    {
      id: "hjorth",
      label: "Hjorth + PSD Model",
      category: "Hybrid Analysis"
    }
  ];

  const currentModel = models.find(m => m.id === modelType) || models[0];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4 border border-gray-200 dark:border-gray-700 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-xl font-bold font-sans tracking-tight">Select EEG File & Model</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload .csv or .mat files.
          </p>
        </div>
      </div>


      {/* Upload Box */}
      <div
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 h-48 cursor-pointer transition-all duration-200 
          ${file
            ? "border-blue-500 bg-blue-50/10"
            : "border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 font-sans"
          }`}
        onClick={handleUploadClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <FiUpload size={40} className={file ? "text-blue-500 mb-2" : "text-gray-400 mb-2"} />
        {file ? (
          <div className="text-center">
            <p className="text-blue-600 dark:text-blue-400 font-medium truncate max-w-xs">{file.name}</p>
            <p className="text-xs text-gray-500 mt-1">Click to change file</p>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Drag & drop your EEG file here, <br />
            <span className="text-blue-600 font-medium">or click to browse</span>
          </p>
        )}
      </div>

      {/* AI Style Model Picker (Bottom Right Floating) */}
      <div className="flex justify-end mt-4 relative" ref={dropdownRef}>
        <div className="relative">
          {/* Dropdown Menu (Opens Upwards) */}
          {isDropdownOpen && (
            <div className="absolute bottom-full right-0 mb-3 w-72 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="py-2">
                <div className="px-5 py-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-transparent">
                  Model
                </div>
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setModelType(m.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-5 py-3 transition-colors ${modelType === m.id
                      ? "bg-gray-100 dark:bg-[#1e6c80] text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                      }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{m.label}</span>
                      <span className={`text-[10px] mt-0.5 ${modelType === m.id ? 'text-gray-500 dark:text-blue-100/70' : 'text-gray-400 dark:text-gray-500'}`}>
                        {m.id === "freqband" ? "Standard PSD Analysis" : "Advanced Hybrid Analysis"}
                      </span>
                    </div>
                    {modelType === m.id && (
                      <div className="w-2 h-2 rounded-full bg-[#1e6c80] dark:bg-white shadow-[0_0_8px_rgba(30,108,128,0.5)]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trigger Button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border transition-all duration-200 ${isDropdownOpen
              ? "bg-gray-100 dark:bg-[#1e6c80] border-[#1e6c80] dark:border-[#1e6c80] text-gray-900 dark:text-white shadow-lg"
              : "bg-white dark:bg-[#1e293b] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
          >
            <FiChevronUp size={18} className={`${isDropdownOpen ? 'text-current' : 'text-gray-500'} transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            <span className="text-sm font-semibold tracking-tight">
              {currentModel.label}
            </span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".csv,.mat"
        onChange={handleFileChange}
      />
    </div>
  );
}
