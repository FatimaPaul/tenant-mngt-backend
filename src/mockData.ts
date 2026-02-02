import type { CheckInEvent, CheckInStatus } from "./types.js";

// Must match frontend TENANTS in DashboardContext (clubA, clubB, clubC)
export const TENANT_IDS = ["clubA", "clubB", "clubC"] as const;

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function randomFacility(): string {
  const facilities = ["Gym", "Pool", "Yoga Studio", "Spin Class", "CrossFit"];
  return facilities[Math.floor(Math.random() * facilities.length)];
}

function randomStatus(): CheckInStatus {
  return Math.random() > 0.5 ? "ACTIVE" : "LEFT";
}

export function createNewCheckIn(
  tenantId: string,
  event?: Partial<CheckInEvent>
): CheckInEvent {
  return {
    eventId: generateId(),
    tenantId,
    memberId: event?.memberId ?? `member-${generateId()}`,
    name: event?.name ?? `Member ${generateId().substring(0, 6)}`,
    email: event?.email ?? `member${generateId().substring(0, 6)}@example.com`,
    facility: event?.facility ?? randomFacility(),
    timestamp: event?.timestamp ?? new Date().toISOString(),
    status: event?.status ?? randomStatus(),
  };
}

// Initial mock data (tenantIds match frontend: clubA, clubB, clubC)
const initialCheckIns: CheckInEvent[] = [
  {
    eventId: "evt-001",
    tenantId: "clubA",
    memberId: "member-001",
    name: "John Doe",
    email: "john.doe@example.com",
    facility: "Gym",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: "ACTIVE",
  },
  {
    eventId: "evt-002",
    tenantId: "clubA",
    memberId: "member-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    facility: "Pool",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: "LEFT",
  },
  {
    eventId: "evt-003",
    tenantId: "clubB",
    memberId: "member-003",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    facility: "Yoga Studio",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    status: "ACTIVE",
  },
];

// Store initial check-ins
const checkInsByTenant = new Map<string, CheckInEvent[]>();
initialCheckIns.forEach((checkIn) => {
  const list = checkInsByTenant.get(checkIn.tenantId) ?? [];
  list.push(checkIn);
  checkInsByTenant.set(checkIn.tenantId, list);
});
