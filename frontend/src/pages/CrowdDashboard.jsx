import { useEffect, useState } from "react";
import { FiRefreshCw, FiZap } from "react-icons/fi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Card from "../components/Card.jsx";
import { SkeletonCard } from "../components/Skeleton.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { api, ApiError } from "../utils/api.js";

const CATEGORY_LABELS = {
  gate: "Gates",
  washroom: "Washrooms",
  food_court: "Food Courts",
  parking: "Parking",
};

export default function CrowdDashboard() {
  const [snapshot, setSnapshot] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingSnapshot, setLoadingSnapshot] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const { showToast } = useToast();

  const loadSnapshot = async () => {
    setLoadingSnapshot(true);
    try {
      const data = await api.getCrowdSnapshot();
      setSnapshot(data);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to load crowd data.", "error");
    } finally {
      setLoadingSnapshot(false);
    }
  };

  const loadRecommendations = async () => {
    setLoadingRecs(true);
    try {
      const data = await api.getCrowdRecommendations();
      setRecommendations(data.recommendations);
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Failed to generate AI recommendations.",
        "error"
      );
    } finally {
      setLoadingRecs(false);
    }
  };

  // Intentionally runs once on mount only — loadSnapshot/loadRecommendations
  // are re-created each render but don't need to be re-triggered on their own change.
  useEffect(() => {
    loadSnapshot();
    loadRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData =
    snapshot?.metrics.map((m) => ({
      name: m.location.replace(" - ", "\n"),
      occupancy: m.occupancy_percent,
    })) || [];

  const grouped = groupByCategory(snapshot?.metrics || []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 animate-fade-in">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Crowd Intelligence Dashboard</h1>
          <p className="text-sm text-slate-400">
            Simulated live occupancy across gates, washrooms, food courts, and parking.
          </p>
        </div>
        <button
          onClick={() => {
            loadSnapshot();
            loadRecommendations();
          }}
          className="flex items-center gap-2 rounded-lg border border-stadium-border bg-stadium-surface px-4 py-2 text-sm font-medium text-slate-200 hover:bg-stadium-surfaceAlt"
        >
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      {loadingSnapshot ? (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(grouped).map(([category, metrics]) => (
            <Card key={category}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {CATEGORY_LABELS[category]}
              </p>
              <ul className="space-y-2.5">
                {metrics.map((m) => (
                  <li key={m.location} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-slate-300">{m.location}</span>
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-bold">{m.occupancy_percent}%</span>
                      <StatusBadge status={m.status} />
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      <Card className="mb-6">
        <h2 className="mb-4 text-base font-bold">Occupancy Overview</h2>
        {loadingSnapshot ? (
          <div className="skeleton h-64 w-full rounded-xl" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232d45" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: "#131a2b",
                  border: "1px solid #232d45",
                  borderRadius: 12,
                  color: "#e2e8f0",
                }}
              />
              <Bar dataKey="occupancy" radius={[6, 6, 0, 0]} fill="#22d3ee" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card>
        <div className="mb-3 flex items-center gap-2">
          <FiZap className="text-stadium-accent" />
          <h2 className="text-base font-bold">AI Operational Recommendations</h2>
        </div>
        {loadingRecs ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-5 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-stadium-accent" />
                {rec}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function groupByCategory(metrics) {
  return metrics.reduce((acc, metric) => {
    acc[metric.category] = acc[metric.category] || [];
    acc[metric.category].push(metric);
    return acc;
  }, {});
}
