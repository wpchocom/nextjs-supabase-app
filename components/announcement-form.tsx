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
import type { Announcement } from "@/lib/types/domain";

const WHOLE_GROUP_VALUE = "whole-group";

const DUMMY_EVENT_OPTIONS = [{ id: "evt-demo-1", title: "다가오는 회차" }];

export function AnnouncementForm({
  groupId,
  onCreate,
}: {
  groupId: string;
  onCreate: (announcement: Announcement) => void;
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
      await new Promise((resolve) => setTimeout(resolve, 400));
      onCreate({
        id: `local-${Date.now()}`,
        groupId,
        eventId: eventId === WHOLE_GROUP_VALUE ? null : eventId,
        authorId: "user-1",
        title,
        content,
        createdAt: new Date().toISOString(),
      });
      setTitle("");
      setContent("");
      setEventId(WHOLE_GROUP_VALUE);
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
                {DUMMY_EVENT_OPTIONS.map((event) => (
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
