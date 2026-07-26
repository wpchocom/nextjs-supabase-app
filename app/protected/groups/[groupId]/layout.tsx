import { Suspense } from "react";
import { redirect } from "next/navigation";

import { GroupTabs } from "@/components/group-tabs";
import { RouteLoading } from "@/components/route-loading";
import { getGroupById } from "@/lib/data/groups";

async function GroupHeader({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const group = await getGroupById(groupId);

  if (!group) {
    redirect("/protected");
  }

  return (
    <>
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">그룹</p>
        <h1 className="text-2xl font-bold">{group.name}</h1>
      </header>
      <GroupTabs groupId={groupId} />
    </>
  );
}

export default function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ groupId: string }>;
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      <Suspense fallback={<RouteLoading />}>
        <GroupHeader params={params} />
      </Suspense>
      <div className="flex-1 pb-20">{children}</div>
    </div>
  );
}
