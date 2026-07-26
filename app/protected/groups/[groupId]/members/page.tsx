import { Suspense } from "react";

import { MembersView } from "@/components/members-view";
import { RouteLoading } from "@/components/route-loading";
import { getParticipantsByEventId } from "@/lib/data/event-participants";
import { getMembersByGroupId } from "@/lib/data/members";

async function MembersContent({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const dummyEventId = `${groupId}-evt-1`;

  const [members, participants] = await Promise.all([
    getMembersByGroupId(groupId),
    getParticipantsByEventId(dummyEventId, groupId),
  ]);

  return (
    <MembersView initialMembers={members} initialParticipants={participants} />
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
