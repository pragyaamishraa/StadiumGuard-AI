/**
 * Thin wrapper around the browser's SpeechRecognition API (voice input for
 * the Accessibility Assistant). Gracefully reports when unsupported instead
 * of throwing, since Safari and some browsers don't implement it.
 */
export function isSpeechRecognitionSupported() {
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
}

/**
 * Starts a single speech-recognition session.
 * @param {(transcript: string) => void} onResult
 * @param {(error: string) => void} onError
 * @param {string} languageCode BCP-47 code, e.g. "en-US"
 * @returns {() => void} a function to stop listening early
 */
export function startListening(onResult, onError, languageCode = "en-US") {
  if (!isSpeechRecognitionSupported()) {
    onError("Voice input is not supported in this browser.");
    return () => {};
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = languageCode;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event) => {
    onError(event.error || "Speech recognition failed.");
  };

  recognition.start();
  return () => recognition.stop();
}

export const LANGUAGE_TO_SPEECH_LOCALE = {
  en: "en-US",
  hi: "hi-IN",
  es: "es-ES",
  fr: "fr-FR",
  ar: "ar-SA",
  pt: "pt-PT",
};
