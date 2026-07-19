import { useEffect, useRef, useState } from "react";
import { FiBookOpen, FiSend, FiVolume2 } from "react-icons/fi";

import Card from "../components/Card.jsx";
import VoiceInputButton from "../components/VoiceInputButton.jsx";
import { useAccessibility } from "../context/AccessibilityContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { api, ApiError } from "../utils/api.js";

const SUGGESTED_QUESTIONS = [
  "Where is Gate B?",
  "Where is the nearest washroom?",
  "What are the prohibited items?",
  "Where is the medical room?",
  "What should I do if I lose my wallet?",
];

let sessionId;
function getSessionId() {
  if (!sessionId) sessionId = crypto.randomUUID();
  return sessionId;
}

export default function Copilot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hey, I'm Trikkie ⚽ — your stadium sidekick. Ask me about gates, seating, restrooms, food, rules, or emergencies.",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const { speak } = useAccessibility();
  const { showToast } = useToast();
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed, sources: [] }]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.sendChatMessage(trimmed, language, getSessionId());
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: response.reply, sources: response.sources },
      ]);
      speak(response.reply);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not reach the Copilot service.";
      showToast(message, "error");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I couldn't process that right now. Please try again.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col px-4 py-8 sm:px-6 animate-fade-in">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-stadium-pitch to-stadium-primary text-lg font-black text-stadium-bg shadow-pitchGlow">
          ⚽
        </span>
        <div>
          <h1 className="font-display text-4xl leading-none tracking-wide">
            MEET <span className="gradient-text">TRIKKIE</span>
          </h1>
          <p className="text-sm text-slate-400">
            Your AI stadium sidekick — grounded in real gate, seating, rules, and safety info.
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            className="rounded-full border border-stadium-border bg-stadium-surface px-3 py-1.5 text-xs text-slate-300 transition hover:border-stadium-primary/50 hover:text-stadium-primary"
          >
            {q}
          </button>
        ))}
      </div>

      <Card className="flex h-[55vh] flex-col p-0 overflow-hidden">
        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto p-5"
          role="log"
          aria-live="polite"
          aria-label="Chat conversation"
        >
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} message={msg} onSpeak={speak} />
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stadium-primary [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stadium-primary [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stadium-primary" />
              </span>
              Trikkie is thinking…
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2 border-t border-stadium-border p-3"
        >
          <VoiceInputButton onTranscript={(text) => setInput(text)} />
          <label htmlFor="copilot-input" className="sr-only">
            Ask the Stadium Copilot a question
          </label>
          <input
            id="copilot-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about gates, seats, food, rules…"
            className="flex-1 rounded-xl border border-stadium-border bg-stadium-surfaceAlt px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-stadium-primary"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-stadium-primary text-stadium-bg transition hover:bg-stadium-primaryDark disabled:opacity-40"
          >
            <FiSend size={16} />
          </button>
        </form>
      </Card>
    </div>
  );
}

function ChatBubble({ message, onSpeak }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
          isUser
            ? "bg-stadium-primary text-stadium-bg"
            : "border border-stadium-border bg-stadium-surfaceAlt text-slate-200"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>

        {!isUser && (
          <button
            onClick={() => onSpeak(message.text)}
            aria-label="Read this response aloud"
            className="mt-1.5 flex items-center gap-1 text-xs text-slate-500 hover:text-stadium-primary"
          >
            <FiVolume2 size={12} /> Listen
          </button>
        )}

        {message.sources?.length > 0 && (
          <div className="mt-2 space-y-1 border-t border-stadium-border pt-2">
            <p className="flex items-center gap-1 text-xs font-semibold text-slate-400">
              <FiBookOpen size={12} /> Grounded in:
            </p>
            {message.sources.map((source) => (
              <p key={source.title} className="text-xs text-slate-500">
                • {source.title}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
