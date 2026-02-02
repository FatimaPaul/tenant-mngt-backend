import { WebSocketServer } from "ws";
import type { WebSocket } from "ws";
import type { CheckInEvent } from "./types.js";

const tenantSubscriptions = new Map<string, Set<WebSocket>>();

export function attachWebSocketServer(server: import("http").Server): void {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws: WebSocket, req) => {
    const url = new URL(req.url ?? "", `http://${req.headers.host}`);
    const tenantId = url.searchParams.get("tenantId");
    if (!tenantId) {
      ws.close(4000, "tenantId required");
      return;
    }
    if (!tenantSubscriptions.has(tenantId)) {
      tenantSubscriptions.set(tenantId, new Set());
    }
    tenantSubscriptions.get(tenantId)!.add(ws);
    ws.on("close", () => {
      tenantSubscriptions.get(tenantId)?.delete(ws);
    });
  });
}

export function broadcastCheckIn(tenantId: string, event: CheckInEvent): void {
  const subs = tenantSubscriptions.get(tenantId);
  if (!subs?.size) return;
  const payload = JSON.stringify({ type: "checkin", event });
  subs.forEach((ws) => {
    if (ws.readyState === 1) ws.send(payload);
  });
}
