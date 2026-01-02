import { supabase } from "../supabase";

export async function fetchProfilesByUserIds(userIds, accessToken) {
  const ids = Array.isArray(userIds) ? userIds.filter(Boolean) : [];
  if (!ids.length) return [];

  if (!accessToken) {
    throw new Error("Missing access token.");
  }

  const url = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/profiles?select=user_id,full_name&user_id=in.(${ids.join(",")})`;
  const resp = await fetch(url, {
    headers: {
      apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const bodyText = await resp.text();
  if (!resp.ok) {
    throw new Error(`fetchProfilesByUserIds ${resp.status}`);
  }

  return bodyText ? JSON.parse(bodyText) : [];
}
