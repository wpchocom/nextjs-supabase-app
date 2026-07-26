export type Role = "organizer" | "member";

export type MemberStatus = "active" | "removed";

export type RsvpStatus = "attending" | "not_attending" | "pending";

export type AttendanceStatus = "attended" | "absent" | "unconfirmed";

export type SplitType = "equal" | "custom";

export interface Group {
  id: string;
  name: string;
  inviteCode: string;
  organizerId: string;
  createdAt: string;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: Role;
  status: MemberStatus;
  createdAt: string;
}

export interface Event {
  id: string;
  groupId: string;
  title: string;
  eventAt: string;
  location: string;
  createdAt: string;
}
