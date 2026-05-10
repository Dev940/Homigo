import { createApp } from "./app.js";
import { env } from "./config/env.js";
import http from "http";
import { attachSocketServer } from "./realtime/socket.js";

const app = createApp();
const server = http.createServer(app);

attachSocketServer(server);

server.listen(env.PORT, () => {
  console.log(`Homigo backend listening on http://localhost:${env.PORT}`);
});
