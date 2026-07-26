import { Suspense } from "react";

import { AnnouncementsView } from "@/components/announcements-view";
import { RouteLoading } from "@/components/route-loading";
import { getAnnouncementsByGroupId } from "@/lib/data/announcements";

async function AnnouncementsContent({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const announcements = await getAnnouncementsByGroupId(groupId);

  return (
    <AnnouncementsView groupId={groupId} initialAnnouncements={announcements} />
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
