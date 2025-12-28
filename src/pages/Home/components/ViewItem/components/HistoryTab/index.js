import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../../../../../assets/styles"
import { supabase } from "../../../../../../lib/supabase";

import LogDisplay from "./components/LogDisplay";

export default function HistoryTab({ item, startDate, endDate }) {
  const [events, setEvents] = useState([]);
  const [eventsError, setEventsError] = useState("");


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
  
  let q = supabase
    .from("item_events")
    .select("id, delta, event_type, note, actor_id, created_at")
    .eq("item_id", item.id);
  
  if (item?.warehouse_id) q = q.eq("warehouse_id", item.warehouse_id);
  if (startISO) q = q.gte("created_at", startISO);
  if (endISO) q = q.lte("created_at", endISO);
  
  q = q.order("created_at", { ascending: false });
  
  const { data, error } = await q;
  if (!ignore) {
    if (error) {
      console.warn("load item_events failed:", error);
      setEventsError(error?.message ?? "Failed to load history.");
      setEvents([]);
    } else {
      setEventsError("");
      const rows = data ?? [];

      const actorIds = [...new Set(rows.map((r) => r?.actor_id).filter(Boolean))];
      
      let actorNames = {};
      if (actorIds.length) {
        const { data: profileRows, error: profileError } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", actorIds);
      
        if (!profileError) {
          actorNames = Object.fromEntries((profileRows ?? []).map((p) => [p.user_id, p.full_name]));
        }
      }
      
      setEvents(rows.map((r) => ({ ...r, actor_name: actorNames[r.actor_id] ?? "" })));
    }
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