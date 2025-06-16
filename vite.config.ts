import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
    },
  },
  server: {
    port: 5174,
    host: "0.0.0.0", // Allow access from any IP address on the local network
    strictPort: false, // If port 5174 is busy, try the next available port
  },
});
