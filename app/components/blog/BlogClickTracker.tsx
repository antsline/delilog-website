"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

type Props = {
  slug: string;
};

// 記事内のApp Storeリンク・テンプレDLリンクのクリックを計測する。
// CTA位置は最近傍の [data-cta] 属性（dlbox / inline-N / article-end / footer-link / sticky-bar）から判定。
export function BlogClickTracker({ slug }: Props) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as Element | null;
      const anchor = target?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      const cta = anchor.closest("[data-cta]")?.getAttribute("data-cta") ?? "body";

      if (anchor.href.includes("apps.apple.com")) {
        track("app_store_click", { slug, cta });
        return;
      }

      if (/\.(pdf|xlsx)$/.test(anchor.pathname)) {
        const file = anchor.pathname.split("/").pop() ?? anchor.pathname;
        track("template_download", { slug, file });
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [slug]);

  return null;
}
