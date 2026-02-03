import React from "react";
import ReportCard from "./shared/ReportCard";
import PlaceholderChart from "./shared/PlaceholderChart";

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

const Reports = ({ prediction, stressScore, explanation, heatmap }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Reports & Analytics</h2>

    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center text-gray-500">
      <p>Reports moved to "Explanations" tab for better context.</p>
    </div>

    {/* Old Placeholders (Optional) */}
    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ReportCard /> 
    </div> */}
  </div>
);

export default Reports;
