import { getDummyAnnouncementsByGroupId } from "@/lib/dummy/announcements";
import type { Announcement } from "@/lib/types/domain";

export async function getAnnouncementsByGroupId(
  groupId: string,
): Promise<Announcement[]> {
  return getDummyAnnouncementsByGroupId(groupId);
}
