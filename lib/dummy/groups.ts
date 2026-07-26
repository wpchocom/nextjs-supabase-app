import type { Group } from "@/lib/types/domain";

const DUMMY_GROUPS: Group[] = [
  {
    id: "grp-1",
    name: "주말 수영 모임",
    inviteCode: "SWIM2026",
    organizerId: "user-1",
    createdAt: "2026-07-01T00:00:00.000Z",
  },
  {
    id: "grp-2",
    name: "저녁 러닝크루",
    inviteCode: "RUN2026",
    organizerId: "user-1",
    createdAt: "2026-07-10T00:00:00.000Z",
  },
];

export function getDummyGroups(): Group[] {
  return DUMMY_GROUPS;
}

export function getDummyGroupById(id: string): Group | null {
  return DUMMY_GROUPS.find((group) => group.id === id) ?? null;
}

export function getDummyGroupByInviteCode(inviteCode: string): Group | null {
  return DUMMY_GROUPS.find((group) => group.inviteCode === inviteCode) ?? null;
}
