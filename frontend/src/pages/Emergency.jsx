import { useState } from "react";
import { FiAlertTriangle, FiSend, FiUsers } from "react-icons/fi";

import Card from "../components/Card.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { api, ApiError } from "../utils/api.js";

const INCIDENT_TYPES = [
  { value: "medical", label: "Medical Emergency" },
  { value: "lost_child", label: "Lost Child" },
  { value: "fire", label: "Fire" },
  { value: "suspicious_object", label: "Suspicious Object" },
  { value: "other", label: "Other" },
];

export default function Emergency() {
  const [form, setForm] = useState({ incident_type: "medical", location: "", description: "" });
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.location.trim() || !form.description.trim()) {
      showToast("Please describe the incident and its location.", "error");
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const response = await api.reportEmergency(form);
      setResult(response);
      showToast(`Incident ${response.incident_id} reported successfully.`, "success");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to report the incident.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-stadium-danger/15 text-stadium-danger">
          <FiAlertTriangle size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">Emergency Assistant</h1>
          <p className="text-sm text-slate-400">
            For life-threatening emergencies, always alert the nearest
            volunteer or staff member immediately in addition to reporting here.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="incident-type" className="mb-1.5 block text-sm font-medium text-slate-300">
              Incident type
            </label>
            <select
              id="incident-type"
              value={form.incident_type}
              onChange={(e) => updateField("incident_type", e.target.value)}
              className="w-full rounded-xl border border-stadium-border bg-stadium-surfaceAlt px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-stadium-primary"
            >
              {INCIDENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="incident-location" className="mb-1.5 block text-sm font-medium text-slate-300">
              Location
            </label>
            <input
              id="incident-location"
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="e.g. Section 14, near Gate C"
              className="w-full rounded-xl border border-stadium-border bg-stadium-surfaceAlt px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-stadium-primary"
            />
          </div>

          <div>
            <label htmlFor="incident-description" className="mb-1.5 block text-sm font-medium text-slate-300">
              Description
            </label>
            <textarea
              id="incident-description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
              placeholder="Describe what's happening…"
              className="w-full resize-none rounded-xl border border-stadium-border bg-stadium-surfaceAlt px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-stadium-primary"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl bg-stadium-danger px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
          >
            <FiSend size={16} />
            {submitting ? "Reporting…" : "Report Incident"}
          </button>
        </form>
      </Card>

      {result && (
        <Card className="animate-slide-up">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold">Incident {result.incident_id}</h2>
            <StatusBadge status={result.priority} label={`${result.priority} priority`} />
          </div>
          <p className="mb-4 text-sm text-slate-300">{result.summary}</p>

          <div className="mb-4">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Immediate Actions
            </p>
            <ul className="space-y-1.5">
              {result.immediate_actions.map((action, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-slate-300">
                  <span className="text-stadium-primary">•</span> {action}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Suggested Evacuation / Access Route
            </p>
            <p className="text-sm text-slate-300">{result.suggested_evacuation_route}</p>
          </div>

          <div className="flex items-center gap-2 border-t border-stadium-border pt-3">
            <FiUsers className="text-stadium-accent" size={16} />
            <p className="text-xs text-slate-400">
              Notified: {result.volunteers_notified.join(", ")}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
