const STYLES = {
  low: "bg-stadium-success/15 text-stadium-success border-stadium-success/30",
  moderate: "bg-stadium-warning/15 text-stadium-warning border-stadium-warning/30",
  high: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  critical: "bg-stadium-danger/15 text-stadium-danger border-stadium-danger/30",
  medium: "bg-stadium-warning/15 text-stadium-warning border-stadium-warning/30",
};

/** Small colored pill used for occupancy status and incident priority. */
export default function StatusBadge({ status, label }) {
  const style = STYLES[status] || STYLES.moderate;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}
    >
      {label || status}
    </span>
  );
}
