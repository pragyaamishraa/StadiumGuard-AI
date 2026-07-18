import { createContext, useCallback, useContext, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

const ToastContext = createContext(null);

const ICONS = {
  success: <FiCheckCircle className="text-stadium-success" size={18} />,
  error: <FiAlertCircle className="text-stadium-danger" size={18} />,
  info: <FiInfo className="text-stadium-primary" size={18} />,
};

/** Simple app-wide toast notification system (success / error / info). */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "info", duration = 4000) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[90vw] max-w-sm"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="animate-slide-up flex items-start gap-3 rounded-xl border border-stadium-border bg-stadium-surface px-4 py-3 shadow-lg shadow-black/30"
          >
            {ICONS[toast.type]}
            <p className="flex-1 text-sm text-slate-200">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-slate-500 hover:text-slate-300"
            >
              <FiX size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
