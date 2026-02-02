export type CheckInStatus = "ACTIVE" | "LEFT";

export interface CheckInEvent {
  eventId: string;
  tenantId: string;
  memberId: string;
  name: string;
  email: string;
  facility: string;
  timestamp: string;
  status: CheckInStatus;
}

export interface MemberProfile {
  memberId: string;
  name: string;
  email: string;
  tenantId: string;
  recentCheckIns: CheckInEvent[];
}
