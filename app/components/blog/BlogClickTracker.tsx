"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

type Props = {
  slug: string;
  // トップページでは入口の名前（例: lp_app_share）も送る。
  campaign?: string;
};

// 記事内のApp Store / Google Playリンク・テンプレDLリンクのクリックを計測する。
// トップページでも slug="top" で使う。
// CTA位置は最近傍の [data-cta] 属性（記事: dlbox / inline-N / article-end / footer-link / sticky-bar、
// トップ: header / mobile-menu / hero / pricing / final）から判定。
export function BlogClickTracker({ slug, campaign }: Props) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as Element | null;
      const anchor = target?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      const cta = anchor.closest("[data-cta]")?.getAttribute("data-cta") ?? "body";

      if (anchor.href.includes("apps.apple.com")) {
        track("app_store_click", { slug, cta, ...(campaign && { campaign }) });
        return;
      }

      if (anchor.href.includes("play.google.com")) {
        track("google_play_click", { slug, cta, ...(campaign && { campaign }) });
        return;
      }

      if (/\.(pdf|xlsx)$/.test(anchor.pathname)) {
        const file = anchor.pathname.split("/").pop() ?? anchor.pathname;
        track("template_download", { slug, file });
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [slug, campaign]);

  return null;
}
