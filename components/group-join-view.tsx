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
import { createClient } from "@/lib/supabase/client";
import type { Group } from "@/lib/types/domain";

export function GroupJoinView({
  group,
  inviteCode,
}: {
  group: Group | null;
  inviteCode: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!group) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>유효하지 않은 초대 코드</CardTitle>
          <CardDescription>
            {inviteCode} 코드로 그룹을 찾을 수 없습니다. 초대링크를 다시
            확인해주세요.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const handleJoin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("join_group_by_invite_code", {
        p_invite_code: inviteCode,
      });
      if (error) throw error;
      router.push(`/protected/groups/${data}`);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "합류에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{group.name}</CardTitle>
        <CardDescription>이 그룹에 합류하시겠어요?</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {error && <ErrorMessage message={error} />}
        <Button className="w-full" disabled={isLoading} onClick={handleJoin}>
          {isLoading ? "합류하는 중..." : "합류하기"}
        </Button>
      </CardContent>
    </Card>
  );
}
