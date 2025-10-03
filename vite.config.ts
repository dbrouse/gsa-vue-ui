import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "YourOrgUI",
      fileName: (format) => (format === "es" ? "index.mjs" : "index.cjs"),
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["vue", /^vue-icons-plus/],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
    sourcemap: true,
  },
});
