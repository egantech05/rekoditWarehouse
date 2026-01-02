import { supabase } from "../supabase";

const REQUEST_TIMEOUT_MS = 15000;

function withTimeout(promise, ms, label) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

export async function fetchWarehouses({ createdBy } = {}) {
  let q = supabase.from("warehouses").select("id, name, created_at").order("created_at", { ascending: false });
  if (createdBy) q = q.eq("created_by", createdBy);

  const { data, error } = await withTimeout(q, REQUEST_TIMEOUT_MS, "fetchWarehouses");

  if (error) throw error;
  return data ?? [];
}

export async function createWarehouse({ name, createdBy }) {
  const { error } = await supabase.from("warehouses").insert({ name, created_by: createdBy });
  if (error) throw error;
}

export async function fetchWarehouseRole({ warehouseId, userId }) {
  const { data, error } = await withTimeout(
    supabase
      .from("warehouse_members")
      .select("role")
      .eq("warehouse_id", warehouseId)
      .eq("user_id", userId)
      .maybeSingle(),
    REQUEST_TIMEOUT_MS,
    "fetchWarehouseRole"
  );

  if (error) throw error;
  return data?.role ?? null;
}

export async function fetchLatestWarehouseId() {
  const { data, error } = await supabase
    .from("warehouses")
    .select("id, created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.id ?? null;
}

