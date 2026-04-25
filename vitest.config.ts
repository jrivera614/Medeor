import { defineConfig } from "vitest/config";
import path from "path";

// Vitest config for the SF 600 pure/IndexedDB test suite. Render tests live
// in a separate config (vitest.render.config.ts) because they need jsdom +
// the React plugin and would slow down everything else.

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    setupFiles: ["./src/app/lib/sf600/__tests__/setup.ts"],
    // Exclude render tests from this config - they need jsdom.
    include: ["src/app/lib/sf600/__tests__/**/*.test.ts"],
    environment: "node",
    globals: false,
  },
});
