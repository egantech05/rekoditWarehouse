import { View, ScrollView, Text, Pressable } from "react-native";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";


import { HomeStyles } from "./styles";

import NewItemCard from "./components/NewItemCard";
import AddCard from "../../components/AddCard";
import ItemDisplayCard from "./components/ItemDisplayCard";
import SearchBar from "../../components/SearchBar";
import ViewItem from "./components/ViewItem";
import SmallModal from "../../components/SmallModal";

import { useAuth } from "../../auth/AuthContext";
import { refreshSessionOrThrow } from "../../lib/supabase";

import { createWarehouse } from "../../lib/api/warehouses";
import { adjustItemQuantity, updateItemProperties, deleteItem, fetchItemsPage, ITEMS_PAGE_SIZE } from "../../lib/api/items";

import { filterBySearch, buildSearchHaystack } from "../../lib/search";


export default function Home({ route }) {


  const { user, warehouses, warehousesLoading, items, itemsLoading, itemsError, templates, templatesLoading, currentWarehouse, isAdmin, reloadCurrentWarehouseData, reloadWarehouses, setItems } = useAuth();

  const [itemsPaging, setItemsPaging] = useState(false);
  const [itemsPagingError, setItemsPagingError] = useState("");
  const [nextFrom, setNextFrom] = useState(0);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const pagingInitRef = useRef(false);
  const [forcedItem, setForcedItem] = useState(null);


  useEffect(() => {
    if (!currentWarehouse?.id) {
      pagingInitRef.current = false;
      setNextFrom(0);
      setHasMoreItems(false);
      setItemsPagingError("");
      return;
    }

    if (itemsLoading || pagingInitRef.current) return;

    const count = items.length;
    setNextFrom(count);
    setHasMoreItems(count === ITEMS_PAGE_SIZE);
    pagingInitRef.current = true;
  }, [currentWarehouse?.id, itemsLoading, items.length]);



  const [showNewItem, setShowNewItem] = useState(false);
  const [showItem, setShowItem] = useState(false);

  useEffect(() => {
    refreshSessionOrThrow();
  }, [showNewItem, showItem]);

  useEffect(() => {
    const openItem = route?.params?.openItem ?? null;
    if (!openItem?.id) return;

    setForcedItem(openItem);
    setSelectedItemId(openItem.id);
    setShowItem(true);
  }, [route?.params?.openItem?.id]);




  
  const [searchText, setSearchText] = useState("");

  const templateById = useMemo(
    () => new Map((Array.isArray(templates) ? templates : []).map((t) => [t.id, t])),
    [templates]
  );
  

  const filteredItems = useMemo(
    () =>
      filterBySearch(items, searchText, (item) =>
        buildSearchHaystack(
          item?.name,
          (Array.isArray(item?.item_property_values) ? item.item_property_values : []).map((v) => v?.value)
        )
      ),
    [items, searchText]
  );
  


  const [showCreateWarehouse, setShowCreateWarehouse] = useState(false);
  const [warehouseName, setWarehouseName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const hasNoWarehouses = !warehousesLoading && warehouses.length === 0;
  const hasNoTemplatesForWarehouse = !templatesLoading && templates.length === 0;
  

  const [selectedItemId, setSelectedItemId] = useState(null);

  const selectedItem = useMemo(() => {
    const it = items.find((row) => row.id === selectedItemId) ?? null;
    if (!it) return null;
  
    const tpl = templates.find((t) => t.id === it.template_id) ?? null;
    if (!tpl) return it;
    
    return { ...it, templates: { template_properties: tpl.template_properties } };
    
  }, [items, templates, selectedItemId]);
  


  const onReloadItems = useCallback(() => {
    pagingInitRef.current = false;
    setNextFrom(0);
    setHasMoreItems(true);
    setItemsPagingError("");
    return reloadCurrentWarehouseData();
  }, [reloadCurrentWarehouseData]);

  const onLoadMoreItems = useCallback(async () => {
    if (!currentWarehouse?.id || itemsLoading || itemsPaging || !hasMoreItems) return;

    setItemsPaging(true);
    setItemsPagingError("");
    try {
      const { items: pageItems, nextFrom: next } = await fetchItemsPage({
        warehouseId: currentWarehouse.id,
        from: nextFrom,
        to: nextFrom + ITEMS_PAGE_SIZE - 1,
      });

      setItems((prev) => {
        const byId = new Map(prev.map((it) => [it.id, it]));
        for (const row of pageItems ?? []) {
          const existing = byId.get(row.id);
          byId.set(row.id, existing ? { ...existing, ...row } : row);
        }
        return Array.from(byId.values());
      });

      const loadedCount = pageItems?.length ?? 0;
      setNextFrom(next ?? nextFrom + loadedCount);
      setHasMoreItems(loadedCount === ITEMS_PAGE_SIZE);
    } catch (e) {
      setItemsPagingError(e?.message ?? "Failed to load more items.");
    } finally {
      setItemsPaging(false);
    }
  }, [currentWarehouse?.id, itemsLoading, itemsPaging, hasMoreItems, nextFrom, setItems]);




  const onUpdateItemQuantity = useCallback(async (itemId, deltaInput, note, prevQuantity, warehouseId) => {
    refreshSessionOrThrow();

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
        it.id === itemId
    ? (data ? { ...data, templates: it.templates, item_property_values: it.item_property_values } : { ...it, quantity: nextQuantity })
    : it
  
      )
    );  

  }, [user?.id]);
  

  

  const onUpdateItemInfo = useCallback(async (itemId, nextProperties, signal) => {
    refreshSessionOrThrow();

    console.log("[Home][onUpdateItemInfo] start", {
      itemId,
      keys: Object.keys(nextProperties ?? {}),
    });
  
    try {
      const data = await updateItemProperties({ itemId, nextProperties, signal });
      console.log("[Home][onUpdateItemInfo] success", { itemId, hasData: !!data });
  
      const nextValues = Array.isArray(data) && data.length
      ? data.map((row) => ({ property_id: row.property_id, value: row.value }))
      : Object.entries(nextProperties ?? {}).map(([property_id, value]) => ({ property_id, value }));
    
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId ? { ...it, item_property_values: nextValues } : it
      )
    );
    
    } catch (e) {
      console.log("[Home][onUpdateItemInfo] error", e);
      throw e;
    }
  }, []);
  
  

  const onRemoveItem = useCallback(async (itemId) => {
    await deleteItem({ itemId });
  
    setItems((prev) => prev.filter((it) => it.id !== itemId));
    setSelectedItemId((prev) => (prev === itemId ? null : prev));
  }, []);





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
      await reloadWarehouses();
    } catch (e) {
      setCreateError(e?.message ?? "Failed to create warehouse.");
    } finally {
      setCreateLoading(false);
    }
  };

  return (

    <View style={HomeStyles.container}>
      {warehousesLoading && warehouses.length === 0 ? (
          <View style={HomeStyles.emptyState}>
            <Text style={HomeStyles.loadingText}>Loading warehouses...</Text>
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
             {itemsLoading && items.length === 0 ? (
              <Text style={HomeStyles.itemsEmptyText}>Loading items...</Text>
            ) : itemsError ? (
              <Pressable onPress={() => onReloadItems()}>
                <Text style={HomeStyles.itemsEmptyText}>{itemsError}</Text>
                <Text style={HomeStyles.itemsEmptyText}>Tap to retry</Text>
              </Pressable>
            ) : filteredItems.length === 0 ? (
              <Text style={HomeStyles.itemsEmptyText}>No inventory available.</Text>
            ) : (
              filteredItems.map((item) => {
                const template = templateById.get(item.template_id);
                const templateProps = Array.isArray(template?.template_properties) ? template.template_properties : [];
                const firstPropId = templateProps[0]?.id ?? null;
              
                const valueMap = Array.isArray(item?.item_property_values)
                  ? Object.fromEntries(item.item_property_values.map((v) => [v?.property_id, v?.value]))
                  : {};
              
                const title = firstPropId ? valueMap?.[firstPropId] ?? "Item" : "Item";
                const templateName = template?.name ?? item?.name ?? "Template";
              
                return (
                  <ItemDisplayCard
                    key={item.id}
                    item={item}
                    title={title}
                    templateName={templateName}
                    onPress={() => {
                      setSelectedItemId(item.id);
                      setShowItem(true);
                    }}
                  />
                );
              })
              
              
            )}
                        {hasMoreItems && !itemsLoading && filteredItems.length > 0 && (
              <Pressable onPress={onLoadMoreItems} disabled={itemsPaging}>
                <Text style={HomeStyles.itemsEmptyText}>
                  {itemsPaging ? "Loading more..." : "Load more"}
                </Text>
              </Pressable>
            )}
            {!!itemsPagingError && (
              <Text style={HomeStyles.itemsEmptyText}>{itemsPagingError}</Text>
            )}
          </ScrollView>

          <NewItemCard
            visible={showNewItem}
            warehouseId={currentWarehouse?.id}
            onClose={() => setShowNewItem(false)}
            onCreated={() => onReloadItems()}

          />
          <ViewItem
            visible={showItem}
            item={selectedItem ?? forcedItem}
            onUpdateQuantity={onUpdateItemQuantity}
            canRemove={isAdmin}
            onUpdateItemInfo={onUpdateItemInfo}
            onRemoveItem={onRemoveItem}
            onClose={() => {
              setShowItem(false);
              setSelectedItemId(null);
              setForcedItem(null);
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

