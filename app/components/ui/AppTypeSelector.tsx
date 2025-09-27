import React from 'react';

interface AppTypeSelectorProps {
  selectedType: 'web' | 'mobile';
  onTypeChange: (type: 'web' | 'mobile') => void;
}

export function AppTypeSelector({ selectedType, onTypeChange }: AppTypeSelectorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-full p-1 flex gap-1">
        <button
          onClick={() => onTypeChange('web')}
          className={`
            px-6 py-2 rounded-full transition-all duration-200 text-sm font-medium
            ${selectedType === 'web'
              ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg'
              : 'text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/50'
            }
          `}
        >
          💻 Web App
        </button>
        <button
          onClick={() => onTypeChange('mobile')}
          className={`
            px-6 py-2 rounded-full transition-all duration-200 text-sm font-medium
            ${selectedType === 'mobile'
              ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg'
              : 'text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/50'
            }
          `}
        >
          📱 Mobile App
        </button>
      </div>
    </div>
  );
}