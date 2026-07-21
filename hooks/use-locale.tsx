"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ru, uz, type Dictionary, type Locale } from "@/locales";

type LocaleContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");

  useEffect(() => {
    const stored = window.localStorage.getItem("fenix-locale");
    if (stored === "ru" || stored === "uz") {
      queueMicrotask(() => setLocaleState(stored));
    }
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem("fenix-locale", next);
    document.documentElement.lang = next;
  };

  const value = useMemo(
    () => ({ locale, dictionary: locale === "ru" ? ru : uz, setLocale }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}
