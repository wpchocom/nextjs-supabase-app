import { getDummyMembersByGroupId } from "@/lib/dummy/members";
import type {
  AttendanceStatus,
  EventParticipant,
  RsvpStatus,
} from "@/lib/types/domain";

const DUMMY_STATUS_CYCLE: Array<[RsvpStatus, AttendanceStatus]> = [
  ["attending", "attended"],
  ["attending", "unconfirmed"],
  ["pending", "unconfirmed"],
];

/**
 * eventId·groupId 조합으로 결정론적으로 참석 더미를 생성한다.
 * Task016~017에서 실제 event_participants 조회로 교체된다.
 */
export function getDummyEventParticipants(
  groupId: string,
  eventId: string,
): EventParticipant[] {
  return getDummyMembersByGroupId(groupId).map((member, index) => {
    const [rsvpStatus, attendanceStatus] =
      DUMMY_STATUS_CYCLE[index % DUMMY_STATUS_CYCLE.length];

    return {
      id: `${eventId}-participant-${member.userId}`,
      eventId,
      userId: member.userId,
      rsvpStatus,
      attendanceStatus,
      createdAt: member.createdAt,
    };
  });
}
