import { createClient } from "@/lib/supabase/server";
import type { GroupMember } from "@/lib/types/domain";

export interface MemberWithProfile extends GroupMember {
  displayName: string;
  avatarUrl: string | null;
}

function mapMember(row: {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  status: string;
  created_at: string;
  profiles: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}): MemberWithProfile {
  return {
    id: row.id,
    groupId: row.group_id,
    userId: row.user_id,
    role: row.role as GroupMember["role"],
    status: row.status as GroupMember["status"],
    createdAt: row.created_at,
    displayName:
      row.profiles?.full_name || row.profiles?.username || "알 수 없음",
    avatarUrl: row.profiles?.avatar_url ?? null,
  };
}

export async function getMembersByGroupId(
  groupId: string,
): Promise<MemberWithProfile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("group_members")
    .select("*, profiles(username, full_name, avatar_url)")
    .eq("group_id", groupId)
    .eq("status", "active")
    .order("created_at", { ascending: true });

  return (data ?? []).map(mapMember);
}
