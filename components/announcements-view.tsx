"use client";

import { useState } from "react";

import { AnnouncementForm } from "@/components/announcement-form";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnnouncementWithAuthor } from "@/lib/data/announcements";
import type { Event } from "@/lib/types/domain";

export function AnnouncementsView({
  groupId,
  initialAnnouncements,
  events,
  isOrganizer,
}: {
  groupId: string;
  initialAnnouncements: AnnouncementWithAuthor[];
  events: Event[];
  isOrganizer: boolean;
}) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  const handleCreate = (announcement: AnnouncementWithAuthor) => {
    setAnnouncements((prev) => [announcement, ...prev]);
  };

  return (
    <div className="flex flex-col gap-6">
      {isOrganizer && (
        <AnnouncementForm
          groupId={groupId}
          events={events}
          onCreate={handleCreate}
        />
      )}

      {announcements.length === 0 ? (
        <EmptyState
          title="아직 공지가 없습니다"
          description={
            isOrganizer
              ? "위 폼으로 첫 공지를 작성해보세요."
              : "주최자가 공지를 등록하면 이곳에 표시됩니다."
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  {announcement.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {announcement.authorName} ·{" "}
                  {new Date(announcement.createdAt).toLocaleString("ko-KR")}
                </p>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">
                  {announcement.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
