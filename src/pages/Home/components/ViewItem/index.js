import { View,Text} from "react-native";
import { useMemo, useState, useEffect } from "react";

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

import { supabase } from "../../../../lib/supabase";


const toDraftProperties = (properties) =>
  properties && typeof properties === "object"
    ? Object.fromEntries(Object.entries(properties).map(([k, v]) => [k, v == null ? "" : String(v)]))
    : {};

const toPropertiesPayload = (draftProperties) => {
  const nextProperties = {};
  for (const [k, v] of Object.entries(draftProperties ?? {})) {
    const trimmed = String(v ?? "").trim();
    nextProperties[k] = trimmed ? trimmed : null;
  }
  return nextProperties;
};

export default function ViewItem({ visible, onClose, item, onUpdateQuantity, onRemoveItem, onUpdateItemInfo, canRemove = false }) {
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


    


    useEffect(() => {
      if (!visible) return;
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
      setDraftProperties(toDraftProperties(item?.properties));
    }, [visible, item?.id]);

    useEffect(() => {
      if (!visible) return;
      let ignore = false;

      const refreshSession = async () => {
        try {
          await supabase.auth.refreshSession();
        } catch (e) {
          if (!ignore) setActionError(e?.message ?? "Failed to refresh session.");
        }
      };

      refreshSession();
      return () => {
        ignore = true;
      };
    }, [visible]);


    const firstPropertyValue =
      item?.properties && typeof item.properties === "object"
        ? Object.values(item.properties).find((v) => v != null && String(v).trim() !== "")
        : null;

    const modalTitle = firstPropertyValue ?? item?.name ?? "Inventory";

    const footer =
      selectedTab === "info" ? (
        <QuantityEdit
          value={draftQuantity}
          onChange={setDraftQuantity}
          disabled={!item?.id || actionLoading}
          onSubmit={() => {
            if (!item?.id || actionLoading) return;
            setQtyNotesError("");
            setShowQtyConfirm(true);
          }}
        />
      ) : selectedTab === "history" ? (
        <FooterIconButton
          iconName="calendar-outline"
          color={colors.boldColor}
          onPress={() => setShowHistoryDateFilter(true)}
        />
      ) : selectedTab === "qr" ? (
        <FooterIconButton iconName="download-outline" text="Download" color={colors.boldColor} />
      
      ) : null;

    const tabs = (
        <View style={ViewItemStyles.tabs}>
            <TabButtons selectedTab={selectedTab} onSelectTab={setSelectedTab}/>
            {selectedTab === "info" && (
              <EditButtons
                canRemove={canRemove}
                disabled={!item?.id || actionLoading}
                onRemove={() => {
                  if (!canRemove || !item?.id || actionLoading) return;
                  setShowDeleteConfirm(true);
                }}
                isEditing={isEditingInfo}
                  onEdit={async () => {
                    if (!isEditingInfo) {
                      setIsEditingInfo(true);
                      return;
                    }

                    if (!item?.id || actionLoading) return;

                    const nextProperties = toPropertiesPayload(draftProperties);

                    setActionError("");
                    setActionLoading(true);
                    try {
                      await onUpdateItemInfo?.(item.id, nextProperties);
                      setIsEditingInfo(false);
                    } catch (e) {
                      setActionError(e?.message ?? "Failed to update item.");
                    } finally {
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
                item={item}
                isEditing={isEditingInfo}
                draftProperties={draftProperties}
                setDraftProperties={setDraftProperties}
              />
            );
          case "history":
            return <HistoryTab item={item} startDate={historyStartDate} endDate={historyEndDate} />;
          case "qr":
            return <QRTab item={item} />;
          default:
            return (
              <InfoTab
                item={item}
                isEditing={isEditingInfo}
                draftProperties={draftProperties}
                setDraftProperties={setDraftProperties}
              />
            );
        }
      }, [selectedTab, item, isEditingInfo, draftProperties, historyStartDate, historyEndDate]);
    
    return(
      <ViewModal visible={visible} onClose={onClose} title={modalTitle} tabs={tabs} footer={footer}>
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
                  item.id,
                  draftQuantity,
                  trimmed,
                  item?.quantity ?? 0,
                  item?.warehouse_id,
                  
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