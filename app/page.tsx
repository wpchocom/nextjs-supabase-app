import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

async function HeroCta() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  return (
    <Button asChild size="lg">
      <Link href={data?.claims ? "/protected" : "/auth/login"}>
        {data?.claims ? "내 그룹으로 이동" : "시작하기"}
      </Link>
    </Button>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col">
      <nav className="flex h-16 items-center justify-between gap-2 border-b border-b-foreground/10 p-3 px-5 text-sm">
        <Link href={"/"} className="shrink-0 font-semibold">
          모임 이벤트관리
        </Link>
        <div className="flex items-center gap-1">
          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <Suspense>
              <AuthButton />
            </Suspense>
          )}
          <ThemeSwitcher />
        </div>
      </nav>
      <div className="flex flex-1 flex-col items-center gap-6 p-5 text-center">
        <h1 className="text-3xl font-bold">
          소모임 운영, 공지·참석·정산·카풀까지 한 곳에서
        </h1>
        <p className="text-muted-foreground">
          카카오톡 대화방과 수기 계산으로 흩어져 있던 소모임 운영을 하나의 웹
          서비스로 옮겨보세요.
        </p>
        {hasEnvVars ? (
          <Suspense>
            <HeroCta />
          </Suspense>
        ) : (
          <Button asChild size="lg">
            <Link href="/auth/login">시작하기</Link>
          </Button>
        )}
      </div>
    </main>
  );
}
