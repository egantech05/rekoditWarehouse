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

import { fetchWarehouses, createWarehouse, fetchWarehouseRole } from "../../lib/api/warehouses";
import { fetchItems, adjustItemQuantity, updateItemProperties, deleteItem } from "../../lib/api/items";
import { warehouseHasTemplates } from "../../lib/api/templates";
import { filterBySearch, buildSearchHaystack } from "../../lib/search";


export default function Home() {

  const { user, warehouseSelection, warehouseSelectionLoaded } = useAuth();


  const [isAdmin, setIsAdmin] = useState(false);

  const [showNewItem, setShowNewItem] = useState(false);
  const [showItem, setShowItem] = useState(false);

  const [warehouses, setWarehouses] = useState(null);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [itemsError, setItemsError] = useState("");
  const [searchText, setSearchText] = useState("");

  const filteredItems = useMemo(
    () => filterBySearch(items, searchText, (item) => buildSearchHaystack(item?.name, item?.properties)),
    [items, searchText]
  );


  const [showCreateWarehouse, setShowCreateWarehouse] = useState(false);
  const [warehouseName, setWarehouseName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const [hasTemplatesForWarehouse, setHasTemplatesForWarehouse] = useState(null);

  const [selectedItemId, setSelectedItemId] = useState(null);

  const selectedItem = useMemo(
    () => items.find((it) => it.id === selectedItemId) ?? null,
    [items, selectedItemId]
  );

  const currentWarehouse = useMemo(() => {
    if (!warehouseSelectionLoaded) return null;
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
        const role = await fetchWarehouseRole({ warehouseId: currentWarehouse.id, userId: user.id });
        if (ignore) return;
        setIsAdmin(role === "admin");
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
      const data = await fetchWarehouses();
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
    setItemsError("");
    try {
      const data = await fetchItems({ warehouseId });
      setItems(data ?? []);
    } catch (e) {
      console.warn("loadItems failed:", e);
      setItemsError(e?.message ?? "Failed to load items.");
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
  }, []);

  const onUpdateItemQuantity = useCallback(async (itemId, deltaInput, note, prevQuantity, warehouseId) => {

    const { item: data, nextQuantity } = await adjustItemQuantity({
      itemId,
      deltaInput,
      note,
      prevQuantity,
      warehouseId,
      actorId: user?.id,
    });
    
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId ? (data ? { ...data, templates: it.templates } : { ...it, quantity: nextQuantity }) : it
      )
    );  

  }, [user?.id]);
  

  

  const onUpdateItemInfo = useCallback(async (itemId, nextProperties) => {
    const data = await updateItemProperties({ itemId, nextProperties });

    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId ? (data ? { ...data, templates: it.templates } : { ...it, properties: nextProperties }) : it
      )
    );


  }, []);

  const onRemoveItem = useCallback(async (itemId) => {
    await deleteItem({ itemId });
  
    setItems((prev) => prev.filter((it) => it.id !== itemId));
    setSelectedItemId((prev) => (prev === itemId ? null : prev));
  }, []);


  const loadTemplatesForWarehouse = useCallback (async (warehouseId) => {
    if (!warehouseId){
      setHasTemplatesForWarehouse(null);
      return;
    }

    setHasTemplatesForWarehouse(null);

    try{
      const hasAny = await warehouseHasTemplates({ warehouseId });
      setHasTemplatesForWarehouse(hasAny);
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
      await createWarehouse({ name, createdBy: user.id });

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
      {loadingWarehouses && warehouses == null ? (
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
          {loadingItems && items.length === 0 ? (
              <Text style={HomeStyles.itemsEmptyText}>Loading items...</Text>
            ) : itemsError ? (
              <Pressable onPress={() => currentWarehouse?.id && loadItems(currentWarehouse.id)}>
                <Text style={HomeStyles.itemsEmptyText}>{itemsError}</Text>
                <Text style={HomeStyles.itemsEmptyText}>Tap to retry</Text>
              </Pressable>
            ) : filteredItems.length === 0 ? (
              <Text style={HomeStyles.itemsEmptyText}>No inventory available.</Text>
            ) : (
              filteredItems.map((item) => (
                <ItemDisplayCard
                  key={item.id}
                  item={item}
                  onPress={() => {
                    setSelectedItemId(item.id);
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
              setSelectedItemId(null);
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

