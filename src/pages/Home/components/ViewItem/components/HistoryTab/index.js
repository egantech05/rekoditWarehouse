import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";

import React, { useEffect, useRef, useState } from "react";
import { colors } from "../../../../../../assets/styles";

import { supabase } from "../../../../../../lib/supabase";
import { useAuth } from "../../../../../../auth/AuthContext";
import { fetchProfilesByUserIds } from "../../../../../../lib/api/profiles";
import { fetchItemEvents } from "../../../../../../lib/api/itemEvents";





const ITEM_EVENTS_TIMEOUT_MS = 10000;
const withFallbackTimeout = (promise, ms) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("fetchItemEvents timed out")), ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });



import LogDisplay from "./components/LogDisplay";

export default function HistoryTab({ item, startDate, endDate }) {
  const [events, setEvents] = useState([]);
  const [eventsError, setEventsError] = useState("");
  const { session } = useAuth();
  const [eventsLoading, setEventsLoading] = useState(false);




  const actorNameCacheRef = useRef(new Map());


  useEffect(() => {
    let ignore = false;
  
    const load = async () => {
  
      if (!item?.id) {
        setEventsError("");
        setEvents([]);
        setEventsLoading(false);
  
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
        setEventsLoading(false);
        setEventsError("");
        setEventsLoading(true);

  
        const accessToken = session?.access_token;
        if (!accessToken) {
          setEventsError("No access token.");
          return;
        }
    
        const rows = await fetchItemEvents(
          {
            itemId: item.id,
            warehouseId: item?.warehouse_id,
            startISO,
            endISO,
          },
          accessToken
        );

  
  
        if (ignore) return;
  
  
        const actorIds = [...new Set(rows.map((r) => r?.actor_id).filter(Boolean))];
        const missingIds = actorIds.filter((id) => !actorNameCacheRef.current.has(id));
  
        if (missingIds.length) {
          try {

  
            const accessToken = session?.access_token;
            if (!accessToken) {
              setEventsError("No access token.");
              return;
            }
  
            const url = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/profiles?select=user_id,full_name&user_id=in.(${missingIds.join(",")})`;
            const resp = await fetch(url, {
              headers: {
                apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
                Authorization: `Bearer ${accessToken}`,
              },
            });
  
            const bodyText = await resp.text();

  
            if (!resp.ok) {
              throw new Error(`profiles fetch ${resp.status}`);
            }
  
            const profiles = await fetchProfilesByUserIds(missingIds, accessToken);

            if (ignore) return;
  
            for (const p of profiles) {
              actorNameCacheRef.current.set(p.user_id, p.full_name);
            }
          } catch (e) {

            if (ignore) return;
            setEventsError(e?.message ?? "Failed to load history.");
            setEvents([]);
            return;
          }
        }
  
  
        setEventsError("");
        setEvents(rows.map((r) => ({ ...r, actor_name: actorNameCacheRef.current.get(r.actor_id) ?? "" })));
      } catch (e) {
        if (ignore) return;
        setEventsError(e?.message ?? "Failed to load history.");
        setEvents([]);
      } finally {
        if (!ignore) setEventsLoading(false);
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
    {eventsLoading ? (
      <ActivityIndicator size="small" color={colors.brandHighlight} />
    ) : events.length === 0 ? (
      <Text style={{ color: colors.greyText }}>No history yet.</Text>
    ) : null}


    {!eventsLoading &&
      events.map((ev) => (
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