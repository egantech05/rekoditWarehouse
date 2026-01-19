import "react-native-url-polyfill/auto";


import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";





let refreshSessionInFlight = null;
let cachedSession = null;

export function setCachedSession(session) {
  cachedSession = session ?? null;
}

async function fetchWithTimeout(url, options = {}) {
  const method = options?.method ?? "GET";
  const start = Date.now();

  console.log("[supabase fetch] start", { method, url });

  try {
    const resp = await fetch(url, options);
    console.log("[supabase fetch] done", {
      method,
      url,
      status: resp.status,
      ms: Date.now() - start,
    });
    return resp;
  } catch (e) {
    console.log("[supabase fetch] error", {
      method,
      url,
      ms: Date.now() - start,
      error: String(e?.message ?? e),
    });
    throw e;
  }
}





export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: { storage: AsyncStorage, persistSession: true, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: fetchWithTimeout },
  }
);

export function refreshSessionOrThrow() {
  if (!cachedSession?.user) return;

  if (!refreshSessionInFlight) {
    refreshSessionInFlight = supabase.auth
      .refreshSession()
      .then(({ error: refreshError }) => {
        if (refreshError) throw refreshError;
      })
      .catch(() => {})
      .finally(() => {
        refreshSessionInFlight = null;
      });
  }
}

function buildRestQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function restFirst(rows) {
  if (Array.isArray(rows)) return rows[0] ?? null;
  return rows ?? null;
}

export async function restRequest({ method = "GET", path, params, body, signal, preferReturn = false, headers = {} }) {

  let accessToken = cachedSession?.access_token;

  if (!accessToken) {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    const nextSession = sessionData?.session ?? null;
    if (nextSession) setCachedSession(nextSession);
    accessToken = nextSession?.access_token;
  }

  if (!accessToken) throw new Error("Missing access token.");


  const url = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/${path}${buildRestQuery(params)}`;

  const requestHeaders = {
    apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    Authorization: `Bearer ${accessToken}`,
    ...headers,
  };

  if (preferReturn) requestHeaders.Prefer = "return=representation";
  if (body !== undefined) requestHeaders["Content-Type"] = "application/json";

  const resp = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  const text = await resp.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!resp.ok) {
    const message = data?.message ?? data?.error ?? data?.details ?? `Request failed (${resp.status})`;
    const err = new Error(message);
    err.status = resp.status;
    err.payload = data;
    throw err;
  }

  return data;
}

