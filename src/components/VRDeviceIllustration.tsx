import React from 'react';

export function VRDeviceIllustration({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 800 600" 
      className={className}
    >
      <defs>
        <linearGradient id="deviceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path 
        d="M400 300 L250 450 Q200 500 300 550 L500 550 Q600 500 550 450 L400 300Z" 
        fill="url(#deviceGradient)" 
        opacity="0.5"
      />
      <circle cx="400" cy="250" r="150" fill="url(#deviceGradient)" opacity="0.3" />
    </svg>
  );
}
