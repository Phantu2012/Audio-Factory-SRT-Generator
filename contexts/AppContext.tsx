
import React, { createContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark';
export type Locale = 'en' | 'vi';

export interface HistoryItem {
  id: string;
  fileName: string;
  srtContent: string;
  timestamp: number;
}

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [locale, setLocaleState] = useState<Locale>('en');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // --- Theme setup ---
    const storedTheme = localStorage.getItem('app-theme') as Theme;
    if (storedTheme) {
      setThemeState(storedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark');
    } else {
      setThemeState('light');
    }
    
    // --- History setup ---
    const storedHistory = localStorage.getItem('app-history');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }

    // --- Locale setup ---
    const initialLocale = (localStorage.getItem('app-locale') as Locale) || 'en';
    setLocaleState(initialLocale);

  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('app-locale', newLocale);
  };
  
  const addToHistory = (item: HistoryItem) => {
      setHistory(prev => {
          const newHistory = [item, ...prev].slice(0, 50); // Keep last 50 items
          localStorage.setItem('app-history', JSON.stringify(newHistory));
          return newHistory;
      });
  };
  
  const clearHistory = () => {
      setHistory([]);
      localStorage.removeItem('app-history');
  };


  return (
    <AppContext.Provider value={{ theme, setTheme, locale, setLocale, history, addToHistory, clearHistory }}>
      {children}
    </AppContext.Provider>
  );
};
