"use client";

import type { AnchorHTMLAttributes } from "react";
import { usePathname } from "next/navigation";
import { blogLinkCampaign, slugFromBlogPath, type Placement } from "@/lib/storeCampaign";
import { useStoreUrl } from "@/lib/useStoreUrl";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  // 入口の印の配置名（utm_content と ct の末尾）。例: footer
  placement: Placement;
};

// 端末に応じて App Store / Google Play に振り分けるリンク（サーバーコンポーネントから使う用）。
export function StoreLink({ placement, ...props }: Props) {
  const storeUrl = useStoreUrl(blogLinkCampaign(slugFromBlogPath(usePathname()), placement));
  return <a {...props} href={storeUrl} />;
}
