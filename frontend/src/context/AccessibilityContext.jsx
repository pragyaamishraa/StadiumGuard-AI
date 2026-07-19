import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AccessibilityContext = createContext(null);

/**
 * Provides global accessibility preferences (high contrast, large text,
 * text-to-speech) shared across the entire app. State lives in memory only
 * for this session — no browser storage is used.
 */
export function AccessibilityProvider({ children }) {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.body.classList.toggle("large-text", largeText);
  }, [largeText]);

  const speak = (text) => {
    if (!ttsEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Always plays, regardless of the global toggle — for explicit "Listen"
  // button clicks, where the click itself is the user's request to hear it.
  const forceSpeak = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // speak/forceSpeak intentionally excluded from deps: they're plain closures
  // (not wrapped in useCallback) that already capture ttsEnabled, which is
  // tracked below — including them would defeat the memoization entirely.
  const value = useMemo(
    () => ({
      highContrast,
      setHighContrast,
      largeText,
      setLargeText,
      ttsEnabled,
      setTtsEnabled,
      speak,
      forceSpeak,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [highContrast, largeText, ttsEnabled]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return ctx;
}
