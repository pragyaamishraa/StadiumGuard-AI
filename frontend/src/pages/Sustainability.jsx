import { useEffect, useState } from "react";
import { FiDroplet, FiRefreshCw, FiTrash2, FiZap } from "react-icons/fi";

import Card from "../components/Card.jsx";
import { SkeletonCard } from "../components/Skeleton.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { api, ApiError } from "../utils/api.js";

const METRIC_ICONS = {
  "Electricity Usage": FiZap,
  "Water Usage": FiDroplet,
  "Waste Generated": FiTrash2,
  "Food Waste": FiTrash2,
};

const TREND_STYLES = {
  up: "text-stadium-danger",
  down: "text-stadium-success",
  stable: "text-slate-400",
};

const TREND_SYMBOL = { up: "▲", down: "▼", stable: "▬" };

export default function Sustainability() {
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getSustainabilitySnapshot();
      setSnapshot(data);
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Failed to load sustainability data.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 animate-fade-in">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Sustainability Dashboard</h1>
          <p className="text-sm text-slate-400">
            Simulated resource usage with AI-generated optimization suggestions.
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 rounded-lg border border-stadium-border bg-stadium-surface px-4 py-2 text-sm font-medium text-slate-200 hover:bg-stadium-surfaceAlt"
        >
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : snapshot?.metrics.map((metric) => {
              const Icon = METRIC_ICONS[metric.metric] || FiZap;
              return (
                <Card key={metric.metric}>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-stadium-accent/10 text-stadium-accent">
                      <Icon size={16} />
                    </div>
                    <span className={`text-sm font-bold ${TREND_STYLES[metric.trend]}`}>
                      {TREND_SYMBOL[metric.trend]}
                    </span>
                  </div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {metric.metric}
                  </p>
                  <p className="mt-1 text-2xl font-extrabold">
                    {metric.value.toLocaleString()}{" "}
                    <span className="text-sm font-medium text-slate-500">{metric.unit}</span>
                  </p>
                </Card>
              );
            })}
      </div>

      <Card>
        <h2 className="mb-3 text-base font-bold">AI Optimization Suggestions</h2>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-5 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {snapshot?.suggestions.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-stadium-success" />
                {s}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
