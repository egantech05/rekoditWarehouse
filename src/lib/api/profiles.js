import { supabase } from "../supabase";

export async function fetchProfilesByUserIds(userIds) {
  const ids = Array.isArray(userIds) ? userIds.filter(Boolean) : [];
  if (!ids.length) return [];

  const { data, error } = await supabase.from("profiles").select("user_id, full_name").in("user_id", ids);
  if (error) throw error;
  return data ?? [];
}