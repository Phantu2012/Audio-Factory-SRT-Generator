
import React from 'react';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { RefreshIcon } from './icons/RefreshIcon';

interface ErrorDisplayProps {
  message: string;
  onReset: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onReset }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-red-900/30 border border-red-500/50 rounded-lg animate-fade-in">
        <AlertTriangleIcon className="w-16 h-16 text-red-400"/>
        <h2 className="mt-4 text-2xl font-bold text-red-300">System Malfunction</h2>
        <p className="mt-2 text-red-200 max-w-md">{message}</p>
        <button
            onClick={onReset}
            className="mt-6 inline-flex items-center justify-center px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-gray-400/50"
        >
            <RefreshIcon className="w-5 h-5 mr-2" />
            Restart Production Line
        </button>
    </div>
  );
};
