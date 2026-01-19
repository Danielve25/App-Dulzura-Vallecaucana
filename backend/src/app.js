import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import menuRoutes from "./routes/menu.routes.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/lunch.routes.js";
import whatsappRoutes from "./routes/whatsapp.routes.js";
const app = express();
import { EnvConfig } from "./config.js";
const config = EnvConfig();
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(morgan("dev"));

app.use(express.json());

app.use(cookieParser());

// Configurar cookies para producción
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/api", menuRoutes);
app.use("/api", taskRoutes);
app.use("/api", authRoutes);
app.use("/api", whatsappRoutes);

export default app;
