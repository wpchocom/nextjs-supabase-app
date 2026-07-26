import { getDummyMembersByGroupId } from "@/lib/dummy/members";
import type { GroupMember } from "@/lib/types/domain";

export interface MemberWithProfile extends GroupMember {
  displayName: string;
  avatarUrl: string | null;
}

export async function getMembersByGroupId(
  groupId: string,
): Promise<MemberWithProfile[]> {
  return getDummyMembersByGroupId(groupId).map((member) => ({
    ...member,
    avatarUrl: null,
  }));
}
