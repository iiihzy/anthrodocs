const DEV_MARKETING_URL = "http://localhost:3000";
const PROD_MARKETING_URL = "https://www.tokengo.com";
const DEV_APP_URL = "http://localhost:5173";
const PROD_APP_URL = "https://dashboard.tokengo.com";

function getBaseAppUrl() {
  const fromEnv =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim();
  const defaultUrl =
    process.env.NODE_ENV === "development" ? DEV_APP_URL : PROD_APP_URL;
  const base = fromEnv || defaultUrl;
  return base.replace(/\/$/, "");
}

export function getAppUrl(path = "") {
  const base = getBaseAppUrl();
  if (!path) return base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export function getMarketingUrl(path = "") {
  const fromEnv = process.env.NEXT_PUBLIC_MARKETING_URL?.trim();
  const defaultUrl =
    process.env.NODE_ENV === "development" ? DEV_MARKETING_URL : PROD_MARKETING_URL;
  const base = (fromEnv || defaultUrl).replace(/\/$/, "");
  if (!path) return base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
