const buildRestQuery = (params = {}) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      search.set(key, String(value));
    });
    const qs = search.toString();
    return qs ? `?${qs}` : "";
  };
  
  export async function publicRestRequest({ method = "GET", path, params, body, signal, preferReturn = false, headers = {} }) {
    const url = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/${path}${buildRestQuery(params)}`;
  
    const requestHeaders = {
      apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
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
  
  export const PUBLIC_ITEM_HISTORY_PAGE_SIZE = 50;
  
  export async function fetchPublicItemByToken({ publicToken }) {
    if (!publicToken) return null;
  
    const rows = await publicRestRequest({
      method: "POST",
      path: "rpc/get_public_item_by_token",
      body: {
        p_public_token: publicToken,
      },
    });
  
    const row = Array.isArray(rows) ? rows[0] ?? null : rows ?? null;
    if (!row) return null;

    if (row.template_properties && !row.templates) {
      const { template_properties, ...rest } = row;
      return { ...rest, templates: { template_properties } };
    }
    

    return row;

  }
  
  export async function fetchPublicItemHistoryByToken({ publicToken, from = 0, to = PUBLIC_ITEM_HISTORY_PAGE_SIZE - 1 }) {
    if (!publicToken) return { events: [], nextFrom: from };
    const limit = Math.max(0, to - from + 1);
  
    const data = await publicRestRequest({
      method: "POST",
      path: "rpc/get_public_item_history_by_token",
      body: {
        p_public_token: publicToken,
        p_limit: limit,
        p_offset: from,
      },
    });
  
    const events = Array.isArray(data) ? data : [];
    return { events, nextFrom: from + events.length };
  }
  