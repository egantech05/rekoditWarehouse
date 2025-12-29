import { supabase } from "../supabase";

function withTimeout(promise, ms, label) {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
    });
  
    return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
  }

export async function fetchItems({ warehouseId }) {
  if (!warehouseId) return [];
    const { data, error } = await withTimeout(
        supabase.from("items").select("*, templates ( properties )").eq("warehouse_id", warehouseId),
        15000,
        "fetchItems"
    );

  if (error) throw error;
  return data ?? [];
}

export async function createItem({ warehouseId, templateId, name, quantity = 0, properties }) {
  const insertRow = { warehouse_id: warehouseId, template_id: templateId, name, quantity, properties };

  let { error } = await supabase.from("items").insert(insertRow);

  if (error && String(error.message ?? "").includes("properties")) {
    const { properties: _properties, ...baseRow } = insertRow;
    ({ error } = await supabase.from("items").insert(baseRow));
  }

  if (error) throw error;
}

export async function adjustItemQuantity({ itemId, warehouseId, actorId, deltaInput, prevQuantity, note }) {
  const safePrevQuantity = Math.max(0, Math.trunc(Number(prevQuantity) || 0));
  const safeDelta = Math.trunc(Number(deltaInput) || 0);

  const nextQuantity = Math.max(0, safePrevQuantity + safeDelta);
  const appliedDelta = nextQuantity - safePrevQuantity;

  if (!warehouseId) throw new Error("Missing warehouse_id.");
  if (!actorId) throw new Error("Missing user.");

  const trimmedNote = String(note ?? "").trim();
  if (!trimmedNote) throw new Error("Notes are required.");

  if (appliedDelta !== 0) {
    const { error: eventError } = await supabase.from("item_events").insert({
      warehouse_id: warehouseId,
      item_id: itemId,
      delta: appliedDelta,
      event_type: "adjust",
      note: trimmedNote,
      actor_id: actorId,
    });

    if (eventError) throw eventError;
  }

  const { data, error } = await supabase
    .from("items")
    .update({ quantity: nextQuantity })
    .eq("id", itemId)
    .select("*")
    .maybeSingle();

  if (error) throw error;

  return { item: data ?? null, nextQuantity };
}

export async function updateItemProperties({ itemId, nextProperties }) {
  const { data, error } = await supabase
    .from("items")
    .update({ properties: nextProperties })
    .eq("id", itemId)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

export async function deleteItem({ itemId }) {
  const { error } = await supabase.from("items").delete().eq("id", itemId);
  if (error) throw error;
}
