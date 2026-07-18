import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiActivity,
  FiAlertTriangle,
  FiHeart,
  FiHome,
  FiMenu,
  FiMessageCircle,
  FiWind,
  FiX,
} from "react-icons/fi";

import { useLanguage, SUPPORTED_LANGUAGES } from "../context/LanguageContext.jsx";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: FiHome, end: true },
  { to: "/copilot", label: "Stadium Copilot", icon: FiMessageCircle },
  { to: "/crowd", label: "Crowd Intelligence", icon: FiActivity },
  { to: "/accessibility", label: "Accessibility", icon: FiHeart },
  { to: "/emergency", label: "Emergency", icon: FiAlertTriangle },
  { to: "/sustainability", label: "Sustainability", icon: FiWind },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-stadium-border bg-stadium-bg/90 backdrop-blur">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6"
        aria-label="Primary"
      >
        <NavLink to="/" className="flex items-center gap-2 font-extrabold text-lg">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-stadium-primary to-stadium-accent text-stadium-bg">
            SG
          </span>
          <span className="hidden sm:inline">Stadium Guardian AI</span>
        </NavLink>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-stadium-surfaceAlt text-stadium-primary"
                    : "text-slate-400 hover:bg-stadium-surface hover:text-slate-200"
                }`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="global-language-select" className="sr-only">
            Choose assistant language
          </label>
          <select
            id="global-language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="hidden rounded-lg border border-stadium-border bg-stadium-surface px-2 py-1.5 text-sm text-slate-200 sm:block"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>

          <button
            className="rounded-lg p-2 text-slate-300 hover:bg-stadium-surface lg:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-stadium-border bg-stadium-bg px-4 pb-4 lg:hidden animate-fade-in">
          <div className="flex flex-col gap-1 pt-2">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-stadium-surfaceAlt text-stadium-primary"
                      : "text-slate-400 hover:bg-stadium-surface"
                  }`
                }
              >
                <Icon size={16} /> {label}
              </NavLink>
            ))}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-2 rounded-lg border border-stadium-border bg-stadium-surface px-2 py-2 text-sm text-slate-200"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </header>
  );
}
