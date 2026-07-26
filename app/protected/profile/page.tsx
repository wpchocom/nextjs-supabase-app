import { Suspense } from "react";

import { LogoutButton } from "@/components/logout-button";
import { PageHeader } from "@/components/page-header";
import { ProtectedTabs } from "@/components/protected-tabs";
import { RouteLoading } from "@/components/route-loading";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

async function ProfileContent() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-6">
        <p className="text-sm text-muted-foreground">{user?.email}</p>
        <LogoutButton />
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8 pb-20">
      <PageHeader title="프로필" />
      <Suspense fallback={<RouteLoading />}>
        <ProfileContent />
      </Suspense>
      <ProtectedTabs />
    </div>
  );
}
