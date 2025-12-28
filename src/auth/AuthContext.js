import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

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
      const { data, error } = await supabase.auth.getSession();
      if (error) console.warn("getSession error:", error);

      if (!ignore) {
        const nextSession = data?.session ?? null;
        setSession(nextSession);
        await fetchProfile(nextSession?.user?.id);
        setLoading(false);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession ?? null);
      await fetchProfile(nextSession?.user?.id);
    });

    return () => {
      ignore = true;
      listener?.subscription?.unsubscribe();
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
