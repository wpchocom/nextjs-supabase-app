import { Suspense } from "react";
import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { ProtectedTabs } from "@/components/protected-tabs";
import { RouteLoading } from "@/components/route-loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUpcomingEventByGroupId } from "@/lib/data/events";
import { getMyGroups } from "@/lib/data/groups";
import { createClient } from "@/lib/supabase/server";

async function GroupList() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const currentUserId = claims?.claims.sub;

  const groups = await getMyGroups();

  if (groups.length === 0) {
    return (
      <EmptyState
        title="아직 참여 중인 그룹이 없습니다"
        description="모임을 새로 만들거나 초대링크로 그룹에 합류해보세요."
        action={
          <Button asChild>
            <Link href="/protected/groups/new">모임 만들기</Link>
          </Button>
        }
      />
    );
  }

  const upcomingEvents = await Promise.all(
    groups.map((group) => getUpcomingEventByGroupId(group.id)),
  );

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group, index) => {
        const isOrganizer = group.organizerId === currentUserId;
        const upcomingEvent = upcomingEvents[index];

        return (
          <Link key={group.id} href={`/protected/groups/${group.id}`}>
            <Card className="h-full transition-colors hover:bg-accent">
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <Badge variant={isOrganizer ? "default" : "secondary"}>
                  {isOrganizer ? "주최자" : "참여자"}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {upcomingEvent
                    ? `다가오는 회차: ${upcomingEvent.title}`
                    : "예정된 회차가 없습니다"}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <div className="flex w-full flex-1 flex-col gap-8 pb-20">
      <PageHeader
        title="내 그룹"
        action={
          <Button asChild>
            <Link href="/protected/groups/new">모임 만들기</Link>
          </Button>
        }
      />
      <Suspense fallback={<RouteLoading />}>
        <GroupList />
      </Suspense>
      <ProtectedTabs />
    </div>
  );
}
