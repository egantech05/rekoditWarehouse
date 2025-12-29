import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { AppState } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [warehouseSelection, setWarehouseSelection] = useState(null);
  const [warehouseSelectionLoaded, setWarehouseSelectionLoaded] = useState(false);
  


  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, full_name, created_at")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    setProfile(data ?? null);
  }, []);

  useEffect(() => {
    let ignore = false;

    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.warn("getSession error:", error);
    
        if (ignore) return;
    
        const nextSession = data?.session ?? null;
        setSession(nextSession);
    
        try {
          await fetchProfile(nextSession?.user?.id);
        } catch (e) {
          console.warn("fetchProfile failed:", e);
        }
      } catch (e) {
        if (!ignore) {
          console.warn("getSession failed:", e);
          setSession(null);
          setProfile(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      if (event === "TOKEN_REFRESH_FAILED") {
        console.warn("TOKEN_REFRESH_FAILED");
        return;
      }
    
      setSession(nextSession ?? null);
      try {
        await fetchProfile(nextSession?.user?.id);
      } catch (e) {
        console.warn("fetchProfile failed:", e);
      }
    });

    return () => {
      ignore = true;
      listener?.subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  useEffect(() => {
    let ignore = false;
  
    const refreshOnResume = async () => {
      try {
        const { data, error } = await supabase.auth.refreshSession();
        if (ignore) return;
        if (error) throw error;
  
        if (data?.session) {
          setSession(data.session);
          try {
            await fetchProfile(data.session.user?.id);
          } catch (e) {
            console.warn("fetchProfile failed:", e);
          }
        }
      } catch (e) {
        console.warn("refreshSession failed:", e);
      }
    };
  
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") refreshOnResume();
    });
  
    const onVisible = () => {
      if (document.visibilityState === "visible") refreshOnResume();
    };
  
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      window.addEventListener("focus", refreshOnResume);
      document.addEventListener("visibilitychange", onVisible);
    }
  
    return () => {
      ignore = true;
      sub.remove();
      if (typeof window !== "undefined" && typeof document !== "undefined") {
        window.removeEventListener("focus", refreshOnResume);
        document.removeEventListener("visibilitychange", onVisible);
      }
    };
  }, [fetchProfile]);
  

  useEffect(() => {
    let ignore = false;
  
    const loadWarehouseSelection = async () => {
      setWarehouseSelectionLoaded(false);
  
      const userId = session?.user?.id;
      if (!userId) {
        setWarehouseSelection(null);
        setWarehouseSelectionLoaded(true);
        return;
      }
  
      try {
        const raw = await AsyncStorage.getItem(`warehouseSelection:${userId}`);
        if (ignore) return;
        setWarehouseSelection(raw ? JSON.parse(raw) : null);
      } catch (e) {
        if (!ignore) setWarehouseSelection(null);
      } finally {
        if (!ignore) setWarehouseSelectionLoaded(true);
      }
    };
  
    loadWarehouseSelection();
    return () => {
      ignore = true;
    };
  }, [session?.user?.id]);
  
  useEffect(() => {
    if (!warehouseSelectionLoaded) return;
  
    const userId = session?.user?.id;
    if (!userId) return;
  
    const key = `warehouseSelection:${userId}`;
  
    if (warehouseSelection?.id) {
      AsyncStorage.setItem(key, JSON.stringify(warehouseSelection)).catch(() => {});
    } else {
      AsyncStorage.removeItem(key).catch(() => {});
    }
  }, [warehouseSelectionLoaded, session?.user?.id, warehouseSelection]);
  

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const signUp = useCallback(async (fullName, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    return data;
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      isLoggedIn: !!session?.user,
      loading,
      signIn,
      signUp,
      logout,
      warehouseSelection,
      setWarehouseSelection,
      warehouseSelectionLoaded,
    }),
    [session, profile, loading, signIn, signUp, logout, warehouseSelection, warehouseSelectionLoaded]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
