import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { colors } from "../../../../../../assets/styles"

import { fetchItemEvents } from "../../../../../../lib/api/itemEvents";
import { fetchProfilesByUserIds } from "../../../../../../lib/api/profiles";


import LogDisplay from "./components/LogDisplay";

export default function HistoryTab({ item, startDate, endDate }) {
  const [events, setEvents] = useState([]);
  const [eventsError, setEventsError] = useState("");

  const actorNameCacheRef = useRef(new Map());


useEffect(() => {
  let ignore = false;

  const load = async () => {
    if (!item?.id) {
      setEventsError("");
      setEvents([]);
      return;
    }
    
    const startISO = startDate
      ? (() => {
          const d = new Date(startDate);
          d.setHours(0, 0, 0, 0);
          return d.toISOString();
        })()
      : null;
    
    const endISO = endDate
      ? (() => {
          const d = new Date(endDate);
          d.setHours(23, 59, 59, 999);
          return d.toISOString();
        })()
      : null;
    try {
      const rows = await fetchItemEvents({
        itemId: item.id,
        warehouseId: item?.warehouse_id,
        startISO,
        endISO,
      });
    
      if (ignore) return;
    
      const actorIds = [...new Set(rows.map((r) => r?.actor_id).filter(Boolean))];
      const missingIds = actorIds.filter((id) => !actorNameCacheRef.current.has(id));
    
      if (missingIds.length) {
        try {
          const profiles = await fetchProfilesByUserIds(missingIds);
          if (ignore) return;
    
          for (const p of profiles) {
            actorNameCacheRef.current.set(p.user_id, p.full_name);
          }
        } catch (e) {
          // Optional lookup; ignore failures
        }
      }
    
      setEventsError("");
      setEvents(rows.map((r) => ({ ...r, actor_name: actorNameCacheRef.current.get(r.actor_id) ?? "" })));
    } catch (e) {
      if (ignore) return;
      console.warn("load item_events failed:", e);
      setEventsError(e?.message ?? "Failed to load history.");
      setEvents([]);
    }

  };

  load();
  return () => {
    ignore = true;
  };
}, [item?.id, item?.warehouse_id, startDate, endDate]);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
    {!!eventsError && <Text style={{ color: colors.red }}>{eventsError}</Text>}
    {!eventsError && events.length === 0 ? (
      <Text style={{ color: colors.greyText }}>No history yet.</Text>
    ) : null}
    {events.map((ev) => (
      <LogDisplay key={ev.id} event={ev} />
    ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap:4,
  },

});