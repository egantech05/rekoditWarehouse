import { View, ScrollView, Text, Pressable } from "react-native";
import React, { useCallback, useMemo, useState } from "react";


import { HomeStyles } from "./styles";

import NewItemCard from "./components/NewItemCard";
import AddCard from "../../components/AddCard";
import ItemDisplayCard from "./components/ItemDisplayCard";
import SearchBar from "../../components/SearchBar";
import ViewItem from "./components/ViewItem";
import SmallModal from "../../components/SmallModal";

import { useAuth } from "../../auth/AuthContext";
import { createWarehouse } from "../../lib/api/warehouses";
import { adjustItemQuantity, updateItemProperties, deleteItem } from "../../lib/api/items";

import { filterBySearch, buildSearchHaystack } from "../../lib/search";


export default function Home() {

  const { user, warehouses, warehousesLoading, items, itemsLoading, itemsError, templates, templatesLoading, currentWarehouse, isAdmin, reloadCurrentWarehouseData, reloadWarehouses, setItems } = useAuth();



  const [showNewItem, setShowNewItem] = useState(false);
  const [showItem, setShowItem] = useState(false);



  
  const [searchText, setSearchText] = useState("");

  const filteredItems = useMemo(
    () => filterBySearch(items, searchText, (item) => buildSearchHaystack(item?.name, item?.properties)),
    [items, searchText]
  );


  const [showCreateWarehouse, setShowCreateWarehouse] = useState(false);
  const [warehouseName, setWarehouseName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const hasNoWarehouses = !warehousesLoading && warehouses.length === 0;
  const hasNoTemplatesForWarehouse = !templatesLoading && templates.length === 0;
  

  const [selectedItemId, setSelectedItemId] = useState(null);

  const selectedItem = useMemo(
    () => items.find((it) => it.id === selectedItemId) ?? null,
    [items, selectedItemId]
  );





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
              <Pressable onPress={() => reloadCurrentWarehouseData()}>
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
            onCreated={() => reloadCurrentWarehouseData()}

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

