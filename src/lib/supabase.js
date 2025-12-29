import "react-native-url-polyfill/auto";


import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";



const FETCH_TIMEOUT_MS = 15000;

function fetchWithTimeout(url, options = {}) {
  const start = Date.now();

  const timeoutPromise = new Promise((_, reject) => {
    const tick = () => {
      if (Date.now() - start >= FETCH_TIMEOUT_MS) {
        reject(new Error("Request timed out"));
        return;
      }

      if (typeof requestAnimationFrame !== "undefined") requestAnimationFrame(tick);
      else setTimeout(tick, 250);
    };

    tick();
  });

  return Promise.race([fetch(url, options), timeoutPromise]);
}


export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: { storage: AsyncStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    global: { fetch: fetchWithTimeout },
  }
);