export const normalizeSearch = (value) => String(value ?? "").trim().toLowerCase();

export const toSearchText = (value) => {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.filter(Boolean).join(" ");
  if (typeof value === "object") return Object.values(value).filter(Boolean).join(" ");
  return String(value);
};

export const buildSearchHaystack = (...parts) => parts.map(toSearchText).filter(Boolean).join(" ");

export const filterBySearch = (list, searchText, getHaystack) => {
  const needle = normalizeSearch(searchText);
  const arr = Array.isArray(list) ? list : [];
  if (!needle) return arr;
  return arr.filter((item) => normalizeSearch(getHaystack(item)).includes(needle));
};