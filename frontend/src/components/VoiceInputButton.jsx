import { useState } from "react";
import { FiMic, FiMicOff } from "react-icons/fi";

import { useLanguage } from "../context/LanguageContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { isSpeechRecognitionSupported, LANGUAGE_TO_SPEECH_LOCALE, startListening } from "../utils/speech.js";

/**
 * Microphone button that transcribes speech into the given onTranscript
 * callback. Falls back to a disabled state with a toast if the browser
 * doesn't support the Web Speech API.
 */
export default function VoiceInputButton({ onTranscript }) {
  const [listening, setListening] = useState(false);
  const { language } = useLanguage();
  const { showToast } = useToast();
  const supported = isSpeechRecognitionSupported();

  const handleClick = () => {
    if (!supported) {
      showToast("Voice input isn't supported in this browser. Try Chrome or Edge.", "error");
      return;
    }
    if (listening) return;

    setListening(true);
    startListening(
      (transcript) => {
        onTranscript(transcript);
        setListening(false);
      },
      (error) => {
        showToast(`Voice input error: ${error}`, "error");
        setListening(false);
      },
      LANGUAGE_TO_SPEECH_LOCALE[language] || "en-US"
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={listening ? "Listening for voice input" : "Start voice input"}
      aria-pressed={listening}
      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border transition ${
        listening
          ? "border-stadium-danger bg-stadium-danger/15 text-stadium-danger animate-pulse-slow"
          : "border-stadium-border text-slate-400 hover:text-stadium-primary"
      }`}
    >
      {listening ? <FiMicOff size={16} /> : <FiMic size={16} />}
    </button>
  );
}
