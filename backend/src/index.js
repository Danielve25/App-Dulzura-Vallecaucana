import app from "./app.js";
import { connectDB } from "./db.js";
import { config } from "dotenv";
config();

const PORT = process.env.PORT;
connectDB();

app.listen(PORT);

console.log(`server en http://localhost:${PORT}`);
