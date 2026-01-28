const STORAGE_KEY = "bmv_client_id";
const COOKIE_NAME = "bmv_client_id";
const COOKIE_OPTIONS = "max-age=31536000; path=/; sameSite=Lax";

const createClientId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return [...Array(32)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
};

const readCookie = (name: string) => {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[-.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]+)`)
  );
  return match ? match[1] : null;
};

export const getClientId = () => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    let clientId =
      window.localStorage.getItem(STORAGE_KEY) ?? readCookie(COOKIE_NAME);
    if (!clientId) {
      clientId = createClientId();
      window.localStorage.setItem(STORAGE_KEY, clientId);
      document.cookie = `${COOKIE_NAME}=${clientId}; ${COOKIE_OPTIONS}`;
    } else {
      window.localStorage.setItem(STORAGE_KEY, clientId);
      document.cookie = `${COOKIE_NAME}=${clientId}; ${COOKIE_OPTIONS}`;
    }
    return clientId;
  } catch {
    return null;
  }
};
