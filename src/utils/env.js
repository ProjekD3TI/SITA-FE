/**
 * Utility untuk mendapatkan environment variables secara dinamis.
 * Memprioritaskan variabel runtime yang dimount dari server (.env melalui /env.txt),
 * dengan fallback ke environment variable saat build (import.meta.env).
 */
export function getEnv(key, fallback = "") {
  if (typeof window !== "undefined" && window.__ENV__ && window.__ENV__[key] !== undefined) {
    return window.__ENV__[key];
  }
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key] !== undefined) {
    return import.meta.env[key];
  }
  return fallback;
}
