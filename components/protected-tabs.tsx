"use client";

import { Calendar, Home, Plus, User } from "lucide-react";
import { usePathname } from "next/navigation";

import { BottomTabBar } from "@/components/bottom-tab-bar";

const TABS = [
  { href: "/protected", label: "홈", icon: Home },
  { href: "/protected/events", label: "이벤트", icon: Calendar },
  { href: "/protected/groups/new", label: "새 이벤트", icon: Plus },
  { href: "/protected/profile", label: "프로필", icon: User },
] as const;

export function ProtectedTabs() {
  const pathname = usePathname();

  return <BottomTabBar tabs={TABS} isActive={(href) => pathname === href} />;
}
