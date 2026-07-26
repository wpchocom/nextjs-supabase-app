import type { GroupMember } from "@/lib/types/domain";

export interface DummyMember extends GroupMember {
  displayName: string;
}

const DUMMY_DISPLAY_NAMES = ["김주최", "박참여", "이참여"];

/**
 * groups.ts/events.ts처럼 고정된 "grp-1" 문자열로 필터링하면 실제 그룹
 * 라우트(UUID)에서는 항상 빈 배열이 되므로(announcements.ts에서 겪은 문제와 동일),
 * groupId를 그대로 반영해 결정론적으로 멤버를 생성한다.
 * Task015에서 실제 group_members+profiles 조회로 교체된다.
 */
export function getDummyMembersByGroupId(groupId: string): DummyMember[] {
  return [
    {
      id: `${groupId}-mem-1`,
      groupId,
      userId: "user-1",
      role: "organizer",
      status: "active",
      createdAt: "2026-07-01T00:00:00.000Z",
      displayName: DUMMY_DISPLAY_NAMES[0],
    },
    {
      id: `${groupId}-mem-2`,
      groupId,
      userId: "user-2",
      role: "member",
      status: "active",
      createdAt: "2026-07-02T00:00:00.000Z",
      displayName: DUMMY_DISPLAY_NAMES[1],
    },
    {
      id: `${groupId}-mem-3`,
      groupId,
      userId: "user-3",
      role: "member",
      status: "active",
      createdAt: "2026-07-03T00:00:00.000Z",
      displayName: DUMMY_DISPLAY_NAMES[2],
    },
  ];
}
