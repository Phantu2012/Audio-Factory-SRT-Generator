
import React from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { useTranslation } from '../hooks/useTranslation';

interface TranscriptDisplayProps {
  srtContent: string;
  onDownload: () => void;
  onReset: () => void;
  fileName: string;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ srtContent, onDownload, onReset, fileName }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center text-center animate-fade-in">
        <CheckCircleIcon className="w-16 h-16 text-emerald-500 dark:text-emerald-400" />
        <h2 className="mt-4 text-2xl font-bold text-emerald-600 dark:text-emerald-300 tracking-wide">{t('transcript.title')}</h2>
        <p className="mt-1 text-slate-500 dark:text-slate-400">{t('transcript.description')} <span className="font-semibold text-slate-700 dark:text-slate-300">{fileName}</span></p>
        
        <div className="mt-6 w-full bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 rounded-lg p-4 h-64 overflow-y-auto text-left">
            <pre className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">{srtContent}</pre>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
            <button
                onClick={onDownload}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-400/50 shadow-lg shadow-sky-600/30"
            >
                <DownloadIcon className="w-5 h-5 mr-2" />
                {t('transcript.downloadButton')}
            </button>
            <button
                onClick={onReset}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-slate-500 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-slate-400/50 dark:bg-slate-600 dark:hover:bg-slate-500"
            >
                <RefreshIcon className="w-5 h-5 mr-2" />
                {t('transcript.newButton')}
            </button>
        </div>
    </div>
  );
};
