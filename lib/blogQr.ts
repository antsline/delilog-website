import QRCode from "qrcode";
import shortIdTable from "@/content/blog-short-ids.json";
import { SITE_URL } from "@/lib/constants";
import { blogQrSource, shortIdFor } from "@/lib/storeNaming.mjs";

const SHORT_IDS: Record<string, string> = shortIdTable;

// 記事（slug なしなら一覧）の QR の行き先。/download が端末を見てストアに振り分け、読み取り元を数える。
export function blogQrTarget(slug?: string): string {
  return `${SITE_URL}/download?from=${blogQrSource(shortIdFor(slug, SHORT_IDS))}`;
}

// PC 表示のカードに出す QR（<img src> にそのまま入れられる data URI）。ビルド時に作る。
export async function blogQrDataUri(slug?: string): Promise<string> {
  try {
    const svg = await QRCode.toString(blogQrTarget(slug), {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 2,
      color: { dark: "#16130f", light: "#ffffff" },
    });
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  } catch (error) {
    throw new Error(`QR コードを作れませんでした（${slug ?? "blog"}）: ${String(error)}`);
  }
}
