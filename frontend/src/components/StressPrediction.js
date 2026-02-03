import React from "react";
import StressMeter from "./shared/StressMeter";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend, Cell, LabelList } from 'recharts';

const StressPrediction = ({ prediction, stressScore, visualizations }) => {
  // Determine color/message based on prediction
  const hasData = prediction !== null;
  const signalData = visualizations?.signal || [];
  const bandData = visualizations?.freq || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Stress Prediction</h2>

      {!hasData ? (
        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
          Please upload and analyze data first.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StressMeter
              level={prediction}
              score={stressScore}
              confidence={stressScore !== null ? (stressScore / 2 * 100).toFixed(0) : 0}
            />

            {/* Signal Visualization */}
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">EEG Signal (Channel 1 Snippet)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={signalData} margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                      dataKey="time"
                      label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5, fill: '#666' }}
                      tick={{ fill: '#666', fontSize: 12 }}
                    />
                    <YAxis
                      domain={['auto', 'auto']}
                      label={{ value: 'Amplitude (uV)', angle: -90, position: 'insideLeft', fill: '#666' }}
                      tick={{ fill: '#666', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#22d3ee' }}
                      formatter={(value) => [value.toFixed(2), "uV"]}
                      labelFormatter={(label) => `Sample: ${label}`}
                    />
                    <Line type="monotone" dataKey="value" stroke="#22d3ee" dot={false} strokeWidth={2} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>


        </>
      )}
    </div>
  );
};

export default StressPrediction;
