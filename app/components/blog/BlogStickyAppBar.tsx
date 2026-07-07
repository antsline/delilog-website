"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { APP_STORE_URL } from "@/lib/constants";

const DISMISS_KEY = "delilog-sticky-cta-dismissed";
const SHOW_AFTER_SCROLL_PX = 600;

export function BlogStickyAppBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");

    function handleScroll() {
      setVisible(window.scrollY > SHOW_AFTER_SCROLL_PX);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleDismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  if (dismissed || !visible) {
    return null;
  }

  return (
    <div
      data-cta="sticky-bar"
      className="fixed inset-x-0 bottom-0 z-50 sm:hidden border-t border-slate-200 bg-white/95 backdrop-blur px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center gap-3">
        <Image src="/icon.png" alt="delilog" width={40} height={40} className="rounded-xl flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">点呼・点検を30秒で記録</p>
          <p className="text-xs text-slate-500 truncate">国交省様式のPDFを自動作成（無料）</p>
        </div>
        <a
          href={APP_STORE_URL}
          className="flex-shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20"
        >
          無料DL
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
