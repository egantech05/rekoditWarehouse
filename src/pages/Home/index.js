import { View, ScrollView, Text, Pressable } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { HomeStyles } from "./styles";

import NewItemCard from "./components/NewItemCard";
import AddCard from "../../components/AddCard";
import ItemDisplayCard from "./components/ItemDisplayCard";
import SearchBar from "../../components/SearchBar";
import ViewItem from "./components/ViewItem";

import SmallModal from "../../components/SmallModal";
import { useAuth } from "../../auth/AuthContext";
import { supabase } from "../../lib/supabase";

export default function Home() {

  const { user, warehouseSelection } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);

  const [showNewItem, setShowNewItem] = useState(false);
  const [showItem, setShowItem] = useState(false);

  const [warehouses, setWarehouses] = useState(null);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [searchText, setSearchText] = useState("");

  const normalizedSearch = searchText.trim().toLowerCase();
  const filteredItems = useMemo(() => {
    if (!normalizedSearch) return items;
  
    return items.filter((item) => {
      const template = String(item?.name ?? "").toLowerCase();
  
      const propsText =
        item?.properties == null
          ? ""
          : typeof item.properties === "string"
            ? item.properties
            : typeof item.properties === "object"
              ? Object.values(item.properties).filter(Boolean).join(" ")
              : "";
  
      return (
        template.includes(normalizedSearch) ||
        String(propsText).toLowerCase().includes(normalizedSearch)
      );
    });
  }, [items, normalizedSearch]);

  const [showCreateWarehouse, setShowCreateWarehouse] = useState(false);
  const [warehouseName, setWarehouseName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const [hasTemplatesForWarehouse, setHasTemplatesForWarehouse] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);

  const currentWarehouse = useMemo(() => {
    if (!Array.isArray(warehouses) || warehouses.length === 0) return null
    return warehouses.find((w) => w.id === warehouseSelection?.id) ?? warehouses[0]
    }, [warehouses, warehouseSelection?.id])

  useEffect(() => {
    let ignore = false;
  
    const loadWarehouseRole = async () => {
      if (!user?.id || !currentWarehouse?.id) {
        setIsAdmin(false);
        return;
      }
  
      try {
        const { data, error } = await supabase
          .from("warehouse_members")
          .select("role")
          .eq("warehouse_id", currentWarehouse.id)
          .eq("user_id", user.id)
          .maybeSingle();
  
        if (ignore) return;
        if (error) throw error;
  
        setIsAdmin(data?.role === "admin");
      } catch (e) {
        if (!ignore) setIsAdmin(false);
      }
    };
  
    loadWarehouseRole();
    return () => {
      ignore = true;
    };
  }, [user?.id, currentWarehouse?.id]);

  const loadWarehouses = useCallback(async () => {
    if (!user?.id) {
      setWarehouses(null);
      return;
    }

    setLoadingWarehouses(true);
    try {
      const { data, error } = await supabase
        .from("warehouses")
        .select("id, name, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWarehouses(data ?? []);
    } catch (e) {
      console.warn("loadWarehouses failed:", e);
      setWarehouses([]);
    } finally {
      setLoadingWarehouses(false);
    }
  }, [user?.id]);

  const loadItems = useCallback(async (warehouseId) => {
    if (!warehouseId) {
      setItems([]);
      return;
    }

    setLoadingItems(true);
    try {
      const { data, error } = await supabase
      .from("items")
      .select("*, templates ( properties )")
      .eq("warehouse_id", warehouseId);

      if (error) throw error;
      setItems(data ?? []);
    } catch (e) {
      console.warn("loadItems failed:", e);
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
  }, []);

  const onUpdateItemQuantity = useCallback(async (itemId, deltaInput, note, prevQuantity, warehouseId) => {
    const safePrevQuantity = Math.max(0, Math.trunc(Number(prevQuantity) || 0));
    const safeDelta = Math.trunc(Number(deltaInput) || 0);
  
    const nextQuantity = Math.max(0, safePrevQuantity + safeDelta);
    const appliedDelta = nextQuantity - safePrevQuantity;
  
    if (!warehouseId) throw new Error("Missing warehouse_id.");
    if (!user?.id) throw new Error("Missing user.");
  
    const trimmedNote = String(note ?? "").trim();
    if (!trimmedNote) throw new Error("Notes are required.");
  
    if (appliedDelta !== 0) {
      const eventType = "adjust"; // allowed by your constraint
  
      const { error: eventError } = await supabase.from("item_events").insert({
        warehouse_id: warehouseId,
        item_id: itemId,
        delta: appliedDelta,
        event_type: eventType,
        note: trimmedNote,
        actor_id: user.id,
      });
  
      if (eventError) throw eventError;
    }
  
    const { data, error } = await supabase
      .from("items")
      .update({ quantity: nextQuantity })
      .eq("id", itemId)
      .select("*")
      .maybeSingle();
  
    if (error) throw error;
  
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId ? (data ? { ...data, templates: it.templates } : { ...it, quantity: nextQuantity }) : it
      )
    );
    setSelectedItem((prev) =>
      prev?.id === itemId
        ? (data ? { ...data, templates: prev.templates } : { ...prev, quantity: nextQuantity })
        : prev
    );
  }, [user?.id]);
  

  

  const onUpdateItemInfo = useCallback(async (itemId, nextProperties) => {
    const { data, error } = await supabase
      .from("items")
      .update({ properties: nextProperties })
      .eq("id", itemId)
      .select("*")
      .maybeSingle();
  
    if (error) throw error;
  
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId ? (data ? { ...data, templates: it.templates } : { ...it, properties: nextProperties }) : it
      )
    );
    setSelectedItem((prev) =>
      prev?.id === itemId
        ? (data ? { ...data, templates: prev.templates } : { ...prev, properties: nextProperties })
        : prev
    );
  }, []);

  const onRemoveItem = useCallback(async (itemId) => {
    const { error } = await supabase.from("items").delete().eq("id", itemId);
    if (error) throw error;
  
    setItems((prev) => prev.filter((it) => it.id !== itemId));
    setSelectedItem((prev) => (prev?.id === itemId ? null : prev));
  }, []);


  const loadTemplatesForWarehouse = useCallback (async (warehouseId) => {
    if (!warehouseId){
      setHasTemplatesForWarehouse(null);
      return;
    }

    setHasTemplatesForWarehouse(null);

    try{
      const{data,error} = await supabase
        .from("templates")
        .select("id")
        .eq("warehouse_id", warehouseId)
        .limit(1);

      if (error) throw error;
      
      setHasTemplatesForWarehouse((data??[]).length>0);
    } catch (e){
      console.warn("loadTemplatesForWarehouse failed: ",e);
      setHasTemplatesForWarehouse(null);
    }
    
  },[]);

  useEffect(() => {
    loadWarehouses();
  }, [loadWarehouses]);

  useEffect(() => {
    if (!currentWarehouse?.id) {
      setItems([]);
      return;
    }
    loadItems(currentWarehouse.id);
  }, [currentWarehouse?.id, loadItems]);

  useEffect(()=>{
    loadTemplatesForWarehouse(currentWarehouse?.id);
  },[currentWarehouse?.id,loadTemplatesForWarehouse]);

  const hasNoWarehouses = warehouses != null && !loadingWarehouses && warehouses.length === 0;
  const hasNoTemplatesForWarehouse = hasTemplatesForWarehouse === false;

  const onCreateWarehouse = async () => {
    setCreateError("");
    const name = warehouseName.trim();

    if (!name) {
      setCreateError("Please enter a warehouse name.");
      return;
    }

    setCreateLoading(true);
    try {
      const { error } = await supabase.from("warehouses").insert({ name, created_by:user.id });
      if (error) throw error;

      setShowCreateWarehouse(false);
      await loadWarehouses();
    } catch (e) {
      setCreateError(e?.message ?? "Failed to create warehouse.");
    } finally {
      setCreateLoading(false);
    }
  };

  return (

    <View style={HomeStyles.container}>
      {loadingWarehouses ? (
        <View style={HomeStyles.emptyState}>
          <Text style={HomeStyles.loadingText}>Loading...</Text>
        </View>
      ) : hasNoWarehouses ? (
        <View style={HomeStyles.emptyState}>
          <Text style={HomeStyles.emptyTitle}>No warehouse connected.</Text>
          <Text style={HomeStyles.emptyBody}>Create a warehouse to start tracking inventory.</Text>

          <Pressable style={HomeStyles.createWarehouseLink} onPress={() => setShowCreateWarehouse(true)}>
            <Text style={HomeStyles.createWarehouseText}>Create new warehouse</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <SearchBar value={searchText} onChangeText={setSearchText} />
          <AddCard onPress={() => setShowNewItem(true)} disabled={hasNoTemplatesForWarehouse} />
          {hasNoTemplatesForWarehouse && (
            <Text style={HomeStyles.templateNotice}>
              No inventory template available. Create template first before creating an inventory.
            </Text>
          )}

          <ScrollView contentContainerStyle={HomeStyles.scroll} showsVerticalScrollIndicator={false}>
            {loadingItems ? (
              <Text style={HomeStyles.itemsEmptyText}>Loading items...</Text>
            ) : filteredItems.length === 0 ? (
              <Text style={HomeStyles.itemsEmptyText}>No items yet.</Text>
            ) : (
              filteredItems.map((item) => (
                <ItemDisplayCard
                  key={item.id}
                  item={item}
                  onPress={() => {
                    setSelectedItem(item);
                    setShowItem(true);
                  }}
                />
              ))
            )}
          </ScrollView>

          <NewItemCard
            visible={showNewItem}
            warehouseId={currentWarehouse?.id}
            onClose={() => setShowNewItem(false)}
            onCreated={() => {
              if (currentWarehouse?.id) return loadItems(currentWarehouse.id);
            }}
          />
          <ViewItem
            visible={showItem}
            item={selectedItem}
            onUpdateQuantity={onUpdateItemQuantity}
            canRemove={isAdmin}
            onUpdateItemInfo={onUpdateItemInfo}
            onRemoveItem={onRemoveItem}
            onClose={() => {
              setShowItem(false);
              setSelectedItem(null);
            }}
          />
        </>
      )}

      <SmallModal
        visible={showCreateWarehouse}
        onClose={() => setShowCreateWarehouse(false)}
        title="Create Warehouse"
        inputTitle="Warehouse name"
        value={warehouseName}
        onChangeText={(t) => {
          setWarehouseName(t);
          if (createError) setCreateError("");
        }}
        submitText="Create"
        onSubmit={onCreateWarehouse}
        loading={createLoading}
        error={createError}
      />
    </View>
    


    
  );
}

