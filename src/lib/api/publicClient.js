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
  