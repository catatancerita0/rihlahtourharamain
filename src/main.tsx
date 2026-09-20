import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container #root is missing from index.html");
}

// BASE_URL mirrors the Vite base setting. It is "/" during local development
// and "/<repository>/" on GitHub Pages, so one build serves both without a
// second set of paths. The router strips a trailing slash on its own.
createRoot(container).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
