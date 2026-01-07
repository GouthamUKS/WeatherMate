import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base path for GitHub Pages deployment
  base: "/WeatherMate/", 
  
  server: {
    host: "::",
    port: 8080,
    // Automatically opens the browser to the correct sub-path to avoid local 404s
    open: "/WeatherMate/", 
  },
  
  plugins: [
    react(), 
    mode === "development" && componentTagger()
  ].filter(Boolean),
  
  resolve: {
    alias: {
      // Allows using '@' to reference the 'src' directory
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));