import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from "react-native";


import React, { useEffect, useRef, useState } from "react";
import { colors } from "../../../../../../assets/styles";

import { supabase } from "../../../../../../lib/supabase";
import { useAuth } from "../../../../../../auth/AuthContext";
import { fetchProfilesByUserIds } from "../../../../../../lib/api/profiles";
import { fetchItemEvents, ITEM_EVENTS_PAGE_SIZE } from "../../../../../../lib/api/itemEvents";
import { fetchPublicItemHistoryByToken, PUBLIC_ITEM_HISTORY_PAGE_SIZE } from "../../../../../../lib/api/publicClient";






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

export default function HistoryTab({ item, startDate, endDate, readOnly = false }) {

  const [events, setEvents] = useState([]);
  const [eventsError, setEventsError] = useState("");
  const { session } = useAuth();
  const [eventsLoading, setEventsLoading] = useState(false);

  const [eventsPaging, setEventsPaging] = useState(false);
  const [eventsPagingError, setEventsPagingError] = useState("");
  const [eventsNextFrom, setEventsNextFrom] = useState(0);
  const [hasMoreEvents, setHasMoreEvents] = useState(true);

  const isPublic = !!readOnly;
  const publicToken = item?.public_token ?? null;


  const attachActorNames = async (rows, accessToken) => {
    const actorIds = [...new Set(rows.map((r) => r?.actor_id).filter(Boolean))];
    const missingIds = actorIds.filter((id) => !actorNameCacheRef.current.has(id));

    if (missingIds.length) {
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
      for (const p of profiles) {
        actorNameCacheRef.current.set(p.user_id, p.full_name);
      }
    }

    return rows.map((r) => ({ ...r, actor_name: actorNameCacheRef.current.get(r.actor_id) ?? "" }));
  };





  const actorNameCacheRef = useRef(new Map());


  useEffect(() => {
    let ignore = false;
  
    const load = async () => {
  
      if (!item?.id) {
        setEventsError("");
        setEvents([]);
        setEventsLoading(false);
        setEventsNextFrom(0);
        setHasMoreEvents(true);
        setEventsPagingError("");
  
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

        if (isPublic) {
          if (!publicToken) {
            setEventsError("Missing public token.");
            setEvents([]);
            setEventsLoading(false);
            setEventsNextFrom(0);
            setHasMoreEvents(true);
            setEventsPagingError("");
            return;
          }
  
          try {
            setEventsLoading(false);
            setEventsError("");
            setEventsLoading(true);
  
            const { events: rows, nextFrom } = await fetchPublicItemHistoryByToken({
              publicToken,
              from: 0,
              to: PUBLIC_ITEM_HISTORY_PAGE_SIZE - 1,
            });
  
            if (ignore) return;
  
            setEventsError("");
            setEvents(rows);
            setEventsNextFrom(nextFrom ?? rows.length);
            setHasMoreEvents(rows.length === PUBLIC_ITEM_HISTORY_PAGE_SIZE);
            setEventsPagingError("");
          } catch (e) {
            if (ignore) return;
            setEventsError(e?.message ?? "Failed to load history.");
            setEvents([]);
          } finally {
            if (!ignore) setEventsLoading(false);
          }
  
          return;
        }
  
      try {
        setEventsLoading(false);
        setEventsError("");
        setEventsLoading(true);

  
        const accessToken = session?.access_token;
        if (!accessToken) {
          setEventsError("No access token.");
          return;
        }
    
        const { events: rows, nextFrom } = await fetchItemEvents(
          {
            itemId: item.id,
            warehouseId: item?.warehouse_id,
            startISO,
            endISO,
            from: 0,
            to: ITEM_EVENTS_PAGE_SIZE - 1,
          },
          accessToken
        );

        if (ignore) return;

        const hydrated = await attachActorNames(rows, accessToken);
        if (ignore) return;

        setEventsError("");
        setEvents(hydrated);
        setEventsNextFrom(nextFrom ?? rows.length);
        setHasMoreEvents(rows.length === ITEM_EVENTS_PAGE_SIZE);
        setEventsPagingError("");


  
  
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

  const onLoadMoreEvents = async () => {
    if (eventsLoading || eventsPaging || !hasMoreEvents) return;

    if (isPublic) {
      if (!publicToken) {
        setEventsPagingError("Missing public token.");
        return;
      }

      setEventsPaging(true);
      setEventsPagingError("");
      try {
        const { events: rows, nextFrom } = await fetchPublicItemHistoryByToken({
          publicToken,
          from: eventsNextFrom,
          to: eventsNextFrom + PUBLIC_ITEM_HISTORY_PAGE_SIZE - 1,
        });

        setEvents((prev) => [...prev, ...rows]);
        const loadedCount = rows?.length ?? 0;
        setEventsNextFrom(nextFrom ?? eventsNextFrom + loadedCount);
        setHasMoreEvents(loadedCount === PUBLIC_ITEM_HISTORY_PAGE_SIZE);
      } catch (e) {
        setEventsPagingError(e?.message ?? "Failed to load more history.");
      } finally {
        setEventsPaging(false);
      }
      return;
    }

    const accessToken = session?.access_token;
    if (!accessToken) {
      setEventsPagingError("No access token.");
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

    setEventsPaging(true);
    setEventsPagingError("");
    try {
      const { events: rows, nextFrom } = await fetchItemEvents(
        {
          itemId: item.id,
          warehouseId: item?.warehouse_id,
          startISO,
          endISO,
          from: eventsNextFrom,
          to: eventsNextFrom + ITEM_EVENTS_PAGE_SIZE - 1,
        },
        accessToken
      );

      const hydrated = await attachActorNames(rows, accessToken);

      setEvents((prev) => [...prev, ...hydrated]);
      const loadedCount = rows?.length ?? 0;
      setEventsNextFrom(nextFrom ?? eventsNextFrom + loadedCount);
      setHasMoreEvents(loadedCount === ITEM_EVENTS_PAGE_SIZE);
    } catch (e) {
      setEventsPagingError(e?.message ?? "Failed to load more history.");
    } finally {
      setEventsPaging(false);
    }
  };

  

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

    {!!eventsError && <Text style={{ color: colors.red }}>{eventsError}</Text>}
    {eventsLoading ? (
      <ActivityIndicator size="small" color={colors.boldColor} />
    ) : events.length === 0 ? (
      <Text style={{ color: colors.greyText }}>No history yet.</Text>
    ) : null}


    {!eventsLoading &&
      events.map((ev) => (
        <LogDisplay key={ev.id} event={ev} />
      ))}

{hasMoreEvents && !eventsLoading && events.length > 0 && (
      <Pressable onPress={onLoadMoreEvents} disabled={eventsPaging}>
        <Text style={{ color: colors.greyText }}>
          {eventsPaging ? "Loading more..." : "Load more"}
        </Text>
      </Pressable>
    )}
    {!!eventsPagingError && <Text style={{ color: colors.red }}>{eventsPagingError}</Text>}


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap:4,
  },

});
