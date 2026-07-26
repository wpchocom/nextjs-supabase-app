"use client";

import { useState } from "react";

import { AnnouncementForm } from "@/components/announcement-form";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Announcement } from "@/lib/types/domain";

const DUMMY_AUTHOR_NAME = "김주최";

export function AnnouncementsView({
  groupId,
  initialAnnouncements,
}: {
  groupId: string;
  initialAnnouncements: Announcement[];
}) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [isOrganizerView, setIsOrganizerView] = useState(true);

  const handleCreate = (announcement: Announcement) => {
    setAnnouncements((prev) => [announcement, ...prev]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsOrganizerView((prev) => !prev)}
        >
          {isOrganizerView ? "참여자로 보기" : "주최자로 보기"}
        </Button>
      </div>

      {isOrganizerView && (
        <AnnouncementForm groupId={groupId} onCreate={handleCreate} />
      )}

      {announcements.length === 0 ? (
        <EmptyState
          title="아직 공지가 없습니다"
          description={
            isOrganizerView
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
                  {DUMMY_AUTHOR_NAME} ·{" "}
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
