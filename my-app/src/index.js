import React from "react";
import { UserProvider } from "./context/AuthContext"; // Import UserProvider

import { createRoot } from "react-dom/client";
import App from "./components/pages/App";
import ErrorBoundary from "./components/pages/ErrorBoundary";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";


const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ErrorBoundary>
      <BrowserRouter>
        <UserProvider> {/* Wrap App with UserProvider */}

          <App />
        </UserProvider>

      </BrowserRouter>
  </ErrorBoundary>
);

reportWebVitals();
