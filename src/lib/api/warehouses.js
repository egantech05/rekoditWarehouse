import { refreshSessionOrThrow, restRequest, restFirst } from "../supabase";



const REQUEST_TIMEOUT_MS = 15000;



export async function fetchWarehouses({ createdBy } = {}) {
  const params = {
    select: "id,name,created_at",
    order: "created_at.desc",
  };
  if (createdBy) params.created_by = `eq.${createdBy}`;

  const data = await restRequest({ path: "warehouses", params });
  return Array.isArray(data) ? data : [];
}



export async function createWarehouse({ name, createdBy }) {
  await restRequest({
    method: "POST",
    path: "warehouses",
    body: { name, created_by: createdBy },
  });

}

export async function fetchWarehouseRole({ warehouseId, userId }) {
  const rows = await restRequest({
    path: "warehouse_members",
    params: {
      select: "role",
      warehouse_id: `eq.${warehouseId}`,
      user_id: `eq.${userId}`,
      limit: "1",
    },
  });

  return restFirst(rows)?.role ?? null;
}


export async function fetchLatestWarehouseId() {
  const rows = await restRequest({
    path: "warehouses",
    params: {
      select: "id,created_at",
      order: "created_at.desc",
      limit: "1",
    },
  });

  return restFirst(rows)?.id ?? null;
}


