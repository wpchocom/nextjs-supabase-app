import { Suspense } from "react";
import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { ProtectedTabs } from "@/components/protected-tabs";
import { RouteLoading } from "@/components/route-loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUpcomingEventsForUser } from "@/lib/data/events";

async function EventList() {
  const events = await getUpcomingEventsForUser();

  if (events.length === 0) {
    return (
      <EmptyState
        title="예정된 이벤트가 없습니다"
        description="그룹에 합류하거나 새 이벤트를 만들어보세요."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => (
        <Link key={event.id} href={`/protected/groups/${event.groupId}`}>
          <Card className="transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle className="text-base">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">{event.groupName}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(event.eventAt).toLocaleString("ko-KR")} ·{" "}
                {event.location}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function EventsPage() {
  return (
    <div className="flex flex-col gap-8 pb-20">
      <PageHeader
        title="이벤트"
        description="내가 속한 그룹의 다가오는 회차입니다."
      />

      <Suspense fallback={<RouteLoading />}>
        <EventList />
      </Suspense>

      <ProtectedTabs />
    </div>
  );
}
