import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { AppState } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { fetchWarehouses, fetchWarehouseRole } from "../lib/api/warehouses";
import { fetchItems } from "../lib/api/items";
import { fetchTemplates } from "../lib/api/templates";


const REQUEST_TIMEOUT_MS = 15000;

function withTimeout(promise, ms, label) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [warehouseSelection, setWarehouseSelection] = useState(null);
  const [warehouseSelectionLoaded, setWarehouseSelectionLoaded] = useState(false);

  const [warehouses, setWarehouses] = useState([]);
const [warehousesLoading, setWarehousesLoading] = useState(false);
const [warehousesError, setWarehousesError] = useState("");

const [items, setItems] = useState([]);
const [itemsLoading, setItemsLoading] = useState(false);
const [itemsError, setItemsError] = useState("");

const [templates, setTemplates] = useState([]);
const [templatesLoading, setTemplatesLoading] = useState(false);
const [templatesError, setTemplatesError] = useState("");

const [teamMembers, setTeamMembers] = useState([]);
const [teamMembersLoading, setTeamMembersLoading] = useState(false);
const [teamMembersError, setTeamMembersError] = useState("");

const [currentWarehouseRole, setCurrentWarehouseRole] = useState(null);

const currentWarehouse = useMemo(() => {
  if (!warehouseSelectionLoaded) return null;
  if (!Array.isArray(warehouses) || warehouses.length === 0) return null;
  return warehouses.find((w) => w.id === warehouseSelection?.id) ?? warehouses[0];
}, [warehouseSelectionLoaded, warehouses, warehouseSelection?.id]);

const isAdmin = currentWarehouseRole === "admin";

const fetchTeamMembers = useCallback(async (warehouseId, userId) => {
  const { data: memberRows, error } = await withTimeout(
    supabase
      .from("warehouse_members")
      .select("user_id, role")
      .eq("warehouse_id", warehouseId),
    REQUEST_TIMEOUT_MS,
    "fetchTeamMembers"
  );

  if (error) throw error;

  const rows = (memberRows ?? []).filter((r) => r?.user_id && r.user_id !== userId);
  const userIds = [...new Set(rows.map((r) => r?.user_id).filter(Boolean))];

  let profilesById = {};
  if (userIds.length) {
    const { data: profiles, error: profileError } = await withTimeout(
      supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", userIds),
      REQUEST_TIMEOUT_MS,
      "fetchTeamMemberProfiles"
    );

    if (!profileError) {
      profilesById = Object.fromEntries((profiles ?? []).map((p) => [p.user_id, p]));
    }
  }

  return rows.map((m) => ({
    ...m,
    full_name: profilesById[m.user_id]?.full_name ?? "",
    email: profilesById[m.user_id]?.email ?? "",
  }));
}, []);

const loadWarehouses = useCallback(async () => {
  if (!session?.user?.id) {
    setWarehouses([]);
    setWarehousesLoading(false);
    return [];
  }

  setWarehousesLoading(true);
  setWarehousesError("");
  try {
    const data = await fetchWarehouses();
    const next = data ?? [];
    setWarehouses(next);
    return next;
  } catch (e) {
    setWarehousesError(e?.message ?? "Failed to load warehouses.");
    setWarehouses([]);
    return [];
  } finally {
    setWarehousesLoading(false);
  }
}, [session?.user?.id]);

const loadCurrentWarehouseData = useCallback(
  async (warehouseId, userId) => {
    if (!warehouseId || !userId) {
      setItems([]);
      setTemplates([]);
      setTeamMembers([]);
      setCurrentWarehouseRole(null);
      setItemsLoading(false);
      setTemplatesLoading(false);
      setTeamMembersLoading(false);
      return;
    }

    setItemsLoading(true);
    setTemplatesLoading(true);
    setTeamMembersLoading(true);
    setItemsError("");
    setTemplatesError("");
    setTeamMembersError("");

    const [itemsResult, templatesResult, roleResult, membersResult] = await Promise.allSettled([
      fetchItems({ warehouseId }),
      fetchTemplates({ warehouseId }),
      fetchWarehouseRole({ warehouseId, userId }),
      fetchTeamMembers(warehouseId, userId),
    ]);

    if (itemsResult.status === "fulfilled") {
      setItems(itemsResult.value ?? []);
    } else {
      setItemsError(itemsResult.reason?.message ?? "Failed to load items.");
      setItems([]);
    }

    if (templatesResult.status === "fulfilled") {
      setTemplates(templatesResult.value ?? []);
    } else {
      setTemplatesError(templatesResult.reason?.message ?? "Failed to load templates.");
      setTemplates([]);
    }

    if (roleResult.status === "fulfilled") {
      setCurrentWarehouseRole(roleResult.value ?? null);
    } else {
      setCurrentWarehouseRole(null);
    }

    if (membersResult.status === "fulfilled") {
      setTeamMembers(membersResult.value ?? []);
    } else {
      setTeamMembersError(membersResult.reason?.message ?? "Failed to load team.");
      setTeamMembers([]);
    }

    setItemsLoading(false);
    setTemplatesLoading(false);
    setTeamMembersLoading(false);
  },
  [fetchTeamMembers]
);

