"use client";

import { Car, Megaphone, Users, Wallet } from "lucide-react";
import { usePathname } from "next/navigation";

import { BottomTabBar } from "@/components/bottom-tab-bar";

export function GroupTabs({ groupId }: { groupId: string }) {
  const pathname = usePathname();

  const tabs = [
    {
      href: `/protected/groups/${groupId}/announcements`,
      label: "공지사항",
      icon: Megaphone,
    },
    {
      href: `/protected/groups/${groupId}/members`,
      label: "참여자관리",
      icon: Users,
    },
    {
      href: `/protected/groups/${groupId}/settlements`,
      label: "정산관리",
      icon: Wallet,
    },
    {
      href: `/protected/groups/${groupId}/carpools`,
      label: "카풀매칭",
      icon: Car,
    },
  ];

  return (
    <BottomTabBar tabs={tabs} isActive={(href) => pathname.startsWith(href)} />
  );
}
