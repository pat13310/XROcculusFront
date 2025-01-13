import React from 'react';
import { Box, Gamepad2, Shapes, Sparkles } from 'lucide-react';

interface DefaultAppImageProps {
  name: string;
  category?: string;
  className?: string;
  style?: React.CSSProperties;
}

const categoryIcons = {
  action: Gamepad2,
  simulation: Shapes,
  default: Sparkles,
};

const categoryGradients = {
  action: 'from-violet-400 to-fuchsia-400',
  simulation: 'from-cyan-400 to-blue-400',
  default: 'from-indigo-400 to-purple-400',
};

export function DefaultAppImage({ 
  name, 
  category = 'default',
  className = '', 
  style = {} 
}: DefaultAppImageProps) {
  const Icon = categoryIcons[category as keyof typeof categoryIcons] || categoryIcons.default;
  const gradient = categoryGradients[category as keyof typeof categoryGradients] || categoryGradients.default;

  return (
    <div 
      className={`flex items-center justify-center bg-gradient-to-br ${gradient} ${className}`}
      style={style}
    >
      <div className="flex flex-col items-center">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg mb-3 ring-1 ring-white/30">
          <Icon className="w-12 h-12 text-white" />
        </div>
        <div className="text-sm font-medium text-white text-center px-4 truncate max-w-full bg-white/10 rounded-lg py-1.5 backdrop-blur-sm ring-1 ring-white/20">
          {name}
        </div>
      </div>
    </div>
  );
}