const reloadWarehouses = useCallback(() => loadWarehouses(), [loadWarehouses]);

const reloadCurrentWarehouseData = useCallback(() => {
  if (!currentWarehouse?.id || !session?.user?.id) return Promise.resolve();
  return loadCurrentWarehouseData(currentWarehouse.id, session.user.id);
}, [currentWarehouse?.id, session?.user?.id, loadCurrentWarehouseData]);



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
        setSession(null);
        setProfile(null);
        try {
          await supabase.auth.signOut({ scope: "local" });
        } catch (e) {
          console.warn("local signOut failed:", e);
        }
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
            await reloadWarehouses();
            await reloadCurrentWarehouseData();
          } catch (e) {
            console.warn("fetchProfile failed:", e);
          }
        }
      } catch (e) {
        console.warn("refreshSession failed:", e);
      } finally {

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
  }, [fetchProfile, reloadWarehouses, reloadCurrentWarehouseData]);

  

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
    if (!session?.user?.id) {
      setWarehouses([]);
      setItems([]);
      setTemplates([]);
      setTeamMembers([]);
      setCurrentWarehouseRole(null);
      return;
    }
  
    loadWarehouses();
  }, [session?.user?.id, loadWarehouses]);
  
  useEffect(() => {
    if (!warehouseSelectionLoaded) return;
  
    if (!warehouses.length) {
      if (warehouseSelection?.id) setWarehouseSelection(null);
      return;
    }
  
    const selectedId = warehouseSelection?.id;
    if (!selectedId || !warehouses.find((w) => w.id === selectedId)) {
      setWarehouseSelection(warehouses[0]);
    }
  }, [warehouseSelectionLoaded, warehouses, warehouseSelection?.id, setWarehouseSelection]);
  
  useEffect(() => {
    if (!currentWarehouse?.id || !session?.user?.id) {
      setItems([]);
      setTemplates([]);
      setTeamMembers([]);
      setCurrentWarehouseRole(null);
      return;
    }
  
    loadCurrentWarehouseData(currentWarehouse.id, session.user.id);
  }, [currentWarehouse?.id, session?.user?.id, loadCurrentWarehouseData]);
  
  useEffect(() => {
    if (!session?.user?.id) return;
  
    const channel = supabase
      .channel(`realtime:global:${session.user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "warehouses" },
        () => loadWarehouses()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "warehouse_members", filter: `user_id=eq.${session.user.id}` },
        () => loadWarehouses()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => fetchProfile(session.user.id)
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, loadWarehouses, fetchProfile]);
  
  useEffect(() => {
    if (!currentWarehouse?.id || !session?.user?.id) return;
  
    const reload = () => loadCurrentWarehouseData(currentWarehouse.id, session.user.id);
  
    const channel = supabase
      .channel(`realtime:warehouse:${currentWarehouse.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items", filter: `warehouse_id=eq.${currentWarehouse.id}` },
        reload
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "templates", filter: `warehouse_id=eq.${currentWarehouse.id}` },
        reload
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "warehouse_members", filter: `warehouse_id=eq.${currentWarehouse.id}` },
        reload
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "item_events", filter: `warehouse_id=eq.${currentWarehouse.id}` },
        reload
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        reload
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentWarehouse?.id, session?.user?.id, loadCurrentWarehouseData]);
  
  
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
      warehouses,
      warehousesLoading,
      warehousesError,
      reloadWarehouses,
      currentWarehouse,
      isAdmin,
      items,
      itemsLoading,
      itemsError,
      templates,
      templatesLoading,
      templatesError,
      teamMembers,
      teamMembersLoading,
      teamMembersError,
      reloadCurrentWarehouseData,
      setItems,
      setTemplates,
      setTeamMembers,

    }),
    [session, profile, loading, signIn, signUp, logout, warehouseSelection, warehouseSelectionLoaded, warehouses, warehousesLoading, warehousesError, reloadWarehouses, currentWarehouse, isAdmin, items, itemsLoading, itemsError, templates, templatesLoading, templatesError, teamMembers, teamMembersLoading, teamMembersError, reloadCurrentWarehouseData]


  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
