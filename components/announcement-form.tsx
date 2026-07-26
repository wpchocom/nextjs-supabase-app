"use client";

import { useState } from "react";

import { ErrorMessage } from "@/components/error-message";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { AnnouncementWithAuthor } from "@/lib/data/announcements";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/lib/types/domain";

const WHOLE_GROUP_VALUE = "whole-group";

export function AnnouncementForm({
  groupId,
  events,
  onCreate,
}: {
  groupId: string;
  events: Event[];
  onCreate: (announcement: AnnouncementWithAuthor) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [eventId, setEventId] = useState(WHOLE_GROUP_VALUE);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !content) {
      setError("제목과 본문을 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("announcements")
        .insert({
          group_id: groupId,
          event_id: eventId === WHOLE_GROUP_VALUE ? null : eventId,
          title,
          content,
        })
        .select("*, profiles(username, full_name)")
        .single();
      if (error) throw error;

      onCreate({
        id: data.id,
        groupId: data.group_id,
        eventId: data.event_id,
        authorId: data.author_id,
        title: data.title,
        content: data.content,
        createdAt: data.created_at,
        authorName:
          data.profiles?.full_name || data.profiles?.username || "알 수 없음",
      });
      setTitle("");
      setContent("");
      setEventId(WHOLE_GROUP_VALUE);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "공지 등록에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>공지 작성</CardTitle>
        <CardDescription>그룹 멤버 전원에게 표시됩니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="announcementTitle">제목</Label>
            <Input
              id="announcementTitle"
              placeholder="예: 이번 주 모임 안내"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="announcementEvent">회차 연결</Label>
            <Select value={eventId} onValueChange={setEventId}>
              <SelectTrigger id="announcementEvent" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={WHOLE_GROUP_VALUE}>
                  그룹 전체 공지
                </SelectItem>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="announcementContent">본문</Label>
            <Textarea
              id="announcementContent"
              placeholder="공지 내용을 입력하세요"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          {error && <ErrorMessage message={error} />}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "등록하는 중..." : "공지 등록"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
