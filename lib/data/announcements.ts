import { createClient } from "@/lib/supabase/server";
import type { Announcement } from "@/lib/types/domain";

export interface AnnouncementWithAuthor extends Announcement {
  authorName: string;
}

function mapAnnouncement(row: {
  id: string;
  group_id: string;
  event_id: string | null;
  author_id: string;
  title: string;
  content: string;
  created_at: string;
  profiles: { username: string | null; full_name: string | null } | null;
}): AnnouncementWithAuthor {
  return {
    id: row.id,
    groupId: row.group_id,
    eventId: row.event_id,
    authorId: row.author_id,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
    authorName:
      row.profiles?.full_name || row.profiles?.username || "알 수 없음",
  };
}

export async function getAnnouncementsByGroupId(
  groupId: string,
): Promise<AnnouncementWithAuthor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("*, profiles(username, full_name)")
    .eq("group_id", groupId)
    .order("created_at", { ascending: false });

  return (data ?? []).map(mapAnnouncement);
}
