import { PORT } from "./config.js";
import app from "./app.js";
import { connectDB } from "./db.js";

connectDB();

app.listen(PORT || 3000);

console.log(`server en http://localhost:${PORT}`);
