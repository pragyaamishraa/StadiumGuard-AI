import { FiEye, FiType, FiVolume2 } from "react-icons/fi";

import { useAccessibility } from "../context/AccessibilityContext.jsx";

/**
 * Persistent footer bar exposing the three core accessibility toggles from
 * anywhere in the app, plus basic project attribution.
 */
export default function Footer() {
  const { highContrast, setHighContrast, largeText, setLargeText, ttsEnabled, setTtsEnabled } =
    useAccessibility();

  return (
    <footer className="border-t border-stadium-border bg-stadium-bg px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-xs text-slate-500">
          Stadium Guardian AI — built for FIFA World Cup 2026 fan experience.
          All crowd &amp; sustainability data shown is simulated for demo purposes.
        </p>
        <div className="flex items-center gap-2" role="group" aria-label="Accessibility settings">
          <ToggleButton
            active={highContrast}
            onClick={() => setHighContrast((v) => !v)}
            icon={<FiEye size={14} />}
            label="High contrast"
          />
          <ToggleButton
            active={largeText}
            onClick={() => setLargeText((v) => !v)}
            icon={<FiType size={14} />}
            label="Large text"
          />
          <ToggleButton
            active={ttsEnabled}
            onClick={() => setTtsEnabled((v) => !v)}
            icon={<FiVolume2 size={14} />}
            label="Read aloud"
          />
        </div>
      </div>
    </footer>
  );
}

function ToggleButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-stadium-primary bg-stadium-primary/15 text-stadium-primary"
          : "border-stadium-border text-slate-400 hover:text-slate-200"
      }`}
    >
      {icon} {label}
    </button>
  );
}
