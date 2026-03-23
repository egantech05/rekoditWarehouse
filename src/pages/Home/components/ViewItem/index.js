import { View,Text} from "react-native";

import { useMemo, useState, useEffect, useRef } from "react";
import { fetchItemDetail } from "../../../../lib/api/items";

import { ViewItemStyles } from "./styles";
import ViewModal from "../../../../components/ViewModal"
import FooterIconButton from "../../../../components/FooterIconButton";
import TabButtons from "./components/TabButtons";
import EditButtons from "./components/EditButtons";
import QuantityEdit from "./components/InfoTab/components/QuantityEdit";
import SmallModal from "../../../../components/SmallModal";
import DateFilter from "./components/HistoryTab/components/DateFilter";

import InfoTab from "./components/InfoTab";
import HistoryTab from "./components/HistoryTab";
import QRTab from "./components/QRTab";

import {colors} from "../../../../assets/styles"



const toDraftProperties = (values = []) =>
  Array.isArray(values)
    ? Object.fromEntries(
        values.map((v) => [v?.property_id, v?.value == null ? "" : String(v.value)])
      )
    : {};

const toPropertiesPayload = (draftProperties, templateProps) => {
  const nextProperties = {};
  const list = Array.isArray(templateProps) ? templateProps : [];
  for (const prop of list) {
    const propId = prop?.id;
    if (!propId) continue;
    const raw = draftProperties?.[propId];
    const trimmed = String(raw ?? "").trim();
    nextProperties[propId] = trimmed ? trimmed : null;
  }
  return nextProperties;
};


