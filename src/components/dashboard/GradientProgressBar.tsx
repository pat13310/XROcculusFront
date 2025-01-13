import React from 'react';
import { formatBytes } from '../../utils/formatters';

interface GradientProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'percentage' | 'storage';
}

export function GradientProgressBar({
  value,
  max,
  label,
  showValue = true,
  size = 'md',
  className = '',
  type = 'percentage'
}: GradientProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const formattedPercentage = Number.isFinite(percentage) ? Math.round(percentage) : 0;

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  const displayValue = type === 'storage' 
    ? `${formatBytes(value)} / ${formatBytes(max)}`
    : `${formattedPercentage}%`;

  const getGradientColor = () => {
    if (type === 'storage') {
      return 'from-violet-500 to-fuchsia-500';
    }
    // For battery, color based on level
    if (formattedPercentage > 60) {
      return 'from-violet-500 to-fuchsia-500';
    } else if (formattedPercentage > 20) {
      return 'from-amber-500 to-orange-500';
    }
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1.5">
        {label && (
          <span className="text-sm font-medium text-gray-700">{label}</span>
        )}
        {showValue && (
          <span className={`text-sm font-semibold bg-gradient-to-r ${getGradientColor()} bg-clip-text text-transparent`}>
            {displayValue}
          </span>
        )}
      </div>
      <div className={`w-full bg-gray-100 rounded-full ${heightClasses[size]} overflow-hidden shadow-inner`}>
        <div
          className={`${heightClasses[size]} rounded-full bg-gradient-to-r ${getGradientColor()} transition-all duration-300 ease-in-out`}
          style={{ width: `${formattedPercentage}%` }}
        />
      </div>
    </div>
  );
}