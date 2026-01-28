const COOKIE_NAME = "bmv_client_id";

export const parseCookies = (cookieHeader: string | null) => {
  if (!cookieHeader) {
    return {};
  }
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((entry) => entry.trim().split("="))
      .map(([key, ...value]) => [key, value.join("=")])
  );
};

export const readClientId = (request: Request, fallback?: string | null) => {
  const cookies = parseCookies(request.headers.get("cookie"));
  return (cookies[COOKIE_NAME] ?? fallback) || null;
};
