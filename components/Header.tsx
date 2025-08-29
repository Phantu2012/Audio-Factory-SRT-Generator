
import React from 'react';
import { FactoryIcon } from './icons/FactoryIcon';
import { useTranslation } from '../hooks/useTranslation';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';
import { KeyIcon } from './icons/KeyIcon';

interface HeaderProps {
    isAuthorized: boolean;
    onChangeApiKey: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isAuthorized, onChangeApiKey }) => {
    const { t } = useTranslation();
    return (
        <header className="relative text-center">
            <div className="absolute top-0 right-0 flex items-center gap-2">
                <ThemeSwitcher />
                <LanguageSwitcher />
                {isAuthorized && (
                     <button
                        onClick={onChangeApiKey}
                        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors"
                        aria-label={t('header.changeApiKey')}
                        title={t('header.changeApiKey')}
                    >
                        <KeyIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
            <div className="inline-flex items-center justify-center">
                <FactoryIcon className="w-10 h-10 sm:w-12 sm:h-12 text-sky-500 dark:text-sky-400" />
                <h1 className="ml-4 text-4xl sm:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-blue-500 dark:from-sky-400 dark:to-blue-400">
                    {t('header.title')}
                </h1>
            </div>
            <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
                {t('header.subtitle')}
            </p>
        </header>
    );
}
