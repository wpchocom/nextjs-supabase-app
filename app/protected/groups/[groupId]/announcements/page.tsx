import { Suspense } from "react";

import { AnnouncementsView } from "@/components/announcements-view";
import { RouteLoading } from "@/components/route-loading";
import { getAnnouncementsByGroupId } from "@/lib/data/announcements";
import { getEventsByGroupId } from "@/lib/data/events";
import { getGroupById } from "@/lib/data/groups";
import { createClient } from "@/lib/supabase/server";

async function AnnouncementsContent({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const currentUserId = claims?.claims.sub;

  const [group, announcements, events] = await Promise.all([
    getGroupById(groupId),
    getAnnouncementsByGroupId(groupId),
    getEventsByGroupId(groupId),
  ]);

  const isOrganizer = group?.organizerId === currentUserId;

  return (
    <AnnouncementsView
      groupId={groupId}
      initialAnnouncements={announcements}
      events={events}
      isOrganizer={isOrganizer}
    />
  );
}

export default function AnnouncementsPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return (
    <Suspense fallback={<RouteLoading />}>
      <AnnouncementsContent params={params} />
    </Suspense>
  );
}
