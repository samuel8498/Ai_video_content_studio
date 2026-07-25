import React from 'react';

export const ScriptGeneratorSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between p-4 glass-panel rounded-2xl">
        <div className="h-6 w-48 bg-gray-700/50 rounded-lg"></div>
        <div className="h-8 w-24 bg-purple-600/30 rounded-lg"></div>
      </div>
      
      <div className="p-6 glass-panel rounded-2xl space-y-4">
        <div className="h-4 w-3/4 bg-gray-700/50 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-700/50 rounded"></div>
        <div className="h-20 bg-gray-800/60 rounded-xl mt-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="p-5 glass-panel rounded-2xl space-y-3 border border-purple-500/20">
            <div className="flex justify-between">
              <div className="h-4 w-28 bg-purple-500/30 rounded"></div>
              <div className="h-4 w-12 bg-gray-700/50 rounded"></div>
            </div>
            <div className="h-12 bg-gray-800/50 rounded-lg"></div>
            <div className="h-16 bg-purple-900/20 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
