"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
import { createClient } from "@/lib/supabase/client";

export function GroupCreateForm() {
  const [groupName, setGroupName] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventAt, setEventAt] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!groupName || !eventTitle || !eventAt || !location) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("create_group_with_event", {
        p_name: groupName,
        p_event_title: eventTitle,
        p_event_at: new Date(eventAt).toISOString(),
        p_location: location,
      });
      if (error) throw error;
      router.push(`/protected/groups/${data}`);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "모임 생성에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>모임 만들기</CardTitle>
        <CardDescription>
          그룹 이름과 첫 모임(회차) 정보를 함께 입력하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="groupName">그룹 이름</Label>
            <Input
              id="groupName"
              placeholder="예: 주말 수영 모임"
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="eventTitle">첫 모임 제목</Label>
            <Input
              id="eventTitle"
              placeholder="예: 8월 첫째주 수영"
              required
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="eventAt">일시</Label>
            <Input
              id="eventAt"
              type="datetime-local"
              required
              value={eventAt}
              onChange={(e) => setEventAt(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">장소</Label>
            <Input
              id="location"
              placeholder="예: 올림픽수영장"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          {error && <ErrorMessage message={error} />}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "만드는 중..." : "모임 만들기"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
