import express from "express";
import { createServer } from "http";
import cors from "cors";
import { apiRouter } from "./routes.js";
import { attachWebSocketServer } from "./websocket.js";

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    message: "Tenant Management API is running",
    endpoints: ["/api/checkins", "/api/members/:memberId"],
  });
});
app.use("/api", apiRouter);

attachWebSocketServer(httpServer);

const PORT = process.env.PORT ?? 5432;
httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`WebSocket at ws://localhost:${PORT}/ws`);
});
