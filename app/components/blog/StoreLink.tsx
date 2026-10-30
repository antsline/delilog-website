"use client";

import type { AnchorHTMLAttributes } from "react";
import { usePathname } from "next/navigation";
import { campaignFromBlogPath } from "@/lib/storeCampaign";
import { useStoreUrl } from "@/lib/useStoreUrl";

// 端末に応じて App Store / Google Play に振り分けるリンク（サーバーコンポーネントから使う用）。
export function StoreLink(props: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const storeUrl = useStoreUrl(campaignFromBlogPath(usePathname()));
  return <a {...props} href={storeUrl} />;
}
