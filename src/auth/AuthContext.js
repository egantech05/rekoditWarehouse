import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { supabase, setCachedSession, refreshSessionOrThrow, restRequest, restFirst } from "../lib/supabase";



import { AppState } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { fetchWarehouses, fetchWarehouseRole } from "../lib/api/warehouses";
import { fetchItemsPage, ITEMS_PAGE_SIZE } from "../lib/api/items";
import { fetchTemplatesPage, TEMPLATES_PAGE_SIZE } from "../lib/api/templates";
import { fetchTeamMembersPage, TEAM_MEMBERS_PAGE_SIZE } from "../lib/api/teamMembers";




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

const initialWarehouseLoadDoneRef = useRef(false);
const lastWarehouseIdRef = useRef(null);

const refreshSessionInFlightRef = useRef(false);
const lastRefreshAtRef = useRef(0);




const currentWarehouse = useMemo(() => {
  if (!warehouseSelectionLoaded) return null;
  if (!Array.isArray(warehouses) || warehouses.length === 0) return null;
  return warehouses.find((w) => w.id === warehouseSelection?.id) ?? null;

}, [warehouseSelectionLoaded, warehouses, warehouseSelection?.id]);

const isAdmin = currentWarehouseRole === "admin";



const loadWarehouses = useCallback(async () => {
  console.log("[auth][warehouses] loadWarehouses", { userId: session?.user?.id ?? null });

  if (!session?.user?.id) {
    setWarehouses([]);
    setWarehousesLoading(false);
    return [];
  }

  setWarehousesLoading(true);
  setWarehousesError("");
  try {

    
    console.log("[auth][warehouses] fetchWarehouses start");
    const data = await fetchWarehouses();
    console.log("[auth][warehouses] fetchWarehouses done", { count: data?.length ?? 0 });

    const next = data ?? [];
    setWarehouses(next);
    if (warehouseSelectionLoaded && !warehouseSelection?.id && next.length) {
      setWarehouseSelection(next[0]);
    }

    return next;
  } catch (e) {

    console.log("[auth][warehouses] fetchWarehouses error", { message: e?.message ?? String(e) });

 
    return [];
  } finally {
    setWarehousesLoading(false);
  }
}, [session?.user?.id, warehouseSelectionLoaded, warehouseSelection?.id, setWarehouseSelection]);


const loadCurrentWarehouseData = useCallback(
  async (warehouseId, userId, { silent = false } = {}) => {
    if (!warehouseId || !userId) {
      setItems([]);
      setTemplates([]);
      setTeamMembers([]);
      setCurrentWarehouseRole(null);
      setItemsLoading(false);
      setTemplatesLoading(false);
      setTeamMembersLoading(false);
      initialWarehouseLoadDoneRef.current = false;
      return;
    }

    const shouldShowLoading = !silent || !initialWarehouseLoadDoneRef.current;
    const shouldReportErrors = !silent || !initialWarehouseLoadDoneRef.current;

    if (shouldShowLoading) {
      setItemsLoading(true);
      setTemplatesLoading(true);
      setTeamMembersLoading(true);
    }
    if (shouldReportErrors) {
      setItemsError("");
      setTemplatesError("");
      setTeamMembersError("");
    }

    let pending = 4;
    const markDone = () => {
      pending -= 1;
      if (pending === 0) {
        initialWarehouseLoadDoneRef.current = true;
      }
    };

    const loadItems = async () => {
      try {
        const result = await fetchItemsPage({ warehouseId, from: 0, to: ITEMS_PAGE_SIZE - 1 });
        setItems(result?.items ?? []);
      } catch (e) {
        if (shouldReportErrors) {
          setItemsError(e?.message ?? "Failed to load items.");
          setItems([]);
        }
      } finally {
        if (shouldShowLoading) setItemsLoading(false);
        markDone();
      }
    };

    const loadTemplates = async () => {
      try {
        const result = await fetchTemplatesPage({ warehouseId, from: 0, to: TEMPLATES_PAGE_SIZE - 1 });
        setTemplates(result?.templates ?? []);
      } catch (e) {
        if (shouldReportErrors) {
          setTemplatesError(e?.message ?? "Failed to load templates.");
          setTemplates([]);
        }
      } finally {
        if (shouldShowLoading) setTemplatesLoading(false);
        markDone();
      }
    };

    const loadRole = async () => {
      try {
        const role = await fetchWarehouseRole({ warehouseId, userId });
        setCurrentWarehouseRole(role ?? null);
      } catch (e) {
        setCurrentWarehouseRole(null);
      } finally {
        markDone();
      }
    };

    const loadMembers = async () => {
      try {
        const result = await fetchTeamMembersPage({ warehouseId, from: 0, to: TEAM_MEMBERS_PAGE_SIZE - 1 });
        setTeamMembers(result?.members ?? []);
      } catch (e) {
        if (shouldReportErrors) {
          setTeamMembersError(e?.message ?? "Failed to load team.");
          setTeamMembers([]);
        }
      } finally {
        if (shouldShowLoading) setTeamMembersLoading(false);
        markDone();
      }
    };

    loadItems();
    loadTemplates();
    loadRole();
    loadMembers();
  },
  []
);



