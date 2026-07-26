import { Suspense } from "react";

import { MembersView } from "@/components/members-view";
import { RouteLoading } from "@/components/route-loading";
import { getParticipantsByEventId } from "@/lib/data/event-participants";
import { getUpcomingEventByGroupId } from "@/lib/data/events";
import { getGroupById } from "@/lib/data/groups";
import { getMembersByGroupId } from "@/lib/data/members";
import { createClient } from "@/lib/supabase/server";

async function MembersContent({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const currentUserId = claims?.claims.sub ?? "";

  const [group, members, event] = await Promise.all([
    getGroupById(groupId),
    getMembersByGroupId(groupId),
    getUpcomingEventByGroupId(groupId),
  ]);

  const participants = event ? await getParticipantsByEventId(event.id) : [];
  const isOrganizer = group?.organizerId === currentUserId;

  return (
    <MembersView
      isOrganizer={isOrganizer}
      currentUserId={currentUserId}
      eventId={event?.id ?? null}
      initialMembers={members}
      initialParticipants={participants}
    />
  );
}

export default function MembersPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return (
    <Suspense fallback={<RouteLoading />}>
      <MembersContent params={params} />
    </Suspense>
  );
}
