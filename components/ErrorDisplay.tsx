
import React from 'react';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { useTranslation } from '../hooks/useTranslation';


interface ErrorDisplayProps {
  message: string;
  onReset: () => void;
  showReset?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onReset, showReset = true }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center text-center p-6 bg-red-100 dark:bg-red-900/30 border border-red-500/50 rounded-lg animate-fade-in">
        <AlertTriangleIcon className="w-16 h-16 text-red-500 dark:text-red-400"/>
        <h2 className="mt-4 text-2xl font-bold text-red-700 dark:text-red-300">{t('error.title')}</h2>
        <p className="mt-2 text-red-600 dark:text-red-200 max-w-md">{message}</p>
        {showReset && (
            <button
                onClick={onReset}
                className="mt-6 inline-flex items-center justify-center px-6 py-2 bg-slate-500 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-slate-400/50 dark:bg-slate-600 dark:hover:bg-slate-500"
            >
                <RefreshIcon className="w-5 h-5 mr-2" />
                {t('error.restartButton')}
            </button>
        )}
    </div>
  );
};
