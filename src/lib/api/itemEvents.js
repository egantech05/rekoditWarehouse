import { supabase } from "../supabase";

export async function fetchItemEvents({ itemId, warehouseId, startISO, endISO }) {
  let q = supabase
    .from("item_events")
    .select("id, delta, event_type, note, actor_id, created_at")
    .eq("item_id", itemId);

  if (warehouseId) q = q.eq("warehouse_id", warehouseId);
  if (startISO) q = q.gte("created_at", startISO);
  if (endISO) q = q.lte("created_at", endISO);

  q = q.order("created_at", { ascending: false });

  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}