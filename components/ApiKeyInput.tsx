
import React, { useState } from 'react';
import { KeyIcon } from './icons/KeyIcon';
import { useTranslation } from '../hooks/useTranslation';

interface ApiKeyInputProps {
  onSubmit: (apiKey: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
      <KeyIcon className="w-16 h-16 text-sky-500 dark:text-sky-400 mb-4" />
      <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-300 tracking-wider">{t('apiKey.title')}</h2>
      <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md">
        {t('apiKey.description')}
      </p>
      <form onSubmit={handleSubmit} className="mt-6 w-full max-w-sm">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={t('apiKey.placeholder')}
          className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          aria-label={t('apiKey.ariaLabel')}
        />
        <button
          type="submit"
          disabled={!apiKey.trim()}
          className="mt-4 w-full inline-flex items-center justify-center px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-400/50"
        >
          {t('apiKey.button')}
        </button>
      </form>
       <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        {t('apiKey.helpText')}
      </p>
    </div>
  );
};
