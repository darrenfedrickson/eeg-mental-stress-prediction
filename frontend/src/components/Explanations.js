import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell } from 'recharts';

const CHANNEL_POSITIONS = {
  "Cz": { "left": "50.36%", "top": "50.27%" },
  "Fz": { "left": "50.37%", "top": "28.64%" },
  "Fp1": { "left": "38.41%", "top": "12.54%" },
  "F7": { "left": "22.26%", "top": "29.35%" },
  "F3": { "left": "33.43%", "top": "29.34%" },
  "FC1": { "left": "39.86%", "top": "39.51%" },
  "C3": { "left": "30.05%", "top": "51.14%" },
  "FC5": { "left": "23.71%", "top": "40.73%" },
  "FT9": { "left": "8.33%", "top": "37.04%" },
  "T7": { "left": "18.21%", "top": "52.71%" },
  "CP5": { "left": "24.01%", "top": "62.72%" },
  "CP1": { "left": "39.75%", "top": "61.53%" },
  "P3": { "left": "33.73%", "top": "72.03%" },
  "P7": { "left": "23.85%", "top": "73.57%" },
  "PO9": { "left": "26.41%", "top": "87.64%" },
  "O1": { "left": "39.84%", "top": "86.21%" },
  "Pz": { "left": "50.26%", "top": "71.73%" },
  "Oz": { "left": "50.07%", "top": "86.31%" },
  "O2": { "left": "60.31%", "top": "86.11%" },
  "PO10": { "left": "73.32%", "top": "87.80%" },
  "P8": { "left": "76.31%", "top": "73.54%" },
  "P4": { "left": "67.33%", "top": "72.04%" },
  "CP2": { "left": "61.49%", "top": "61.55%" },
  "CP6": { "left": "77.46%", "top": "62.76%" },
  "T8": { "left": "82.17%", "top": "52.59%" },
  "FT10": { "left": "91.67%", "top": "37.36%" },
  "FC6": { "left": "77.44%", "top": "40.49%" },
  "C4": { "left": "70.88%", "top": "51.08%" },
  "FC2": { "left": "60.87%", "top": "39.48%" },
  "F4": { "left": "67.63%", "top": "29.01%" },
  "F8": { "left": "79.21%", "top": "28.68%" },
  "Fp2": { "left": "62.13%", "top": "12.20%" }
};

const Explanations = ({ explanation, heatmap, stressScore }) => {
  // explanation is [[feature_name, weight], ...]
  // Transform for Recharts
  const data = (explanation || []).map((item, index) => ({
    name: item[0], // Feature Name
    importance: item[1], // Weight
    fill: item[1] > 0 ? "#ff4d4f" : "#52c41a" // Red for + (Stress), Green for - (Relax)
  }));

  const hasData = data.length > 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Model Explanations & Localization</h2>

      {!hasData ? (
        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
          No explanations available. Please run a prediction first.
        </div>
      ) : (
        <div className="flex flex-col gap-8">

          {/* LIME Bar Chart */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Top Influential Brain Features (LIME)</h3>
            <p className="text-sm text-gray-500 mb-4">
              <span className="text-red-500 font-bold">Red bars</span> increase stress score.<br />
              <span className="text-green-500 font-bold">Green bars</span> decrease it.
            </p>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={data} margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[-0.004, 0.004]} allowDataOverflow={true} />
                  <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="importance" name="Impact">
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>


          {/* Heatmap Section */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-lg font-medium mb-4">Stress Source Localization</h3>

            {heatmap ? (
              <div className="flex flex-col items-center justify-center space-y-4 w-full">

                {/* The Image + Interactive Overlay */}
                <div className="relative w-80 h-80 sm:w-96 sm:h-96">
                  <img src={heatmap} alt="Brain Heatmap" className="w-full h-full object-contain rounded-full shadow-sm" />

                  {/* Overlay Nodes */}
                  {Object.entries(CHANNEL_POSITIONS).map(([name, pos]) => (
                    <div
                      key={name}
                      className="absolute w-6 h-6 rounded-full cursor-pointer hover:bg-black/20 hover:border hover:border-white transition-colors"
                      style={{
                        left: pos.left,
                        top: pos.top,
                        transform: 'translate(-50%, -50%)' // Center the hit area
                      }}
                      title={`Channel: ${name}`}
                    />
                  ))}
                </div>

                {/* The Legend */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg w-full max-w-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-sm">Key:</h4>
                    {stressScore && <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Score: {Number(stressScore).toFixed(2)}</span>}
                  </div>
                  <div className="flex justify-around text-xs text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                      <span>High Stress Area</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                      <span>Low Stress Area</span>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg w-full">
                <span>No heatmap available.</span>
                <span className="text-xs mt-2">Check backend logs if generation failed.</span>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default Explanations;
