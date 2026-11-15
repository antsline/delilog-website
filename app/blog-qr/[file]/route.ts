import { allQrShortIds, blogQrSvg } from "@/lib/blogQr";
import { shortIdFromQrFile } from "@/lib/storeNaming.mjs";

// 記事ごとの QR 画像（/blog-qr/<短いID>.svg）。ビルド時に全記事＋一覧の分を作る。
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return allQrShortIds().map((id) => ({ file: `${id}.svg` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const shortId = shortIdFromQrFile(file);
  if (!shortId) {
    return new Response("Not Found", { status: 404 });
  }
  return new Response(await blogQrSvg(shortId), {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
  });
}
