import React from 'react';

interface HeaderGradientProps {
  title: string;
  description?: string;
}

export function HeaderGradient({ title, description }: HeaderGradientProps) {
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white py-12 mb-8 rounded-lg shadow-md">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        {description && (
          <p className="text-lg opacity-80">{description}</p>
        )}
      </div>
    </div>
  );
}
