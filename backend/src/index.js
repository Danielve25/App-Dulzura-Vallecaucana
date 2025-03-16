import { EnvConfig } from "./config.js";

const config = EnvConfig();
import app from "./app.js";
import { connectDB } from "./db.js";

connectDB();

app.listen(config.PORT || 3000);

console.log(`server en http://localhost:${config.PORT}`);
