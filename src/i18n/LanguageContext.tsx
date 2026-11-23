import React, { useMemo } from 'react';
import { I18N, Language, Translations } from './translations';
import { useAppStore } from '../store';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isVietnamese: boolean;
  isEnglish: boolean;
}

/**
 * useTranslation hook powered by Zustand store.
 * Reactive across all screens and components.
 */
export const useTranslation = (): LanguageContextType => {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  return useMemo(
    () => ({
      language,
      setLanguage,
      t: I18N[language] as Translations,
      isVietnamese: language === 'vi',
      isEnglish: language === 'en',
    }),
    [language, setLanguage]
  );
};

// Aliases for convenience
export const useI18n = useTranslation;
export const useLanguage = useTranslation;

/**
 * Passthrough provider for backwards compatibility.
 * Zustand doesn't strictly need a Provider, but keeping this avoids breaking existing wraps.
 */
export const LanguageProvider: React.FC<{
  children: React.ReactNode;
  initialLanguage?: Language;
}> = ({ children, initialLanguage }) => {
  React.useEffect(() => {
    if (initialLanguage) {
      useAppStore.getState().setLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  return <>{children}</>;
};