const reloadWarehouses = useCallback(() => loadWarehouses(), [loadWarehouses]);

const reloadCurrentWarehouseData = useCallback(
  (options = {}) => {
    if (!currentWarehouse?.id || !session?.user?.id) return Promise.resolve();
    return loadCurrentWarehouseData(currentWarehouse.id, session.user.id, options);
  },
  [currentWarehouse?.id, session?.user?.id, loadCurrentWarehouseData]
);


  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }



    const rows = await restRequest({
      path: "profiles",
      params: {
        select: "user_id,full_name,created_at",
        user_id: `eq.${userId}`,
        limit: "1",
      },
    });

    setProfile(restFirst(rows));

  }, []);

  useEffect(() => {
    let ignore = false;
  
    const refreshOnResume = async () => {
      const now = Date.now();
      if (refreshSessionInFlightRef.current) return;
      if (now - lastRefreshAtRef.current < 5000) return;
  
      lastRefreshAtRef.current = now;
      refreshSessionInFlightRef.current = true;
  
      try {
        const { data, error } = await supabase.auth.refreshSession();

  
        if (ignore) return;
        if (error) throw error;
  
        if (data?.session) {
          setSession(data.session);
          setCachedSession(data.session);

          try {
            await fetchProfile(data.session.user?.id);
          } catch (e) {}
        }
      } catch (e) {
      } finally {
        refreshSessionInFlightRef.current = false;
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
  
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();

  
        if (ignore) return;
        if (error) throw error;
  
        const nextSession = data?.session ?? null;
        setSession(nextSession);
        setCachedSession(nextSession);

  
        try {
          await fetchProfile(nextSession?.user?.id);
        } catch (e) {}
      } catch (e) {
        if (!ignore) {
          setSession(null);
          setCachedSession(null);

          setProfile(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
  
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      if (event === "TOKEN_REFRESH_FAILED") {
        setSession(null);
        setCachedSession(null);

        setProfile(null);
        try {
          await supabase.auth.signOut({ scope: "local" });
        } catch (e) {}
        return;
      }
  
      setSession(nextSession ?? null);
      setCachedSession(nextSession ?? null);

      try {
        await fetchProfile(nextSession?.user?.id);
      } catch (e) {}
    });
  
    return () => {
      ignore = true;
      listener?.subscription?.unsubscribe();
    };
  }, [fetchProfile]);
  
  useEffect(() => {
    setCachedSession(session ?? null);
  }, [session]);


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
    refreshSessionOrThrow();
  }, [warehouseSelection?.id]);



  useEffect(() => {
    if (!session?.user?.id) {
      setWarehouses([]);
      setItems([]);
      setTemplates([]);
      setTeamMembers([]);
      setCurrentWarehouseRole(null);
      return;
    }
  
    if (!warehouseSelectionLoaded) return;
  
    loadWarehouses();
  }, [session?.user?.id, warehouseSelectionLoaded, loadWarehouses]);
  
  

  useEffect(() => {
    if (!warehouseSelectionLoaded) return;
    if (warehousesLoading) return;
    if (warehouseSelection?.id) return;
    if (!warehouses.length) return;
  
    setWarehouseSelection(warehouses[0]);
  }, [warehouseSelectionLoaded, warehousesLoading, warehouses, warehouseSelection?.id, setWarehouseSelection]);
  
  
  useEffect(() => {
    const selectedId = warehouseSelection?.id ?? null;
    const hasSelectedWarehouse = !!selectedId && warehouses.some((w) => w.id === selectedId);
  
    if (!selectedId || !session?.user?.id || !hasSelectedWarehouse) {
      setItems([]);
      setTemplates([]);
      setTeamMembers([]);
      setCurrentWarehouseRole(null);
      setItemsLoading(false);
      setTemplatesLoading(false);
      setTeamMembersLoading(false);
      lastWarehouseIdRef.current = null;
      return;
    }
  
    if (lastWarehouseIdRef.current && lastWarehouseIdRef.current !== selectedId) {
      setItems([]);
      setTemplates([]);
      setTeamMembers([]);
      setItemsError("");
      setTemplatesError("");
      setTeamMembersError("");
      setItemsLoading(true);
      setTemplatesLoading(true);
      setTeamMembersLoading(true);
      initialWarehouseLoadDoneRef.current = false;
    }
  
    lastWarehouseIdRef.current = selectedId;
    loadCurrentWarehouseData(selectedId, session.user.id);
  }, [warehouseSelection?.id, warehouses, session?.user?.id, loadCurrentWarehouseData]);
  
  
  
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
  
    const handleItemChange = (payload) => {
      const eventType = payload?.eventType;
      if (eventType === "DELETE") {
        const deletedId = payload?.old?.id;
        if (!deletedId) return;
        setItems((prev) => prev.filter((it) => it.id !== deletedId));
        return;
      }
  
      const next = payload?.new;
      if (!next?.id) return;
  
      setItems((prev) => {
        const idx = prev.findIndex((it) => it.id === next.id);
        if (idx === -1) return [next, ...prev];
        const updated = [...prev];
        updated[idx] = { ...prev[idx], ...next };
        return updated;
      });
    };
  
    const handleTemplateChange = (payload) => {
      const eventType = payload?.eventType;
      if (eventType === "DELETE") {
        const deletedId = payload?.old?.id;
        if (!deletedId) return;
        setTemplates((prev) => prev.filter((t) => t.id !== deletedId));
        return;
      }
  
      const next = payload?.new;
      if (!next?.id) return;
  
      setTemplates((prev) => {
        const idx = prev.findIndex((t) => t.id === next.id);
        if (idx === -1) return [next, ...prev];
        const updated = [...prev];
        updated[idx] = { ...prev[idx], ...next };
        return updated;
      });
    };
  
    const handleMemberChange = (payload) => {
      const eventType = payload?.eventType;
      const next = payload?.new;
      const prev = payload?.old;
      const targetUserId = next?.user_id ?? prev?.user_id;
  
      if (targetUserId === session.user.id) {
        if (eventType === "DELETE") setCurrentWarehouseRole(null);
        if (next?.role) setCurrentWarehouseRole(next.role);
      }
  
      if (eventType === "DELETE") {
        if (!targetUserId) return;
        setTeamMembers((prevMembers) => prevMembers.filter((m) => m.user_id !== targetUserId));
        return;
      }
  
      if (!next?.user_id) return;
  
      setTeamMembers((prevMembers) => {
        const idx = prevMembers.findIndex((m) => m.user_id === next.user_id);
        if (idx === -1) {
          return [...prevMembers, { ...next, full_name: "", email: "" }];
        }
        const updated = [...prevMembers];
        updated[idx] = { ...updated[idx], ...next };
        return updated;
      });
    };
  
    const channel = supabase
      .channel(`realtime:warehouse:${currentWarehouse.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items", filter: `warehouse_id=eq.${currentWarehouse.id}` },
        handleItemChange
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "templates", filter: `warehouse_id=eq.${currentWarehouse.id}` },
        handleTemplateChange
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "warehouse_members", filter: `warehouse_id=eq.${currentWarehouse.id}` },
        handleMemberChange
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentWarehouse?.id, session?.user?.id]);
  
  
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
  
    const nextSession = data?.session ?? null;
    setSession(nextSession);
    setCachedSession(nextSession ?? null);

  
    if (nextSession?.user?.id) {
      try {
        await fetchProfile(nextSession.user.id);
      } catch (e) {}
    } else {
      setProfile(null);
    }
  
    return data;
  }, [fetchProfile]);
  

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
    setSession(null);
    setCachedSession(null);

    setProfile(null);
    setWarehouseSelection(null);
    setWarehouses([]);
    setItems([]);
    setTemplates([]);
    setTeamMembers([]);
    setCurrentWarehouseRole(null);
  
    try {
      await supabase.auth.signOut({ scope: "global" });
    } catch (e) {}
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
