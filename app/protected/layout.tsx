import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col">
      <nav className="flex h-16 items-center justify-between gap-2 border-b border-b-foreground/10 p-3 px-5 text-sm">
        <Link href={"/"} className="shrink-0 font-semibold">
          모임 이벤트관리
        </Link>
        <div className="flex items-center gap-1">
          {!hasEnvVars && <EnvVarWarning />}
          <ThemeSwitcher />
        </div>
      </nav>
      <div className="flex flex-1 flex-col gap-8 p-5">{children}</div>
    </main>
  );
}
