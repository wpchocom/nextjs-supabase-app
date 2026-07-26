import type { Announcement } from "@/lib/types/domain";

const DUMMY_AUTHOR_ID = "user-1";

/**
 * 그룹 ID별 고정 목업을 조회하는 groups.ts/events.ts와 달리, 이 함수는 실제 그룹
 * 라우트(UUID)에서도 데모가 보이도록 groupId 기반으로 결정론적으로 2건을 생성한다.
 * Task010에서 실제 group_id 기준 Supabase 조회로 교체된다.
 */
export function getDummyAnnouncementsByGroupId(
  groupId: string,
): Announcement[] {
  return [
    {
      id: `${groupId}-ann-2`,
      groupId,
      eventId: null,
      authorId: DUMMY_AUTHOR_ID,
      title: "이번 주 모임 안내",
      content:
        "이번 주 모임은 평소보다 30분 늦게 시작합니다. 늦지 않게 와주세요!",
      createdAt: "2026-07-15T09:00:00.000Z",
    },
    {
      id: `${groupId}-ann-1`,
      groupId,
      eventId: null,
      authorId: DUMMY_AUTHOR_ID,
      title: "그룹 운영 안내",
      content:
        "매주 모임 전날 저녁에 참석 여부를 미리 알려주시면 준비에 큰 도움이 됩니다.\n\n감사합니다!",
      createdAt: "2026-07-10T12:00:00.000Z",
    },
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
