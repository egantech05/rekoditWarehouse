import { supabase } from "../supabase";

export async function fetchTemplates({ warehouseId }) {
  if (!warehouseId) return [];
  const { data, error } = await supabase.from("templates").select("*").eq("warehouse_id", warehouseId);
  if (error) throw error;
  return data ?? [];
}

export async function fetchTemplatesForItemCreation({ warehouseId }) {
  if (!warehouseId) return [];
  const { data, error } = await supabase
    .from("templates")
    .select("id, name, properties")
    .eq("warehouse_id", warehouseId);

  if (error) throw error;
  return data ?? [];
}

export async function warehouseHasTemplates({ warehouseId }) {
  if (!warehouseId) return null;

  const { data, error } = await supabase.from("templates").select("id").eq("warehouse_id", warehouseId).limit(1);
  if (error) throw error;
  return (data ?? []).length > 0;
}

export async function createTemplate({ warehouseId, name, properties }) {
  const { error } = await supabase.from("templates").insert({ name, warehouse_id: warehouseId, properties });
  if (error) throw error;
}

export async function updateTemplate({ templateId, name, properties }) {
  const { data, error } = await supabase
    .from("templates")
    .update({ name, properties })
    .eq("id", templateId)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

export async function deleteTemplate({ templateId }) {
  const { error } = await supabase.from("templates").delete().eq("id", templateId);
  if (error) throw error;
}
