import { Suspense } from "react";

import { MembersView } from "@/components/members-view";
import { RouteLoading } from "@/components/route-loading";
import { getParticipantsByEventId } from "@/lib/data/event-participants";
import { getGroupById } from "@/lib/data/groups";
import { getMembersByGroupId } from "@/lib/data/members";
import { createClient } from "@/lib/supabase/server";

async function MembersContent({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const dummyEventId = `${groupId}-evt-1`;

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const currentUserId = claims?.claims.sub;

  const [group, members, participants] = await Promise.all([
    getGroupById(groupId),
    getMembersByGroupId(groupId),
    getParticipantsByEventId(dummyEventId, groupId),
  ]);

  const isOrganizer = group?.organizerId === currentUserId;

  return (
    <MembersView
      isOrganizer={isOrganizer}
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
