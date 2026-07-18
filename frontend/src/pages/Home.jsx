import { Link } from "react-router-dom";
import {
  FiActivity,
  FiArrowRight,
  FiHeart,
  FiAlertTriangle,
  FiMessageCircle,
  FiWind,
} from "react-icons/fi";

import Card from "../components/Card.jsx";

const FEATURES = [
  {
    to: "/copilot",
    icon: FiMessageCircle,
    title: "AI Stadium Copilot",
    description:
      "Ask about gates, seats, restrooms, food, rules, and emergencies — answered with Gemini and grounded in real stadium knowledge.",
  },
  {
    to: "/crowd",
    icon: FiActivity,
    title: "Crowd Intelligence",
    description:
      "Live gate, washroom, food court, and parking congestion with AI-generated operational recommendations.",
  },
  {
    to: "/accessibility",
    icon: FiHeart,
    title: "Accessibility Assistant",
    description:
      "Wheelchair-friendly routes, voice input, text-to-speech, high contrast, and large text modes.",
  },
  {
    to: "/emergency",
    icon: FiAlertTriangle,
    title: "Emergency Assistant",
    description:
      "Report medical emergencies, lost children, fire, or suspicious items and get instant AI-triaged guidance.",
  },
  {
    to: "/sustainability",
    icon: FiWind,
    title: "Sustainability Dashboard",
    description:
      "Track electricity, water, and waste metrics with AI-generated optimization suggestions.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 animate-fade-in">
      <section className="mb-12 text-center">
        <span className="mb-4 inline-block rounded-full border border-stadium-border bg-stadium-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-stadium-primary">
          FIFA World Cup 2026 · Fan Experience
        </span>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
          Your AI-powered{" "}
          <span className="bg-gradient-to-r from-stadium-primary to-stadium-accent bg-clip-text text-transparent">
            Stadium Guardian
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          Navigation, crowd management, accessibility, multilingual support,
          and emergency response — powered by Google Gemini and real-time
          operational intelligence.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/copilot"
            className="flex items-center gap-2 rounded-xl bg-stadium-primary px-6 py-3 text-sm font-semibold text-stadium-bg transition hover:bg-stadium-primaryDark"
          >
            Ask the Copilot <FiArrowRight />
          </Link>
          <Link
            to="/crowd"
            className="rounded-xl border border-stadium-border bg-stadium-surface px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-stadium-surfaceAlt"
          >
            View Live Dashboard
          </Link>
        </div>
      </section>

      <section
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Feature modules"
      >
        {FEATURES.map(({ to, icon: Icon, title, description }) => (
          <Link key={to} to={to} className="block">
            <Card className="h-full hover:border-stadium-primary/40">
              <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-stadium-primary/10 text-stadium-primary">
                <Icon size={20} />
              </div>
              <h2 className="mb-1.5 text-lg font-bold">{title}</h2>
              <p className="text-sm text-slate-400">{description}</p>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
