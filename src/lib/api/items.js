import { refreshSessionOrThrow, restRequest, restFirst } from "../supabase";





export const ITEMS_PAGE_SIZE = 50;

export async function fetchItemsPage({ warehouseId, from = 0, to = ITEMS_PAGE_SIZE - 1 }) {
  if (!warehouseId) return { items: [], nextFrom: from };
  const limit = to - from + 1;

  const data = await restRequest({
    path: "items",
    params: {
      select: "id,name,quantity,template_id,created_at,warehouse_id,item_property_values(property_id,value)",
      warehouse_id: `eq.${warehouseId}`,
      order: "created_at.desc",
      limit: String(limit),
      offset: String(from),
    },
  });

  const items = Array.isArray(data) ? data : [];
  return { items, nextFrom: from + items.length };
}


export async function fetchItemDetail({ itemId }) {
  if (!itemId) return null;

  const rows = await restRequest({
    path: "items",
    params: {
      select: "*,item_property_values(property_id,value),templates(template_properties(id,name,position))",

      id: `eq.${itemId}`,
      limit: "1",
    },
  });

  

  const item = restFirst(rows);
  if (item?.templates?.template_properties) {
    item.templates.template_properties = item.templates.template_properties
      .slice()
      .sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0));
  }
  return item;
  
}



export async function createItem({ warehouseId, templateId, name, quantity = 0, properties }) {
  const insertRow = { warehouse_id: warehouseId, template_id: templateId, name, quantity };
  await refreshSessionOrThrow();

  const rows = await restRequest({
    method: "POST",
    path: "items",
    params: { select: "id" },
    body: insertRow,
    preferReturn: true,
  });

  const item = restFirst(rows);
  const itemId = item?.id;
  if (!itemId) return;

  const entries = properties && typeof properties === "object" ? Object.entries(properties) : [];
  const values = entries.map(([propertyId, value]) => ({
    item_id: itemId,
    property_id: propertyId,
    value: value == null || String(value).trim() === "" ? null : String(value),
  }));

  if (values.length) {
    await restRequest({
      method: "POST",
      path: "item_property_values",
      body: values,
    });
  }
}


export async function adjustItemQuantity({ itemId, warehouseId, actorId, deltaInput, prevQuantity, note }) {
  const safePrevQuantity = Math.max(0, Math.trunc(Number(prevQuantity) || 0));
  const safeDelta = Math.trunc(Number(deltaInput) || 0);

  const nextQuantity = Math.max(0, safePrevQuantity + safeDelta);
  const appliedDelta = nextQuantity - safePrevQuantity;

  if (!warehouseId) throw new Error("Missing warehouse_id.");
  if (!actorId) throw new Error("Missing user.");

  const trimmedNote = String(note ?? "").trim();
  await refreshSessionOrThrow();

  if (!trimmedNote) throw new Error("Notes are required.");

  if (appliedDelta !== 0) {

    await restRequest({
      method: "POST",
      path: "item_events",
      body: {
        warehouse_id: warehouseId,
        item_id: itemId,
        delta: appliedDelta,
        event_type: "adjust",
        note: trimmedNote,
        actor_id: actorId,
      },
    });




  }


  const rows = await restRequest({
    method: "PATCH",
    path: "items",
    params: { id: `eq.${itemId}`, select: "*" },
    body: { quantity: nextQuantity },
    preferReturn: true,
  });

  const data = restFirst(rows);


  

  return { item: data ?? null, nextQuantity };
}

export async function updateItemProperties({ itemId, nextProperties, signal }) {
  console.log("[items][updateItemProperties] start", {
    itemId,
    keys: Object.keys(nextProperties ?? {}),
  });

  await refreshSessionOrThrow();

  const entries = nextProperties && typeof nextProperties === "object" ? Object.entries(nextProperties) : [];
  const rows = entries.map(([propertyId, value]) => ({
    item_id: itemId,
    property_id: propertyId,
    value: value == null || String(value).trim() === "" ? null : String(value),
  }));

  if (!rows.length) return null;

  const data = await restRequest({
    method: "POST",
    path: "item_property_values",
    params: { on_conflict: "item_id,property_id" },
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: rows,
    signal,
  });

  console.log("[items][updateItemProperties] success", { itemId, updatedCount: data?.length ?? 0 });
  return data ?? null;
}



export async function deleteItem({ itemId }) {
  await refreshSessionOrThrow();

  await restRequest({
    method: "DELETE",
    path: "items",
    params: { id: `eq.${itemId}` },
  });

}