export default function ViewItem({ visible, onClose, item, onUpdateQuantity, onRemoveItem, onUpdateItemInfo, canRemove = false, readOnly = false, headerActionLabel, onHeaderAction }) {

    const [selectedTab, setSelectedTab] = useState("info");
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [draftProperties, setDraftProperties] = useState({});
    const [draftQuantity, setDraftQuantity] = useState(0);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState("");

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [showQtyConfirm, setShowQtyConfirm] = useState(false);
    const [qtyNotes, setQtyNotes] = useState("");
    const [qtyNotesError, setQtyNotesError] = useState("");

    const [showHistoryDateFilter, setShowHistoryDateFilter] = useState(false);
    const [historyStartDate, setHistoryStartDate] = useState(null);
    const [historyEndDate, setHistoryEndDate] = useState(null);

    const [detailItem, setDetailItem] = useState(item ?? null);
    const saveAbortRef = useRef(null);

    const qrDownloadRef = useRef(null);


    const isReadOnly = !!readOnly;


    useEffect(() => {
      if (!item?.id) return;
      setDetailItem((prev) => {
        const merged = prev?.id === item.id ? { ...prev, ...item } : item;
        if (prev?.templates && !merged?.templates) {
          return { ...merged, templates: prev.templates };
        }
        if (prev?.item_property_values && !merged?.item_property_values) {
          return { ...merged, item_property_values: prev.item_property_values };
        }
        
        return merged;
      });
    }, [item]);
    

    useEffect(() => {
      if (!visible || !item?.id || isReadOnly) return;
      let ignore = false;

      (async () => {
        try {
          const data = await fetchItemDetail({ itemId: item.id });
          if (!ignore && data) {
            setDetailItem((prev) => (prev?.id === item.id ? { ...prev, ...data } : data));
          }

        } catch (e) {}
      })();

      return () => {
        ignore = true;
      };
    }, [visible, item?.id]);



    


    useEffect(() => {
      if (!visible || !item?.id) return;
      setSelectedTab("info");
      setDraftQuantity(0);
      setActionError("");
      setActionLoading(false);
      setShowDeleteConfirm(false);
      setIsEditingInfo(false);
      setShowQtyConfirm(false);
      setQtyNotes("");
      setQtyNotesError("");
      setShowHistoryDateFilter(false);
      setHistoryStartDate(null);
      setHistoryEndDate(null);
      setDraftProperties(toDraftProperties(item?.item_property_values));

    }, [visible, item?.id]);
  



    const activeItem = detailItem ?? item;
    const templateProps = Array.isArray(activeItem?.templates?.template_properties)
    ? activeItem.templates.template_properties
    : [];
  
  const valueMap = Array.isArray(activeItem?.item_property_values)
    ? Object.fromEntries(activeItem.item_property_values.map((v) => [v?.property_id, v?.value]))
    : {};
  
  const firstPropId = templateProps[0]?.id ?? null;
  const firstPropertyValue = firstPropId ? valueMap?.[firstPropId] : null;
  
  const modalTitle =
    (firstPropertyValue != null && String(firstPropertyValue).trim() !== "" ? String(firstPropertyValue) : null) ??
    activeItem?.name ??
    "Inventory";
  

    const footer =
    selectedTab === "history" ? (
      <FooterIconButton
        iconName="calendar-outline"
        color={colors.boldColor}
        onPress={() => setShowHistoryDateFilter(true)}
      />
    ) : !isReadOnly && selectedTab === "info" ? (
      <QuantityEdit
        value={draftQuantity}
        onChange={setDraftQuantity}
        disabled={!activeItem?.id || actionLoading}
        onSubmit={() => {
          if (!activeItem?.id) return;
          setQtyNotesError("");
          setShowQtyConfirm(true);
        }}
      />
    ) : !isReadOnly && selectedTab === "qr" ? (
      <FooterIconButton
        iconName="download-outline"
        text="Download"
        color={colors.boldColor}
        onPress={() => qrDownloadRef.current?.()}
      />
    ) : null;
  

    const tabs = (
        <View style={ViewItemStyles.tabs}>
            <TabButtons selectedTab={selectedTab} onSelectTab={setSelectedTab}/>
            {selectedTab === "info" && !isReadOnly && (
              <EditButtons
                canRemove={canRemove}
                disabled={!activeItem?.id || actionLoading}
                onRemove={() => {
                  if (!canRemove || !activeItem?.id || actionLoading) return;
                  setShowDeleteConfirm(true);
                }}
                isEditing={isEditingInfo}
                onEdit={async () => {
                  
                  if (saveAbortRef.current) {
                    console.log("[ViewItem][edit] abort previous save");
                    saveAbortRef.current.abort();
                    saveAbortRef.current = null;
                  }
                                    


                  let controller = null;


                  
                  console.log("[ViewItem][edit] click", {
                    isEditingInfo,
                    actionLoading,
                    activeItemId: activeItem?.id,
                    visible,
                  });
                
                  if (!isEditingInfo) {
                    console.log("[ViewItem][edit] enter edit mode");
                    setIsEditingInfo(true);
                    return;
                  }
                
                  if (!activeItem?.id) return;

                
                  const nextProperties = toPropertiesPayload(
                    draftProperties,
                    activeItem?.templates?.template_properties
                  );
                  
                  console.log("[ViewItem][edit] save start", {
                    itemId: activeItem.id,
                    keys: Object.keys(nextProperties ?? {}),
                  });
                
                  setActionError("");
                  setActionLoading(true);
                  try {
                    if (!onUpdateItemInfo) throw new Error("Update action not available.");
                    controller = new AbortController();

                    saveAbortRef.current = controller;
                    await onUpdateItemInfo(activeItem.id, nextProperties, controller.signal);


                    

                    console.log("[ViewItem][edit] save ok");
                    setDetailItem((prev) => {
                      if (!activeItem?.id) return prev;
                      const base = prev?.id === activeItem.id ? prev : activeItem;
                      return base
                      ? {
                          ...base,
                          item_property_values: Object.entries(nextProperties).map(([property_id, value]) => ({
                            property_id,
                            value,
                          })),
                        }
                      : prev;
                    
                    });
                    setDraftProperties(toDraftProperties(nextProperties));
                    setIsEditingInfo(false);

                    
                  } catch (e) {
                    console.log("[ViewItem][edit] save error", e);
                    setActionError(e?.message ?? "Failed to update item.");
                  } finally {

                    console.log("[ViewItem][edit] save done");
                    if (saveAbortRef.current === controller) {
                      saveAbortRef.current = null;
                    }
                    
                    setActionLoading(false);
                  }
                }}
                
              />
            )}
        </View>
    );

    const tabContent = useMemo(() => {
        switch (selectedTab) {
          case "info":
            return (
              <InfoTab
                item={activeItem}
                isEditing={isEditingInfo}
                draftProperties={draftProperties}
                setDraftProperties={setDraftProperties}
              />
            );
          case "history":
            return <HistoryTab item={activeItem} startDate={historyStartDate} endDate={historyEndDate} readOnly={isReadOnly} />;

            case "qr":
              return <QRTab item={activeItem} onBindDownload={(fn) => { qrDownloadRef.current = fn; }} />;
            
          default:
            return (
              <InfoTab
                item={activeItem}
                isEditing={isEditingInfo}
                draftProperties={draftProperties}
                setDraftProperties={setDraftProperties}
              />
            );
        }
      }, [selectedTab, activeItem, isEditingInfo, draftProperties, historyStartDate, historyEndDate]);


    
    return(
      <ViewModal
      visible={visible}
      onClose={onClose}
      title={modalTitle}
      tabs={tabs}
      footer={footer}
      actionLabel={headerActionLabel}
      onAction={onHeaderAction}
    >

        <View style={ViewItemStyles.container}>
          {!!actionError && <Text style={{ color: colors.red, marginBottom: 8 }}>{actionError}</Text>}
          {tabContent}


        <SmallModal
            visible={showQtyConfirm}
            onClose={() => {
              if (actionLoading) return;
              setShowQtyConfirm(false);
              setQtyNotes("");
              setQtyNotesError("");
            }}
            showCancel={true}
            cancelText="Cancel"
            title="Confirm quantity update"
            inputTitle="Notes"
            value={qtyNotes}
            onChangeText={(t) => {
              setQtyNotes(t);
              if (qtyNotesError) setQtyNotesError("");
            }}
            placeholder="Add notes for this change"
            submitText="Confirm"
            onSubmit={async () => {
              if (!item?.id || actionLoading) return;

              const trimmed = qtyNotes.trim();
              if (!trimmed) {
                setQtyNotesError("Notes are required.");
                return;
              }

              setActionError("");
              setActionLoading(true);
              try {
                await onUpdateQuantity?.(
                  activeItem.id,
                  draftQuantity,
                  trimmed,
                  activeItem?.quantity ?? 0,
                  activeItem?.warehouse_id,
                  
                );
                setShowQtyConfirm(false);
                setQtyNotes("");
                setQtyNotesError("");
                setDraftQuantity(0);
              } catch (e) {
                setQtyNotesError(e?.message ?? "Failed to update quantity.");
            
              } finally {
                setActionLoading(false);
              }
            }}
            loading={actionLoading}
            error={qtyNotesError}
            autoCapitalize="sentences"
        />

        <DateFilter
          locale="en"
          visible={showHistoryDateFilter}
          onClose={() => setShowHistoryDateFilter(false)}
          startDate={historyStartDate}
          endDate={historyEndDate}
          onChangeStartDate={setHistoryStartDate}
          onChangeEndDate={setHistoryEndDate}
          onClear={() => {
            setHistoryStartDate(null);
            setHistoryEndDate(null);
          }}
        />


        <SmallModal
          visible={showDeleteConfirm}
          onClose={() => {
            if (actionLoading) return;
            setShowDeleteConfirm(false);
          }}
          showInput={false}
          showCancel={true}
          cancelText="Cancel"
          title="Remove item"
          bodyText="This will delete the item from the database."
          submitText="Remove"
          onSubmit={async () => {
            if (!item?.id || actionLoading) return;

            setActionError("");
            setActionLoading(true);
            try {
              if (!onRemoveItem) throw new Error("Remove action not available.");
              await onRemoveItem(item.id);

              setShowDeleteConfirm(false);
              onClose?.();
            } catch (e) {
              setActionError(e?.message ?? "Failed to remove item.");
            } finally {
              setActionLoading(false);
            }
          }}
          loading={actionLoading}
        />
        </View>
      </ViewModal>
    );
};