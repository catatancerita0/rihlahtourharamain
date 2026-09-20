import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The managed preview runs outside a browser dev session, so hot module
// replacement is off and the server must bind to every interface.
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT ?? 5173),
    hmr: false,
  },
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT ?? 4173),
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
