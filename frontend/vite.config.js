import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    // Vercel's Express deployment serves this generated root-level directory.
    outDir: "../public",
    emptyOutDir: true,
  },
});
