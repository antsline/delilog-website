"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { APP_STORE_URL } from "@/lib/constants";

const MOBILE_NAV_ID = "blog-mobile-nav";

export function BlogHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMobileMenuOpen((prev) => !prev), []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen, closeMenu]);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icon.png" alt="delilog" width={32} height={32} className="rounded-lg" />
          <span className="text-xl font-bold tracking-tight">
            <span className="text-primary">delilog</span>
            <span className="text-slate-400 mx-2">|</span>
            <span className="text-slate-700">デリログ</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
            機能
          </Link>
          <Link href="/#pricing" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
            料金
          </Link>
          <Link href="/blog" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
            Blog
          </Link>
          <Button asChild variant="default" className="rounded-full shadow-lg shadow-primary/20">
            <a href={APP_STORE_URL}>ダウンロード</a>
          </Button>
        </nav>

        <button
          className="md:hidden p-2 text-slate-600"
          onClick={toggleMenu}
          aria-expanded={mobileMenuOpen}
          aria-controls={MOBILE_NAV_ID}
          aria-label={mobileMenuOpen ? "メニューを閉じる" : "メニューを開く"}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          id={MOBILE_NAV_ID}
          className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-4 shadow-xl"
        >
          <div className="flex flex-col gap-4">
            <Link href="/#features" className="text-base font-medium text-slate-600 py-2" onClick={closeMenu}>
              機能
            </Link>
            <Link href="/#pricing" className="text-base font-medium text-slate-600 py-2" onClick={closeMenu}>
              料金
            </Link>
            <Link href="/blog" className="text-base font-medium text-slate-600 py-2" onClick={closeMenu}>
              Blog
            </Link>
            <Button asChild className="w-full">
              <a href={APP_STORE_URL}>ダウンロード</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
