import { Suspense } from "react";

import { GroupJoinView } from "@/components/group-join-view";
import { RouteLoading } from "@/components/route-loading";
import { getGroupByInviteCode } from "@/lib/data/groups";

async function JoinGroupContent({
  params,
}: {
  params: Promise<{ inviteCode: string }>;
}) {
  const { inviteCode } = await params;
  const group = await getGroupByInviteCode(inviteCode);

  return <GroupJoinView group={group} inviteCode={inviteCode} />;
}

export default function JoinGroupPage({
  params,
}: {
  params: Promise<{ inviteCode: string }>;
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-10">
      <Suspense fallback={<RouteLoading />}>
        <JoinGroupContent params={params} />
      </Suspense>
    </div>
  );
}
