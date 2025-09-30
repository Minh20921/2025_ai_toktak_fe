type SessionStoredItem<T> = { value: T; expiry: number };

const setSessionWithExpiry = <T>(key: string, value: T, ttlMs: number) => {
  try {
    const item: SessionStoredItem<T> = { value, expiry: Date.now() + ttlMs };
    sessionStorage.setItem(key, JSON.stringify(item));
  } catch (e) {}
};

const getSessionWithExpiry = <T>(key: string): T | null => {
  try {
    const itemStr = sessionStorage.getItem(key);
    if (!itemStr) return null;
    const item = JSON.parse(itemStr) as SessionStoredItem<T>;
    if (!item || typeof item.expiry !== 'number' || Date.now() > item.expiry) {
      sessionStorage.removeItem(key);
      return null;
    }
    return item.value as T;
  } catch (e) {
    try {
      sessionStorage.removeItem(key);
    } catch (err) {}
    return null;
  }
};

export { getSessionWithExpiry, setSessionWithExpiry, type SessionStoredItem };
