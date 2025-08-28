
import React from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { RefreshIcon } from './icons/RefreshIcon';

interface TranscriptDisplayProps {
  srtContent: string;
  onDownload: () => void;
  onReset: () => void;
  fileName: string;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ srtContent, onDownload, onReset, fileName }) => {
  return (
    <div className="flex flex-col items-center text-center animate-fade-in">
        <CheckCircleIcon className="w-16 h-16 text-green-400" />
        <h2 className="mt-4 text-2xl font-bold text-green-300 tracking-wide">Synchronization Complete!</h2>
        <p className="mt-1 text-gray-400">Generated SRT for <span className="font-semibold text-gray-300">{fileName}</span> is ready.</p>
        
        <div className="mt-6 w-full bg-gray-900/70 border border-gray-700 rounded-lg p-4 h-64 overflow-y-auto text-left">
            <p className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">{srtContent}</p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
            <button
                onClick={onDownload}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 shadow-lg shadow-cyan-600/30"
            >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Download Package (.srt)
            </button>
            <button
                onClick={onReset}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-gray-400/50"
            >
                <RefreshIcon className="w-5 h-5 mr-2" />
                Start New Production
            </button>
        </div>
    </div>
  );
};
