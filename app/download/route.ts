import { NextResponse, type NextRequest } from "next/server";
import { track } from "@vercel/analytics/server";
import { buildStoreRedirect, detectPlatform, normalizeSource } from "@/lib/storeRedirect";

// QR コード（テンプレートの PDF・PC 表示のカード）の行き先。
// 端末を見て App Store / Google Play / LP に振り分け、どの QR から来たかを数える。
export async function GET(request: NextRequest) {
  const source = normalizeSource(request.nextUrl.searchParams.get("from"));
  const platform = detectPlatform(request.headers.get("user-agent") ?? "");

  try {
    await track("qr_download", { from: source, platform }, { headers: request.headers });
  } catch (error) {
    // 計測の失敗で読み取った人を止めない
    console.error("qr_download tracking failed:", error);
  }

  const target = buildStoreRedirect(platform, source);
  return NextResponse.redirect(new URL(target, request.url), 302);
}
