import QRCode from "qrcode";
import shortIdTable from "@/content/blog-short-ids.json";
import { SITE_URL } from "@/lib/constants";
import { INDEX_ID, TABLE_SENTINEL_KEY, blogQrImagePath, blogQrUrl, shortIdFor } from "@/lib/storeNaming.mjs";

const SHORT_IDS: Record<string, string> = shortIdTable;

// 記事（slug なしなら一覧）の QR 画像のパス。画像は app/blog-qr/[file]/route.ts がビルド時に作る。
export function blogQrSrc(slug?: string): string {
  return blogQrImagePath(shortIdFor(slug, SHORT_IDS));
}

// ビルド時に作る QR の短い ID（全記事＋一覧）。
export function allQrShortIds(): string[] {
  const ids = Object.entries(SHORT_IDS)
    .filter(([key]) => key !== TABLE_SENTINEL_KEY)
    .map(([, id]) => id);
  return [...ids, INDEX_ID];
}

// QR の SVG。行き先は /download?from=blog_<短いID>（端末を見てストアに振り分け、読み取り元を数える）。
export async function blogQrSvg(shortId: string): Promise<string> {
  try {
    return await QRCode.toString(blogQrUrl(SITE_URL, shortId), {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 2,
      color: { dark: "#16130f", light: "#ffffff" },
    });
  } catch (error) {
    throw new Error(`QR コードを作れませんでした（${shortId}）: ${String(error)}`);
  }
}
