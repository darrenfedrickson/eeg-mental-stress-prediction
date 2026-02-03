import React from "react";

const ChannelSelector = ({ selectedChannels, onChannelChange }) => {

  // Preset definitions
  // Preset definitions
  // Golden 8 (Hag et al. 2023) mapped from indices [5, 8, 31, 3, 30, 14, 32, 4] -> [F3, FC5, F8, Fp1, F4, P7, Fp2, F7]
  const channels8 = ["F3", "FC5", "F8", "Fp1", "F4", "P7", "Fp2", "F7"];
  const channels32 = [
    "Fp1", "Fp2", "F7", "F3", "Fz", "F4", "F8", "FC5", "FC1", "FC2", "FC6",
    "T7", "C3", "Cz", "C4", "T8", "TP9", "CP5", "CP1", "CP2", "CP6", "TP10",
    "P7", "P3", "Pz", "P4", "P8", "PO9", "O1", "Oz", "O2", "PO10"
  ]; // Standard 32 channel map (modify if needed for specific headset)

  const handlePresetSelect = (preset) => {
    if (preset === "8") {
      onChannelChange(channels8);
    } else if (preset === "32") {
      onChannelChange(channels32);
    }
  };

  // Determine which is active
  const is8 = JSON.stringify(selectedChannels.sort()) === JSON.stringify([...channels8].sort());
  const is32 = selectedChannels.length > 8; // Naive check, sufficient for UX toggle

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        2. Select Channel Preset
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Choose your EEG headset configuration.
      </p>

      <div className="flex space-x-4">
        {/* 8 Channels Option */}
        <button
          onClick={() => handlePresetSelect("8")}
          className={`flex-1 py-4 px-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center space-y-2
            ${is8
              ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
              : "border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
        >
          <span className="text-lg font-bold">8 Channels</span>
          <span className="text-xs text-center opacity-70">
            For rapid testing & consumer headsets
          </span>
        </button>

        {/* 32 Channels Option */}
        <button
          onClick={() => handlePresetSelect("32")}
          className={`flex-1 py-4 px-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center space-y-2
            ${is32
              ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
              : "border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
        >
          <span className="text-lg font-bold">32 Channels</span>
          <span className="text-xs text-center opacity-70">
            Full research-grade configuration
          </span>
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Currently selected: <span className="font-medium text-gray-900 dark:text-gray-200">{selectedChannels.length} channels</span>
      </div>
    </div>
  );
};

export default ChannelSelector;
