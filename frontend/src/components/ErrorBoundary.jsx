import { Component } from "react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

/**
 * Class-based error boundary (required by React) that catches render errors
 * in any subtree and shows a friendly recovery screen instead of a blank page.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In production this would report to an error-tracking service.
    console.error("Stadium Guardian AI crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <FiAlertTriangle className="text-5xl text-stadium-warning" />
          <h2 className="text-xl font-bold text-slate-100">Something went wrong</h2>
          <p className="max-w-md text-sm text-slate-400">
            This section of the app hit an unexpected error. You can try
            reloading the page, or head back to the home screen.
          </p>
          <button
            onClick={() => window.location.assign("/")}
            className="mt-2 flex items-center gap-2 rounded-lg bg-stadium-primary px-4 py-2 text-sm font-semibold text-stadium-bg transition hover:bg-stadium-primaryDark"
          >
            <FiRefreshCw /> Back to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
