/**
 * Reusable surface card used across all dashboards.
 */
export default function Card({ children, className = "", as: Component = "div", ...rest }) {
  return (
    <Component
      className={`rounded-2xl border border-stadium-border bg-stadium-surface p-5 shadow-lg shadow-black/20 transition-shadow hover:shadow-glow ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
}
