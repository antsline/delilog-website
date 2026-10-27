import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/constants";

export type StorePlatform = "android" | "ios" | "other";

const SOURCE_PATTERN = /^[a-z0-9_-]{1,32}$/;

// QR コードの読み取り元（例: "template_tenko"）。想定外の値は unknown にまとめる。
export function normalizeSource(raw: string | null): string {
  return raw && SOURCE_PATTERN.test(raw) ? raw : "unknown";
}

export function detectPlatform(userAgent: string): StorePlatform {
  if (/android/i.test(userAgent)) {
    return "android";
  }
  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return "ios";
  }
  return "other";
}

// 端末ごとの行き先。PC など判別できない端末は、両方のストアのボタンがある LP に送る。
export function buildStoreRedirect(platform: StorePlatform, source: string): string {
  if (platform === "android") {
    const referrer = encodeURIComponent(`utm_source=${source}&utm_medium=qr`);
    return `${GOOGLE_PLAY_URL}&referrer=${referrer}`;
  }
  if (platform === "ios") {
    return APP_STORE_URL;
  }
  return `/?utm_source=${source}&utm_medium=qr`;
}
