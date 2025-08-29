
import React from 'react';
import { FactoryIcon } from './icons/FactoryIcon';
import { useTranslation } from '../hooks/useTranslation';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Header: React.FC = () => {
    const { t } = useTranslation();
    return (
        <header className="relative text-center">
            <div className="absolute top-0 right-0 flex items-center gap-2">
                <ThemeSwitcher />
                <LanguageSwitcher />
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
