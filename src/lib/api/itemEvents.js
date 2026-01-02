import { supabase } from "../supabase";




export async function fetchItemEvents({ itemId, warehouseId, startISO, endISO }, accessToken) {
  if (!itemId) return [];
  if (!accessToken) throw new Error("Missing access token.");

  const params = new URLSearchParams();
  params.set("select", "id,delta,event_type,note,actor_id,created_at");
  params.set("item_id", `eq.${itemId}`);
  if (warehouseId) params.set("warehouse_id", `eq.${warehouseId}`);
  if (startISO) params.set("created_at", `gte.${startISO}`);
  if (endISO) params.append("created_at", `lte.${endISO}`);
  params.set("order", "created_at.desc");
  params.set("limit", "50");

  const url = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/item_events?${params.toString()}`;

  const resp = await fetch(url, {
    headers: {
      apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const bodyText = await resp.text();
  if (!resp.ok) {
    throw new Error(`fetchItemEvents ${resp.status}`);
  }

  return bodyText ? JSON.parse(bodyText) : [];
}
