import { useState } from "react";
import { FiMapPin, FiNavigation } from "react-icons/fi";

import Card from "../components/Card.jsx";
import EmptyState from "../components/EmptyState.jsx";
import VoiceInputButton from "../components/VoiceInputButton.jsx";
import { useAccessibility } from "../context/AccessibilityContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { api, ApiError } from "../utils/api.js";

export default function Accessibility() {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const { speak } = useAccessibility();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!start.trim() || !destination.trim()) {
      showToast("Please enter both a starting point and a destination.", "error");
      return;
    }
    setLoading(true);
    try {
      const data = await api.getAccessibleRoute(start.trim(), destination.trim());
      setRoute(data);
      speak(`Accessible route ready. Estimated time: ${data.estimated_minutes} minutes.`);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not generate a route.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 animate-fade-in">
      <h1 className="mb-1 text-2xl font-extrabold">Accessibility Assistant</h1>
      <p className="mb-6 text-sm text-slate-400">
        Get wheelchair-friendly routes, and use voice input, text-to-speech,
        high contrast, and large text from the footer toolbar on every page.
      </p>

      <Card className="mb-6">
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field
            id="start-point"
            label="Starting point"
            value={start}
            onChange={setStart}
            placeholder="e.g. Gate A"
          />
          <Field
            id="destination-point"
            label="Destination"
            value={destination}
            onChange={setDestination}
            placeholder="e.g. Seat B24"
          />
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-stadium-primary px-5 py-2.5 text-sm font-semibold text-stadium-bg transition hover:bg-stadium-primaryDark disabled:opacity-50"
            >
              <FiNavigation size={16} />
              {loading ? "Finding route…" : "Find Accessible Route"}
            </button>
          </div>
        </form>
      </Card>

      {route ? (
        <Card className="animate-slide-up">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold">Suggested Route</h2>
            <span className="rounded-full bg-stadium-primary/15 px-3 py-1 text-xs font-semibold text-stadium-primary">
              ~{route.estimated_minutes} min
            </span>
          </div>
          <ol className="mb-4 space-y-3">
            {route.route_steps.map((step, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-slate-300">
                <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-stadium-surfaceAlt text-xs font-bold text-stadium-primary">
                  {idx + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2 border-t border-stadium-border pt-3">
            {route.accessible_features.map((feature) => (
              <span
                key={feature}
                className="flex items-center gap-1 rounded-full border border-stadium-border px-3 py-1 text-xs text-slate-400"
              >
                <FiMapPin size={11} /> {feature}
              </span>
            ))}
          </div>
        </Card>
      ) : (
        !loading && (
          <EmptyState
            icon={<FiNavigation />}
            title="No route yet"
            description="Enter a starting point and destination above to get a step-by-step accessible route."
          />
        )
      )}
    </div>
  );
}

function Field({ id, label, value, onChange, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-stadium-border bg-stadium-surfaceAlt px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-stadium-primary"
        />
        <VoiceInputButton onTranscript={onChange} />
      </div>
    </div>
  );
}
