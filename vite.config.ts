import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import { compression } from "vite-plugin-compression2";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    analyzer({
      analyzerMode: "static",
      openAnalyzer: true,
    }),
    compression({
      algorithms: ["brotli"],
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("react-hook-form") || id.includes("zod") || id.includes("@hookform")) {
            return "form-vendor";
          }
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "react-vendor";
          }
          if (id.includes("@tanstack")) {
            return "tanstack";
          }
          if (id.includes("firebase")) {
            return "firebase";
          }
          if (id.includes("lodash-es")) {
            return "lodash-es";
          }

          if (id.includes("@radix-ui")) {
            return "radix-ui";
          }

          if (id.includes("@dnd-kit")) {
            return "dnd-kit";
          }

          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@tanstack/react-router",
      "@tanstack/react-query",
      "firebase/app",
      "firebase/auth",
      "firebase/firestore",
    ],
  },
});
