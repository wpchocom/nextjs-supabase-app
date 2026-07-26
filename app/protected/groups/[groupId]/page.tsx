import { Suspense } from "react";
import Link from "next/link";

import { CopyInviteLinkButton } from "@/components/copy-invite-link-button";
import { RouteLoading } from "@/components/route-loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUpcomingEventByGroupId } from "@/lib/data/events";
import { getGroupById } from "@/lib/data/groups";
import { createClient } from "@/lib/supabase/server";

const FEATURES = [
  {
    slug: "announcements",
    label: "공지사항",
    description: "그룹 공지 확인 및 작성",
  },
  {
    slug: "members",
    label: "참여자관리",
    description: "멤버 로스터와 RSVP",
  },
  {
    slug: "settlements",
    label: "정산관리",
    description: "지출 등록과 분담액",
  },
  { slug: "carpools", label: "카풀매칭", description: "차량 등록과 배정" },
] as const;

async function GroupHomeContent({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const currentUserId = claims?.claims.sub;

  const group = await getGroupById(groupId);
  const upcomingEvent = await getUpcomingEventByGroupId(groupId);
  const isOrganizer = group?.organizerId === currentUserId;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>다가오는 회차</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {upcomingEvent ? (
            <>
              <p className="font-medium">{upcomingEvent.title}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(upcomingEvent.eventAt).toLocaleString("ko-KR")} ·{" "}
                {upcomingEvent.location}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              예정된 회차가 없습니다.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        {FEATURES.map((feature) => (
          <Link
            key={feature.slug}
            href={`/protected/groups/${groupId}/${feature.slug}`}
          >
            <Card className="h-full transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle className="text-base">{feature.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {isOrganizer && group && (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted-foreground">
            초대 코드: {group.inviteCode}
          </p>
          <CopyInviteLinkButton
            inviteUrl={`/protected/groups/join/${group.inviteCode}`}
          />
        </div>
      )}
    </div>
  );
}

export default function GroupHomePage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return (
    <Suspense fallback={<RouteLoading />}>
      <GroupHomeContent params={params} />
    </Suspense>
  );
}
