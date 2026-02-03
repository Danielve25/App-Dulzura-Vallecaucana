import { EnvConfig } from "./config.js";
import app from "./app.js";
import { connectDB } from "./db.js";
import { createServer } from "http"; //
import { Server } from "socket.io"; // Nuevo

const config = EnvConfig(); //

// 1. Crear el servidor HTTP usando la app de Express
const httpServer = createServer(app);

// 2. Configurar Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: config.FRONTEND_URL, //
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// 3. Hacer 'io' accesible en todas tus rutas/controladores
app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);
});

connectDB() //
  .then(() => {
    // 4. IMPORTANTE: Usar httpServer.listen en lugar de app.listen
    httpServer.listen(config.PORT || 3000, () => {
      console.log(
        `Server con WebSockets en http://localhost:${config.PORT || 3000}`,
      );
    });
  })
  .catch((error) => {
    console.error(error); //
  });
