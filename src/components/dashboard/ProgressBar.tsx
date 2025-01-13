import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({ 
  value, 
  max, 
  color = 'blue', 
  showLabel = true,
  label
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const formattedPercentage = Number.isFinite(percentage) ? Math.round(percentage) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1.5 items-center">
        {label && <span className="text-sm text-gray-600">{label}</span>}
        {showLabel && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100">
            {formattedPercentage}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`bg-${color}-500 rounded-full h-1.5 transition-all duration-300 ease-in-out`}
          style={{ width: `${formattedPercentage}%` }}
        />
      </div>
    </div>
  );
}