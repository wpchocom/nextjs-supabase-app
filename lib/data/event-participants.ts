import { createClient } from "@/lib/supabase/server";
import type { EventParticipant } from "@/lib/types/domain";

function mapParticipant(row: {
  id: string;
  event_id: string;
  user_id: string;
  rsvp_status: string;
  attendance_status: string;
  created_at: string;
}): EventParticipant {
  return {
    id: row.id,
    eventId: row.event_id,
    userId: row.user_id,
    rsvpStatus: row.rsvp_status as EventParticipant["rsvpStatus"],
    attendanceStatus:
      row.attendance_status as EventParticipant["attendanceStatus"],
    createdAt: row.created_at,
  };
}

export async function getParticipantsByEventId(
  eventId: string,
): Promise<EventParticipant[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("event_participants")
    .select("*")
    .eq("event_id", eventId);

  return (data ?? []).map(mapParticipant);
}
