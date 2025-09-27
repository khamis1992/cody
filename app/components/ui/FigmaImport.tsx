import { useState } from 'react';
import { toast } from 'react-toastify';

export function FigmaImport() {
  const [figmaUrl, setFigmaUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    if (!figmaUrl) {
      toast.error('Please enter a Figma URL');
      return;
    }

    setIsLoading(true);

    try {
      // API call to the backend will go here
      console.log('Importing from Figma:', figmaUrl);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      toast.success('Figma design imported successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Error importing from Figma: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={figmaUrl}
        onChange={(e) => setFigmaUrl(e.target.value)}
        placeholder="Enter Figma URL"
        className="flex-grow px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-full text-slate-300 focus:ring-2 focus:ring-accent-500 focus:outline-none transition-all"
      />
      <button
        onClick={handleImport}
        disabled={isLoading}
        className="px-6 py-2 bg-accent-600 hover:bg-accent-500 rounded-full text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Importing...' : 'Import'}
      </button>
    </div>
  );
}
