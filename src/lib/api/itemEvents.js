


export const ITEM_EVENTS_PAGE_SIZE = 50;


export async function fetchItemEvents(
  { itemId, warehouseId, startISO, endISO, from = 0, to = ITEM_EVENTS_PAGE_SIZE - 1 },
  accessToken
) {
  if (!itemId) return { events: [], nextFrom: from };
  if (!accessToken) throw new Error("Missing access token.");

  const params = new URLSearchParams();
  params.set("select", "id,delta,event_type,note,actor_id,created_at");
  params.set("item_id", `eq.${itemId}`);
  if (warehouseId) params.set("warehouse_id", `eq.${warehouseId}`);
  if (startISO) params.set("created_at", `gte.${startISO}`);
  if (endISO) params.append("created_at", `lte.${endISO}`);
  params.set("order", "created_at.desc");
  const limit = Math.max(0, to - from + 1);
  params.set("limit", String(limit));
  params.set("offset", String(from));

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

  const events = bodyText ? JSON.parse(bodyText) : [];
  return { events, nextFrom: from + events.length };
}
