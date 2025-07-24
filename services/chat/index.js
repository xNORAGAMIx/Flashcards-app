import app from "./server.js";
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./socket/app.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.URL,
  },
});

socketHandler(io);

const PORT = process.env.PORT || 5008;
server.listen(PORT, () => {
  console.log(`Chat service running on port ${PORT}`);
});
