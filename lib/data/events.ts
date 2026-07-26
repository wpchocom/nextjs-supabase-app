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

export async function getEventsByGroupId(groupId: string): Promise<Event[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("group_id", groupId)
    .order("event_at", { ascending: true });

  return (data ?? []).map(mapEvent);
}

export interface EventWithGroupName extends Event {
  groupName: string;
}

export async function getUpcomingEventsForUser(): Promise<
  EventWithGroupName[]
> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;
  if (!userId) return [];

  const { data } = await supabase
    .from("group_members")
    .select("groups(name, events(*))")
    .eq("user_id", userId)
    .eq("status", "active");

  const events = (data ?? []).flatMap((row) => {
    const group = row.groups;
    if (!group) return [];
    return group.events.map((event) => ({
      ...mapEvent(event),
      groupName: group.name,
    }));
  });

  return events.sort(
    (a, b) => new Date(a.eventAt).getTime() - new Date(b.eventAt).getTime(),
  );
}
