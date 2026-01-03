import { EnvConfig } from "./config.js";

const config = EnvConfig();
import app from "./app.js";
import { connectDB } from "./db.js";

connectDB()
  .then(() => {
    app.listen(config.PORT, () => {
      console.log(`server en http://localhost:${config.PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
