import React from "react";

const StressMeter = ({ level = "Low", score = 0, confidence = 87 }) => {
  const levelColors = { Low: "bg-green-500", Medium: "bg-yellow-500", High: "bg-red-500" };
  const levels = ["Low", "Medium", "High"];

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-6 text-center">Stress Level Prediction</h3>
      <div className="relative h-8 bg-muted rounded-full overflow-hidden mb-4">
        <div className={`h-full ${levelColors[level]}`} style={{ width: `${(levels.indexOf(level) + 1) * 33.33}%` }} />
        <div className="absolute top-0 w-full h-full flex">
          <div className="w-1/3 border-r border-background"></div>
          <div className="w-1/3 border-r border-background"></div>
        </div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mb-6">
        <span>Low (0.0 - 0.5)</span><span>Medium (0.5 - 1.5)</span><span>High (1.5 - 2.0)</span>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{level} Stress</div>
        {score !== null && (
          <div className="text-lg font-semibold mt-1 text-primary">Peak Score: {Number(score).toFixed(4)}</div>
        )}
        <div className="text-muted-foreground mt-2">Stress Intensity: {confidence}%</div>
      </div>
    </div>
  );
};

export default StressMeter;
