"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { blogLinkCampaign, slugFromBlogPath } from "@/lib/storeCampaign";
import { useStoreUrl } from "@/lib/useStoreUrl";

const DISMISS_KEY = "delilog-sticky-cta-dismissed";
// 「スクロールを始めたら出す」。読み込み直後（0px）は出さない
const SHOW_AFTER_SCROLL_PX = 1;
// 本文の CTA（DL ボックス・本文のカード・記事末尾のカード）が見えている間は、同じ導線を重ねて出さない。
const IN_ARTICLE_CTA_SELECTOR = '[data-cta="dlbox"], [data-cta="top"], [data-cta^="inline-"], [data-cta="article-end"]';

function readDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

function useScrolled(): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY >= SHOW_AFTER_SCROLL_PX);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrolled;
}

function useInArticleCtaVisible(): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll(IN_ARTICLE_CTA_SELECTOR));
    if (targets.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }

    const onScreen = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          onScreen.add(entry.target);
        } else {
          onScreen.delete(entry.target);
        }
      }
      setVisible(onScreen.size > 0);
    });

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return visible;
}

export function BlogStickyAppBar() {
  const storeUrl = useStoreUrl(blogLinkCampaign(slugFromBlogPath(usePathname()), "sticky"));
  const scrolled = useScrolled();
  const ctaVisible = useInArticleCtaVisible();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(readDismissed());
  }, []);

  function handleDismiss() {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // 保存できなくても、このページでは閉じる
    }
    setDismissed(true);
  }

  if (dismissed || !scrolled || ctaVisible) {
    return null;
  }

  return (
    <div
      data-cta="sticky"
      className="fixed inset-x-0 bottom-0 z-50 md:hidden border-t border-slate-200 bg-white/95 backdrop-blur px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center gap-3">
        <Image src="/icon.png" alt="delilog" width={40} height={40} className="rounded-xl flex-shrink-0" />
        <a href={storeUrl} className="flex-1 min-w-0">
          <span className="block text-sm font-bold text-slate-900 leading-snug">紙の代わりに、アプリで記録する</span>
          <span className="block text-xs text-slate-500">点呼・点検は無料</span>
        </a>
        <a
          href={storeUrl}
          className="flex-shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20"
        >
          無料で始める
        </a>
        <button
          type="button"
          aria-label="閉じる"
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
