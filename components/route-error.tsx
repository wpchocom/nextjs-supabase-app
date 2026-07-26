"use client";

import { Button } from "@/components/ui/button";

export function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-3 py-10">
      <p className="text-sm text-destructive">
        문제가 발생했습니다: {error.message}
      </p>
      <Button variant="outline" onClick={() => reset()}>
        다시 시도
      </Button>
    </div>
  );
}
