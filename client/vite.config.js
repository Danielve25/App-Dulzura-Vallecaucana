import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import Fonts from "unplugin-fonts/vite";
import viteImagemin from "vite-plugin-imagemin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Fonts({
      google: {
        families: [
          {
            name: "Roboto",
            styles: "wght@400;700",
          },
          {
            name: "Open Sans",
            styles: "wght@400",
          },
          {
            name: "Red Hat Text",
            styles: "wght@400;600",
          },
        ],
      },
    }),
    viteImagemin({
      optipng: {
        optimizationLevel: 7, // Nivel de optimización
      },
      gifsicle: {
        optimizationLevel: 3,
      },
      mozjpeg: {
        quality: 80,
      },
      webp: {
        quality: 75,
      },
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
        manualChunks: {
          // Divide las dependencias grandes en chunks separados
          react: ["react", "react-dom", "react-router"],
          radix: [
            "@radix-ui/react-select",
            "@radix-ui/react-label",
            "@radix-ui/react-slot",
            "@radix-ui/react-accordion",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-popover",
            "@radix-ui/react-separator",
          ],
          utils: ["clsx", "tailwind-merge", "class-variance-authority"],
          pdf: ["jspdf", "jspdf-autotable"],
          xlsx: ["xlsx"],
        },
      },
    },
  },
});
