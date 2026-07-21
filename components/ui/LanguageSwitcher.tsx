"use client";

import { useLanguage } from "@/hooks/useLanguage";

export function LanguageSwitcher() {
  const { language, setLanguage, dictionary: d } = useLanguage();
  return (
    <div className="language" aria-label={d.common.language}>
      {(["ru", "uz"] as const).map((item) => (
        <button key={item} type="button" className={language === item ? "active" : ""} onClick={() => setLanguage(item)} aria-pressed={language === item}>
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
