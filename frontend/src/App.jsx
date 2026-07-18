import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import { SkeletonCard } from "./components/Skeleton.jsx";

// Lazy-load every route so the initial bundle only ships Home eagerly.
const Home = lazy(() => import("./pages/Home.jsx"));
const Copilot = lazy(() => import("./pages/Copilot.jsx"));
const CrowdDashboard = lazy(() => import("./pages/CrowdDashboard.jsx"));
const Accessibility = lazy(() => import("./pages/Accessibility.jsx"));
const Emergency = lazy(() => import("./pages/Emergency.jsx"));
const Sustainability = lazy(() => import("./pages/Sustainability.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

function RouteLoadingFallback() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[999] focus:rounded-lg focus:bg-stadium-primary focus:px-4 focus:py-2 focus:text-stadium-bg"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/copilot" element={<Copilot />} />
              <Route path="/crowd" element={<CrowdDashboard />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/sustainability" element={<Sustainability />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
