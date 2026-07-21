import { useLocale } from "./use-locale";

export function useLanguage() {
  const { locale: language, dictionary, setLocale } = useLocale();
  return {
    language,
    dictionary,
    setLanguage: setLocale,
    toggleLanguage: () => setLocale(language === "ru" ? "uz" : "ru"),
  };
}
