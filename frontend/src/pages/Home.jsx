import { Link } from "react-router-dom";
import {
  FiActivity,
  FiArrowRight,
  FiHeart,
  FiAlertTriangle,
  FiMessageCircle,
  FiWind,
  FiZap,
} from "react-icons/fi";

import Card from "../components/Card.jsx";

const FEATURES = [
  {
    to: "/copilot",
    icon: FiMessageCircle,
    title: "Trikkie — AI Copilot",
    description:
      "Ask about gates, seats, restrooms, food, and rules — answered by Gemini, grounded in real stadium knowledge.",
    accent: "from-stadium-pitch to-stadium-primary",
  },
  {
    to: "/crowd",
    icon: FiActivity,
    title: "Crowd Intelligence",
    description:
      "Live gate, washroom, food court, and parking congestion with AI-generated operational calls.",
    accent: "from-stadium-primary to-stadium-accent",
  },
  {
    to: "/accessibility",
    icon: FiHeart,
    title: "Accessibility Assistant",
    description:
      "Wheelchair-friendly routes, voice input, text-to-speech, high contrast, and large text modes.",
    accent: "from-stadium-accent to-stadium-gold",
  },
  {
    to: "/emergency",
    icon: FiAlertTriangle,
    title: "Emergency Assistant",
    description:
      "Report medical emergencies, lost children, fire, or suspicious items and get instant AI-triaged guidance.",
    accent: "from-stadium-danger to-stadium-gold",
  },
  {
    to: "/sustainability",
    icon: FiWind,
    title: "Sustainability Dashboard",
    description:
      "Track electricity, water, and waste metrics with AI-generated optimization suggestions.",
    accent: "from-stadium-pitch to-stadium-success",
  },
];

const TICKER_WORDS = [
  "NAVIGATION",
  "CROWD INTELLIGENCE",
  "ACCESSIBILITY",
  "MULTILINGUAL",
  "SUSTAINABILITY",
  "EMERGENCY RESPONSE",
];

const STATS = [
  { value: "6", label: "Languages Supported" },
  { value: "24/7", label: "AI-Powered Guidance" },
  { value: "5", label: "Core Fan Modules" },
  { value: "100%", label: "Grounded Answers" },
];

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <section className="relative grain overflow-hidden border-b border-stadium-border pb-16 pt-14">
        <div className="pitch-lines absolute inset-0" aria-hidden="true" />
        <div
          className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-stadium-pitch/20 blur-3xl animate-blob"
          aria-hidden="true"
        />
        <div
          className="absolute -right-16 top-32 h-80 w-80 rounded-full bg-stadium-primary/20 blur-3xl animate-blob-delay"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-stadium-gold/40 bg-stadium-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-stadium-gold">
              <FiZap size={12} /> FIFA World Cup 2026 · Fan Experience
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl text-center font-display text-6xl leading-[0.95] tracking-wide sm:text-7xl md:text-8xl">
            YOUR STADIUM,
            <br />
            <span className="gradient-text">GUARDED BY AI</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-center text-base text-slate-400 sm:text-lg">
            Meet <span className="font-semibold text-slate-200">Trikkie</span> — navigation,
            crowd management, accessibility, multilingual support, and emergency
            response, powered by Google Gemini and real-time operational intelligence.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/copilot"
              className="group flex items-center gap-2 rounded-xl bg-stadium-pitch px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-stadium-bg shadow-pitchGlow transition hover:bg-stadium-pitchDark"
            >
              Talk to Trikkie{" "}
              <FiArrowRight className="transition group-hover:translate-x-1" />
            </Link>
            <Link
              to="/crowd"
              className="rounded-xl border border-stadium-border bg-stadium-surface px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-slate-200 transition hover:border-stadium-primary/40 hover:bg-stadium-surfaceAlt"
            >
              Live Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* MARQUEE TICKER */}
      <div className="overflow-hidden border-b border-stadium-border bg-stadium-surface py-3">
        <div className="marquee-track">
          {[...TICKER_WORDS, ...TICKER_WORDS].map((word, i) => (
            <span
              key={i}
              className="mx-6 flex items-center gap-3 whitespace-nowrap font-display text-xl tracking-wide text-slate-500"
            >
              {word}
              <span className="text-stadium-pitch">●</span>
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-stadium-border bg-stadium-surface/60 px-4 py-6 text-center animate-float"
              style={{ animationDelay: `${idx * 0.4}s` }}
            >
              <p className="font-display text-4xl text-stadium-pitch">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6" aria-label="Feature modules">
        <h2 className="mb-8 text-center font-display text-3xl tracking-wide text-slate-200 sm:text-4xl">
          EVERYTHING YOUR MATCHDAY NEEDS
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ to, icon: Icon, title, description, accent }) => (
            <Link key={to} to={to} className="block">
              <Card className="glow-card h-full">
                <div
                  className={`mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${accent} text-stadium-bg`}
                >
                  <Icon size={22} />
                </div>
                <h3 className="mb-1.5 text-lg font-bold">{title}</h3>
                <p className="text-sm text-slate-400">{description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
