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

  const { user } = useAuth();

  const [showNewItem, setShowNewItem] = useState(false);
  const [showItem, setShowItem] = useState(false);

  const [warehouses, setWarehouses] = useState(null);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const [showCreateWarehouse, setShowCreateWarehouse] = useState(false);
  const [warehouseName, setWarehouseName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const [hasTemplatesForWarehouse, setHasTemplatesForWarehouse] = useState(null);

  const currentWarehouse = useMemo(() => warehouses?.[0] ?? null, [warehouses]);

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
        .select("id, name, quantity, template_name, warehouse_id, created_at")
        .eq("warehouse_id", warehouseId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data ?? []);
    } catch (e) {
      console.warn("loadItems failed:", e);
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
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
          <SearchBar />
          <AddCard onPress={() => setShowNewItem(true)} disabled={hasNoTemplatesForWarehouse} />
          {hasNoTemplatesForWarehouse && (
            <Text style={HomeStyles.templateNotice}>
              No inventory template available. Create template first before creating an inventory.
            </Text>
          )}

          <ScrollView contentContainerStyle={HomeStyles.scroll} showsVerticalScrollIndicator={false}>
            {loadingItems ? (
              <Text style={HomeStyles.itemsEmptyText}>Loading items...</Text>
            ) : items.length === 0 ? (
              <Text style={HomeStyles.itemsEmptyText}>No items yet.</Text>
            ) : (
              items.map((item) => (
                <ItemDisplayCard key={item.id} item={item} onPress={() => setShowItem(true)} />
              ))
            )}
          </ScrollView>

          <NewItemCard visible={showNewItem} onClose={() => setShowNewItem(false)} />
          <ViewItem visible={showItem} onClose={() => setShowItem(false)} />
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

