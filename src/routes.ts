import { Router } from "express";
import {
  getCheckIns,
  getMemberProfile,
  validateTenant,
  addCheckIn,
} from "./store.js";
import { broadcastCheckIn } from "./websocket.js";
import type { CheckInEvent } from "./types.js";

export const apiRouter = Router();

apiRouter.get("/checkins", (req, res) => {
  const tenantId = req.query.tenantId as string;
  if (!tenantId) {
    res.status(400).json({ error: "tenantId is required" });
    return;
  }
  if (!validateTenant(tenantId)) {
    res.status(400).json({ error: "Invalid tenantId" });
    return;
  }
  const checkIns = getCheckIns(tenantId);
  res.json(checkIns);
});

apiRouter.get("/members/:memberId", (req, res) => {
  const tenantId = req.query.tenantId as string;
  const { memberId } = req.params;
  if (!tenantId) {
    res.status(400).json({ error: "tenantId is required" });
    return;
  }
  if (!validateTenant(tenantId)) {
    res.status(400).json({ error: "Invalid tenantId" });
    return;
  }
  const profile = getMemberProfile(tenantId, memberId);
  if (!profile) {
    res.status(404).json({ error: "Member not found" });
    return;
  }
  res.json(profile);
});

apiRouter.post("/checkins", (req, res) => {
  const tenantId = req.body?.tenantId as string;
  if (!tenantId || !validateTenant(tenantId)) {
    res.status(400).json({ error: "Valid tenantId is required" });
    return;
  }
  const event = addCheckIn(tenantId, req.body as Partial<CheckInEvent>);
  broadcastCheckIn(tenantId, event);
  res.status(201).json(event);
});
