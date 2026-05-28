import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [react(), checker({ typescript: true })],
  test: {
    environment: "node",
    globals: true,
  },
});
