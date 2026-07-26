import { createClient } from "@/lib/supabase/server";
import type { Event } from "@/lib/types/domain";

function mapEvent(row: {
  id: string;
  group_id: string;
  title: string;
  event_at: string;
  location: string;
  created_at: string;
}): Event {
  return {
    id: row.id,
    groupId: row.group_id,
    title: row.title,
    eventAt: row.event_at,
    location: row.location,
    createdAt: row.created_at,
  };
}

export async function getUpcomingEventByGroupId(
  groupId: string,
): Promise<Event | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("group_id", groupId)
    .order("event_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return data ? mapEvent(data) : null;
}
