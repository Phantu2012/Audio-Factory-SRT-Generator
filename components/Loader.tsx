
import React, { useState, useEffect } from 'react';
import { CogIcon } from './icons/CogIcon';
import { useTranslation } from '../hooks/useTranslation';

interface LoaderProps {
    progress: number;
}

export const Loader: React.FC<LoaderProps> = ({ progress }) => {
    const { t } = useTranslation();
    const loadingMessages = [
        t('loader.message1'),
        t('loader.message2'),
        t('loader.message3'),
        t('loader.message4'),
        t('loader.message5'),
        t('loader.message6')
    ];
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 2500);

        return () => clearInterval(intervalId);
    }, [loadingMessages.length]);
    
    const displayProgress = Math.min(100, Math.max(0, Math.round(progress)));

    return (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <CogIcon className="w-20 h-20 text-sky-500 dark:text-sky-400 animate-spin-slow" />
            <h2 className="mt-6 text-2xl font-bold text-sky-700 dark:text-sky-300 tracking-wider">{t('loader.title')}</h2>
            
            <div className="w-full max-w-sm mt-4">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div 
                        className="bg-sky-500 h-2.5 rounded-full transition-all duration-300 ease-linear" 
                        style={{ width: `${displayProgress}%` }}
                    ></div>
                </div>
                <p className="text-center text-sky-600 dark:text-sky-400 font-semibold mt-2 text-sm tabular-nums">
                    {displayProgress}%
                </p>
            </div>
            
            <p className="mt-2 text-slate-500 dark:text-slate-400 transition-opacity duration-500 min-h-[20px]">
                {loadingMessages[messageIndex]}
            </p>
        </div>
    );
};
