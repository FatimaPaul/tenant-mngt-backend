import type { CheckInEvent } from "./types.ts";
import { createNewCheckIn, TENANT_IDS } from "./mockData.js";

const checkInsByTenant = new Map<string, CheckInEvent[]>();

function ensureTenant(tenantId: string): CheckInEvent[] {
  if (!checkInsByTenant.has(tenantId)) {
    checkInsByTenant.set(tenantId, []);
  }
  return checkInsByTenant.get(tenantId)!;
}

export function getCheckIns(tenantId: string): CheckInEvent[] {
  const list = ensureTenant(tenantId);
  return [...list];
}

export function getMemberCheckIns(
  tenantId: string,
  memberId: string,
): CheckInEvent[] {
  const list = ensureTenant(tenantId);
  return list.filter((e) => e.memberId === memberId);
}

export function getMemberProfile(
  tenantId: string,
  memberId: string,
): {
  memberId: string;
  name: string;
  email: string;
  tenantId: string;
  recentCheckIns: CheckInEvent[];
} | null {
  const list = ensureTenant(tenantId);
  const first = list.find((e) => e.memberId === memberId);
  if (!first) return null;
  const recentCheckIns = list
    .filter((e) => e.memberId === memberId)
    .slice(0, 10);
  return {
    memberId: first.memberId,
    name: first.name,
    email: first.email,
    tenantId: first.tenantId,
    recentCheckIns,
  };
}

export function addCheckIn(
  tenantId: string,
  event: Partial<CheckInEvent>,
): CheckInEvent {
  const list = ensureTenant(tenantId);
  const newEvent = createNewCheckIn(tenantId, event);
  list.unshift(newEvent);
  return newEvent;
}

export function getTenantIds(): string[] {
  return [...TENANT_IDS];
}

export function validateTenant(tenantId: string): boolean {
  return TENANT_IDS.includes(tenantId as (typeof TENANT_IDS)[number]);
}
