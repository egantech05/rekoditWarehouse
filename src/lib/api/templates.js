import { refreshSessionOrThrow, restRequest, restFirst } from "../supabase";






export const TEMPLATES_PAGE_SIZE = 50;

const normalizeTemplateProperties = (properties = []) =>
  (Array.isArray(properties) ? properties : [])
    .map((p, idx) => {
      if (typeof p === "string") {
        return { id: null, name: p, position: idx + 1 };
      }
      return {
        id: p?.id ?? null,
        name: p?.name ?? "",
        position: p?.position ?? idx + 1,
      };
    })
    .map((p) => ({ ...p, name: String(p.name ?? "").trim() }))
    .filter((p) => p.name);


    export async function fetchTemplatesPage({ warehouseId, from = 0, to = TEMPLATES_PAGE_SIZE - 1 }) {
      if (!warehouseId) return { templates: [], nextFrom: from };
      const limit = to - from + 1;
    
      const data = await restRequest({
        path: "templates",
        params: {
          select: "id,name,warehouse_id,created_at,template_properties(id,name,position)",
          warehouse_id: `eq.${warehouseId}`,
          order: "id.asc",
          limit: String(limit),
          offset: String(from),
        },
      });
    
      const templates = (Array.isArray(data) ? data : []).map((t) => ({
        ...t,
        template_properties: (Array.isArray(t?.template_properties) ? t.template_properties : [])
          .slice()
          .sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0)),
      }));
      return { templates, nextFrom: from + templates.length };
    }
    



    export async function fetchTemplatesForItemCreation({ warehouseId }) {
      if (!warehouseId) return [];
    
      const data = await restRequest({
        path: "templates",
        params: {
          select: "id,name,warehouse_id,template_properties(id,name,position)",
          warehouse_id: `eq.${warehouseId}`,
        },
      });
    
      return (Array.isArray(data) ? data : []).map((t) => ({
        ...t,
        template_properties: (Array.isArray(t?.template_properties) ? t.template_properties : [])
          .slice()
          .sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0)),
      }));
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

  const rows = await restRequest({
    method: "POST",
    path: "templates",
    params: { select: "id,name,warehouse_id" },
    body: { name, warehouse_id: warehouseId },
    preferReturn: true,
  });

  const template = restFirst(rows);
  if (!template?.id) return;

  const normalized = normalizeTemplateProperties(properties);
  const toInsert = normalized.map((p) => ({
    template_id: template.id,
    name: p.name,
    position: p.position,
  }));

  if (toInsert.length) {
    await restRequest({
      method: "POST",
      path: "template_properties",
      body: toInsert,
    });
  }
}


export async function updateTemplate({ templateId, name, properties }) {
  await refreshSessionOrThrow();

  await restRequest({
    method: "PATCH",
    path: "templates",
    params: { id: `eq.${templateId}` },
    body: { name },
  });

  const normalized = normalizeTemplateProperties(properties);

  const current = await restRequest({
    path: "template_properties",
    params: { select: "id", template_id: `eq.${templateId}` },
  });

  const keepIds = new Set(normalized.filter((p) => p.id).map((p) => p.id));
  const toDeleteIds = (Array.isArray(current) ? current : [])
    .map((r) => r.id)
    .filter((id) => !keepIds.has(id));

  if (toDeleteIds.length) {
    await restRequest({
      method: "DELETE",
      path: "template_properties",
      params: { id: `in.(${toDeleteIds.join(",")})` },
    });
  }

  const toUpsert = normalized
    .filter((p) => p.id)
    .map((p) => ({ id: p.id, template_id: templateId, name: p.name, position: p.position }));

  if (toUpsert.length) {
    await restRequest({
      method: "POST",
      path: "template_properties",
      params: { on_conflict: "id" },
      headers: { Prefer: "resolution=merge-duplicates" },
      body: toUpsert,
    });
  }

  const toInsert = normalized
    .filter((p) => !p.id)
    .map((p) => ({ template_id: templateId, name: p.name, position: p.position }));

  if (toInsert.length) {
    await restRequest({
      method: "POST",
      path: "template_properties",
      body: toInsert,
    });
  }

  const full = await restRequest({
    path: "templates",
    params: {
      select: "id,name,warehouse_id,template_properties(id,name,position)",
      id: `eq.${templateId}`,
      limit: "1",
    },
  });

  return restFirst(full);
}



export async function deleteTemplate({ templateId }) {
  await refreshSessionOrThrow();
  await restRequest({
    method: "DELETE",
    path: "templates",
    params: { id: `eq.${templateId}` },
  });

}
