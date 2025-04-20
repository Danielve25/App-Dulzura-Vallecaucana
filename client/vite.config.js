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
});
