import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { ProtectedTabs } from "@/components/protected-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDummyEvents } from "@/lib/dummy/events";
import { getDummyGroupById } from "@/lib/dummy/groups";

export default function EventsPage() {
  const events = [...getDummyEvents()].sort(
    (a, b) => new Date(a.eventAt).getTime() - new Date(b.eventAt).getTime(),
  );

  return (
    <div className="flex flex-col gap-8 pb-20">
      <PageHeader
        title="이벤트"
        description="내가 속한 그룹의 다가오는 회차입니다."
      />

      {events.length === 0 ? (
        <EmptyState
          title="예정된 이벤트가 없습니다"
          description="그룹에 합류하거나 새 이벤트를 만들어보세요."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {events.map((event) => {
            const group = getDummyGroupById(event.groupId);

            return (
              <Link key={event.id} href={`/protected/groups/${event.groupId}`}>
                <Card className="transition-colors hover:bg-accent">
                  <CardHeader>
                    <CardTitle className="text-base">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">
                      {group?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.eventAt).toLocaleString("ko-KR")} ·{" "}
                      {event.location}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <ProtectedTabs />
    </div>
  );
}
