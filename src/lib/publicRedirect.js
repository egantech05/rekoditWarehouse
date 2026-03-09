let pendingPublicToken = null;

export function setPendingPublicToken(token) {
  pendingPublicToken = token ? String(token) : null;
}

export function consumePendingPublicToken() {
  const token = pendingPublicToken;
  pendingPublicToken = null;
  return token;
}

let pendingAuthItem = null;

export function setPendingAuthItem(item) {
  pendingAuthItem = item ?? null;
}

export function consumePendingAuthItem() {
  const item = pendingAuthItem;
  pendingAuthItem = null;
  return item;
}