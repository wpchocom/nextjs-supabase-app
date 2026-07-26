import type { GroupMember } from "@/lib/types/domain";

const DUMMY_MEMBERS: GroupMember[] = [
  {
    id: "mem-1",
    groupId: "grp-1",
    userId: "user-1",
    role: "organizer",
    status: "active",
    createdAt: "2026-07-01T00:00:00.000Z",
  },
  {
    id: "mem-2",
    groupId: "grp-1",
    userId: "user-2",
    role: "member",
    status: "active",
    createdAt: "2026-07-02T00:00:00.000Z",
  },
  {
    id: "mem-3",
    groupId: "grp-2",
    userId: "user-1",
    role: "organizer",
    status: "active",
    createdAt: "2026-07-10T00:00:00.000Z",
  },
];

export function getDummyMembers(): GroupMember[] {
  return DUMMY_MEMBERS;
}

export function getDummyMembersByGroupId(groupId: string): GroupMember[] {
  return DUMMY_MEMBERS.filter((member) => member.groupId === groupId);
}
