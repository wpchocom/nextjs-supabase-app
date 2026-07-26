import { createClient } from "@/lib/supabase/server";
import type { Group } from "@/lib/types/domain";

function mapGroup(row: {
  id: string;
  name: string;
  invite_code: string;
  organizer_id: string;
  created_at: string;
}): Group {
  return {
    id: row.id,
    name: row.name,
    inviteCode: row.invite_code,
    organizerId: row.organizer_id,
    createdAt: row.created_at,
  };
}

export async function getMyGroups(): Promise<Group[]> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;
  if (!userId) return [];

  const { data } = await supabase
    .from("group_members")
    .select("groups(*)")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (data ?? [])
    .map((row) => row.groups)
    .filter((group): group is NonNullable<typeof group> => group !== null)
    .map(mapGroup);
}

export async function getGroupById(id: string): Promise<Group | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("groups")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return data ? mapGroup(data) : null;
}

export async function getGroupByInviteCode(
  inviteCode: string,
): Promise<Group | null> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_group_by_invite_code", {
    p_invite_code: inviteCode,
  });

  const row = data?.[0];
  return row ? mapGroup(row) : null;
}
