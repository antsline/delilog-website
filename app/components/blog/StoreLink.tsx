"use client";

import type { AnchorHTMLAttributes } from "react";
import { useStoreUrl } from "@/lib/useStoreUrl";

// 端末に応じて App Store / Google Play に振り分けるリンク（サーバーコンポーネントから使う用）。
export function StoreLink(props: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const storeUrl = useStoreUrl();
  return <a {...props} href={storeUrl} />;
}
