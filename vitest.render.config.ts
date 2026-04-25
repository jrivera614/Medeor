import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

// Render-test config. Uses @vitejs/plugin-react for JSX/TSX transform and
// jsdom for the DOM environment. Kept separate from vitest.config.ts so the
// pure tests stay fast and so the React plugin / jsdom dependencies stay
// optional - if a contributor doesn't have them installed, pure tests still
// run.
//
// Run with: npx vitest run --config vitest.render.config.ts

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    setupFiles: ["./src/app/lib/sf600/__tests__/setup.ts"],
    include: ["src/app/lib/sf600/__tests__/**/*.test.tsx"],
    environment: "jsdom",
    globals: false,
  },
});
