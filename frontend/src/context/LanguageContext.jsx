import { createContext, useContext, useMemo, useState } from "react";

const LanguageContext = createContext(null);

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "es", label: "Español (Spanish)" },
  { code: "fr", label: "Français (French)" },
  { code: "ar", label: "العربية (Arabic)" },
  { code: "pt", label: "Português (Portuguese)" },
];

/** Shares the fan's chosen assistant language across every page. */
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
