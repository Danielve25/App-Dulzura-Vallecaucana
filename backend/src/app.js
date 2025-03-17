import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/lunch.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import whatsappRoutes from "./routes/whatsapp.routes.js";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(morgan("dev"));

app.use(express.json());

app.use(cookieParser());

app.use("/api", paymentRoutes);
app.use("/api", taskRoutes);
app.use("/api", authRoutes);
app.use("/api", whatsappRoutes);

export default app;
