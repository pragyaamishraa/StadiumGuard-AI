/**
 * Consistent empty-state placeholder used whenever a list/dashboard has no
 * data to show yet.
 */
export default function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-stadium-border bg-stadium-surface/50 py-12 text-center animate-fade-in">
      {icon && <div className="text-4xl text-slate-600">{icon}</div>}
      <h3 className="text-base font-semibold text-slate-200">{title}</h3>
      {description && <p className="max-w-sm text-sm text-slate-500">{description}</p>}
    </div>
  );
}
