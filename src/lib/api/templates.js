import { refreshSessionOrThrow, restRequest, restFirst } from "../supabase";






export const TEMPLATES_PAGE_SIZE = 50;

export async function fetchTemplatesPage({ warehouseId, from = 0, to = TEMPLATES_PAGE_SIZE - 1 }) {
  if (!warehouseId) return { templates: [], nextFrom: from };
  const limit = to - from + 1;

  const data = await restRequest({
    path: "templates",
    params: {
      select: "*",
      warehouse_id: `eq.${warehouseId}`,
      order: "id.asc",
      limit: String(limit),
      offset: String(from),
    },
  });

  const templates = Array.isArray(data) ? data : [];
  return { templates, nextFrom: from + templates.length };
}




export async function fetchTemplatesForItemCreation({ warehouseId }) {
  if (!warehouseId) return [];

  const data = await restRequest({
    path: "templates",
    params: {
      select: "*",
      warehouse_id: `eq.${warehouseId}`,
    },
  });

  return Array.isArray(data) ? data : [];
}


export async function warehouseHasTemplates({ warehouseId }) {
  if (!warehouseId) return null;

  const data = await restRequest({
    path: "templates",
    params: {
      select: "id",
      warehouse_id: `eq.${warehouseId}`,
      limit: "1",
    },
  });

  return (Array.isArray(data) ? data : []).length > 0;
}


export async function createTemplate({ warehouseId, name, properties }) {
  await refreshSessionOrThrow();

  await restRequest({
    method: "POST",
    path: "templates",
    body: { name, warehouse_id: warehouseId, properties },
  });

}

export async function updateTemplate({ templateId, name, properties }) {
  await refreshSessionOrThrow();

  const rows = await restRequest({
    method: "PATCH",
    path: "templates",
    params: { id: `eq.${templateId}`, select: "*" },
    body: { name, properties },
    preferReturn: true,
  });

  return restFirst(rows);
}


export async function deleteTemplate({ templateId }) {
  await refreshSessionOrThrow();
  await restRequest({
    method: "DELETE",
    path: "templates",
    params: { id: `eq.${templateId}` },
  });

}
