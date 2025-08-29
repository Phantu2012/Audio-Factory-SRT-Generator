
import React, { useState, useEffect } from 'react';
import { CogIcon } from './icons/CogIcon';
import { useTranslation } from '../hooks/useTranslation';

export const Loader: React.FC = () => {
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

    return (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <CogIcon className="w-20 h-20 text-sky-500 dark:text-sky-400 animate-spin-slow" />
            <h2 className="mt-6 text-2xl font-bold text-sky-700 dark:text-sky-300 tracking-wider">{t('loader.title')}</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 animate-pulse transition-opacity duration-500">
                {loadingMessages[messageIndex]}
            </p>
        </div>
    );
};
