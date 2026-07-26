import { getDummyEventParticipants } from "@/lib/dummy/event-participants";
import type { EventParticipant } from "@/lib/types/domain";

/**
 * groupId는 더미 생성을 위한 임시 인자다. Task016에서 실제 event_participants
 * 조회로 교체되면 eventId만으로 조회 가능해져 이 인자는 제거된다.
 */
export async function getParticipantsByEventId(
  eventId: string,
  groupId: string,
): Promise<EventParticipant[]> {
  return getDummyEventParticipants(groupId, eventId);
}
