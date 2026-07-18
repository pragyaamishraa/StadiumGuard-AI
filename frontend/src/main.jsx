import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { AccessibilityProvider } from "./context/AccessibilityContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AccessibilityProvider>
        <LanguageProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </LanguageProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  </React.StrictMode>
);
