import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

// A simple key accessor function that traverses a nested object
const get = (obj: any, path: string): string | undefined => {
  const keys = path.split('.');
  return keys.reduce((res, key) => res?.[key], obj);
};


export const useTranslation = () => {
  const { locale, translations } = useContext(AppContext);

  const t = (key: string): string => {
    // The AppProvider ensures `translations` is not null when components render.
    const translation = get(translations, key);
    
    if (translation === undefined) {
      console.warn(`Translation key not found for locale '${locale}': ${key}`);
      return key;
    }

    return translation;
  };

  return { t, locale };
};