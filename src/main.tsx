import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// The basename must match your repository name exactly
createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/WeatherMate">
    <App />
  </BrowserRouter>
);
