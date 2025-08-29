
import React, { useContext, useState } from 'react';
import { AppContext, HistoryItem } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { HistoryIcon } from './icons/HistoryIcon';
import { TrashIcon } from './icons/TrashIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface HistoryPanelProps {
    onViewItem: (item: { fileName: string; srtContent: string }) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ onViewItem }) => {
    const { history, clearHistory } = useContext(AppContext);
    const { t } = useTranslation();
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleDownload = (item: HistoryItem) => {
        const blob = new Blob([item.srtContent], { type: 'text/srt' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const baseName = item.fileName.replace(/\.[^/.]+$/, "") || 'subtitles';
        a.download = `${baseName}.srt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleCopy = (item: HistoryItem) => {
        navigator.clipboard.writeText(item.srtContent);
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-sky-600 dark:text-sky-400">{t('history.title')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{t('history.description')}</p>
                </div>
                {history.length > 0 && (
                     <button
                        onClick={clearHistory}
                        className="flex items-center px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-md hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
                        aria-label={t('history.clearButton')}
                    >
                        <TrashIcon className="w-4 h-4 mr-2" />
                        {t('history.clearButton')}
                    </button>
                )}
            </div>
            
            <div className="mt-6 space-y-4">
                {history.length === 0 ? (
                    <div className="text-center py-12">
                        <HistoryIcon className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">{t('history.empty')}</h3>
                        <p className="mt-1 text-slate-500 dark:text-slate-400">{t('history.emptyDescription')}</p>
                    </div>
                ) : (
                    history.map(item => (
                        <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-grow">
                                <p className="font-semibold text-slate-800 dark:text-slate-200 break-all">{item.fileName}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                                <button onClick={() => onViewItem(item)} className="px-3 py-1 text-sm font-semibold text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-900/50 rounded-md hover:bg-sky-200 dark:hover:bg-sky-900 transition-colors">{t('history.viewButton')}</button>
                                <button onClick={() => handleDownload(item)} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full" aria-label={t('history.downloadButton')}>
                                    <DownloadIcon className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleCopy(item)} className="px-3 py-1 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 rounded-md w-20 text-center transition-colors">
                                    {copiedId === item.id ? t('history.copied') : t('history.copyButton')}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
