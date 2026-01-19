import { refreshSessionOrThrow, restRequest, restFirst } from "../supabase";





export const ITEMS_PAGE_SIZE = 50;

export async function fetchItemsPage({ warehouseId, from = 0, to = ITEMS_PAGE_SIZE - 1 }) {
  if (!warehouseId) return { items: [], nextFrom: from };
  const limit = to - from + 1;

  const data = await restRequest({
    path: "items",
    params: {
      select: "id,name,quantity,template_id,created_at,properties,warehouse_id",
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
      select: "*,templates(properties)",
      id: `eq.${itemId}`,
      limit: "1",
    },
  });

  return restFirst(rows);
}



export async function createItem({ warehouseId, templateId, name, quantity = 0, properties }) {
  const insertRow = { warehouse_id: warehouseId, template_id: templateId, name, quantity, properties };
  await refreshSessionOrThrow();


  try {
    await restRequest({ method: "POST", path: "items", body: insertRow });
  } catch (e) {
    if (String(e?.message ?? "").includes("properties")) {
      const { properties: _properties, ...baseRow } = insertRow;
      await restRequest({ method: "POST", path: "items", body: baseRow });
      return;
    }
    throw e;
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


  const rows = await restRequest({
    method: "PATCH",
    path: "items",
    params: { id: `eq.${itemId}`, select: "*" },
    body: { properties: nextProperties },
    preferReturn: true,
    signal,
  });

  const data = restFirst(rows);


  console.log("[items][updateItemProperties] success", { itemId, hasData: !!data });
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
