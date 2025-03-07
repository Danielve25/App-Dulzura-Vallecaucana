import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/tasks.routes.js";
import whatsappRoutes from "./routes/whatsapp.routes.js";
const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(cookieParser());

app.use("/api", taskRoutes);
app.use("/api", authRoutes);
app.use("/api", whatsappRoutes);

export default app;
