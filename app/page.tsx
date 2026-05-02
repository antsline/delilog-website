'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const APP_STORE_URL = "https://apps.apple.com/jp/app/id6753698337";

const fontEditorial = {
  fontFamily: 'var(--font-noto-sans-jp), -apple-system, "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", sans-serif',
};

const fontInter = {
  fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
};

type EyebrowProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "light";
  className?: string;
};

function Eyebrow({ children, variant = "primary", className }: EyebrowProps) {
  const color =
    variant === "primary"
      ? "text-primary"
      : variant === "secondary"
        ? "text-secondary"
        : "text-primary-300";
  const bg =
    variant === "primary"
      ? "bg-primary"
      : variant === "secondary"
        ? "bg-secondary"
        : "bg-primary-300";
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em]",
        color,
        className
      )}
      style={fontInter}
    >
      <span className={cn("inline-block h-px w-6", bg)} />
      <span>{children}</span>
    </div>
  );
}

function AppStorePill({ size = "default" }: { size?: "default" | "lg" }) {
  const padding = size === "lg" ? "px-7 py-4" : "px-6 py-3.5";
  const main = size === "lg" ? "text-[18px]" : "text-[16px]";
  return (
    <a
      href={APP_STORE_URL}
      className={cn(
        "inline-flex items-center gap-3 rounded-2xl bg-[#16130f] text-white shadow-[0_12px_28px_-10px_rgba(22,19,15,0.4)] transition-transform hover:-translate-y-0.5",
        padding
      )}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M17.05 12.04c-.03-3.07 2.51-4.55 2.62-4.62-1.43-2.09-3.66-2.38-4.45-2.41-1.89-.19-3.69 1.11-4.65 1.11-.97 0-2.45-1.08-4.04-1.05-2.07.03-3.99 1.21-5.05 3.06-2.16 3.74-.55 9.27 1.55 12.31 1.03 1.49 2.25 3.16 3.84 3.1 1.55-.06 2.13-1 4-1 1.86 0 2.4 1 4.04.97 1.67-.03 2.72-1.51 3.74-3.01 1.18-1.73 1.66-3.4 1.69-3.49-.04-.02-3.24-1.24-3.27-4.93zM14.05 3.42c.85-1.04 1.43-2.48 1.27-3.92-1.23.05-2.72.82-3.6 1.85-.79.92-1.49 2.39-1.3 3.79 1.37.11 2.78-.7 3.63-1.72z" />
      </svg>
      <div className="text-left leading-tight">
        <div className="text-[9px] uppercase tracking-[0.08em] opacity-70" style={fontInter}>
          Download on the
        </div>
        <div className={cn("font-bold tracking-tight", main)} style={fontInter}>
          App Store
        </div>
      </div>
    </a>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const navLinks = [
    { href: "#features", label: "機能" },
    { href: "#how-it-works", label: "使い方" },
    { href: "#compliance", label: "法令対応" },
    { href: "#pricing", label: "料金" },
    { href: "#roadmap", label: "ロードマップ" },
    { href: "#faq", label: "FAQ" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <div
      className="min-h-screen bg-[#faf7f1] text-[#16130f] selection:bg-primary/20"
      style={fontEditorial}
    >
      {/* Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "border-b border-[#16130f]/10 bg-[#faf7f1]/85 backdrop-blur py-3"
            : "bg-transparent py-4"
        )}
      >
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 sm:px-8 lg:px-16">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/icon.png"
              alt="delilog"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span className="text-[15px] font-bold tracking-tight">delilog</span>
            <span className="hidden text-[11px] text-[#6b6357] md:inline">
              軽貨物ドライバーの業務記録アプリ
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[13px] text-[#3a342d] transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={APP_STORE_URL}
              className="rounded-full bg-[#16130f] px-4 py-2 text-[12px] font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              App Storeで入手
            </a>
          </nav>

          <button
            type="button"
            className="p-2 text-[#3a342d] lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="メニュー"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-0 right-0 top-full border-b border-[#16130f]/10 bg-[#faf7f1] p-5 shadow-xl lg:hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="py-2 text-base font-medium text-[#3a342d]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <a
                href={APP_STORE_URL}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-[#16130f] px-4 py-3 text-sm font-semibold text-white"
              >
                App Storeで入手
              </a>
            </div>
          </motion.div>
        )}
      </header>

      {/* HERO */}
      <section className="px-4 pb-16 pt-28 sm:px-8 sm:pt-32 lg:px-16 lg:pb-24 lg:pt-40">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeInUp}>
              <Eyebrow>Issue 01 · For Light Cargo Drivers</Eyebrow>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mt-7 text-[36px] font-black leading-[1.1] tracking-[-0.025em] sm:text-[52px] lg:text-[68px]"
            >
              <span className="text-primary">点検</span>も、
              <br />
              <span className="text-primary">点呼</span>も、
              <br />
              <span className="text-primary">運行記録</span>も、
              <br />
              スマホ1台で。
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-7 max-w-xl text-[15px] leading-[1.95] text-[#3a342d] sm:text-[16px]"
            >
              紙記録で時間を浪費するのは終わりにしましょう。
              法定様式そのままPDF出力できるから、提出依頼にも即対応できます。
              紙の記録簿から、もう解放されます。
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-9 flex flex-wrap items-center gap-5"
            >
              <AppStorePill />
              <span className="text-[12px] leading-[1.7] text-[#6b6357]">
                基本無料 / Premium
                <br />
                14日間無料トライアル
              </span>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-12 grid grid-cols-3 gap-5 border-t border-[#16130f]/10 pt-7"
            >
              {[
                { v: "30", u: "秒", l: "毎日の点検入力", c: "text-primary" },
                { v: "国交省", u: "様式", l: "PDF出力対応", c: "text-secondary" },
                { v: "OFF", u: "LINE", l: "圏外でも記録OK", c: "text-[#16130f]" },
              ].map((s) => (
                <div key={s.l}>
                  <div
                    className={cn(
                      "text-[20px] font-extrabold tracking-tight sm:text-[24px]",
                      s.c
                    )}
                    style={fontInter}
                  >
                    {s.v}
                    <span className="ml-0.5 text-[12px] font-semibold text-[#6b6357] sm:text-[13px]">
                      {s.u}
                    </span>
                  </div>
                  <div className="mt-1 text-[12px] text-[#6b6357]">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Phone stack */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative flex w-full items-center justify-center">
              <motion.div
                className="absolute -left-2 top-6 z-0 hidden w-[200px] sm:block sm:w-[230px] lg:w-[210px]"
                initial={{ opacity: 0, x: -30, rotate: -8 }}
                animate={{ opacity: 0.65, x: 0, rotate: -8 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Image
                  src="/screenshot_mockup_6.png"
                  alt="車両日常点検画面"
                  width={230}
                  height={460}
                  className="rounded-[2rem]"
                />
              </motion.div>

              <div className="relative z-10 w-[260px] sm:w-[290px] lg:w-[280px]">
                <Image
                  src="/screenshot_mockup_5.png"
                  alt="delilog ホーム画面"
                  width={290}
                  height={580}
                  className="relative z-10 rounded-[2.3rem] drop-shadow-2xl"
                  priority
                />
              </div>

              <motion.div
                className="absolute -right-2 top-6 z-0 hidden w-[200px] sm:block sm:w-[230px] lg:w-[210px]"
                initial={{ opacity: 0, x: 30, rotate: 8 }}
                animate={{ opacity: 0.65, x: 0, rotate: 8 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Image
                  src="/screenshot_mockup_8.png"
                  alt="業務の記録画面"
                  width={230}
                  height={460}
                  className="rounded-[2rem]"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="px-4 py-20 sm:px-8 lg:px-16 lg:py-28"
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-12 grid gap-10 lg:mb-16 lg:grid-cols-[300px_1fr] lg:gap-20">
            <div>
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-5 text-[34px] font-black leading-[1.1] tracking-[-0.025em] sm:text-[42px] lg:text-[44px]">
                はじめ方は、
                <br />
                シンプルに3ステップ。
              </h2>
            </div>
            <p className="max-w-xl text-[15px] leading-[1.95] text-[#3a342d] sm:text-[16px] lg:mt-3">
              アカウント登録から日々の記録、月末の提出まで。難しい設定はいりません。
              スマホ操作が苦手な方でも迷わない、3つのステップだけです。
            </p>
          </div>

          <div className="grid gap-10 sm:gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "ダウンロード",
                d: "App Storeから無料で。アカウント登録は最短1分。車両情報を1台だけ登録すればすぐに使い始められます。",
                accent: "まずは無料プランで",
              },
              {
                n: "02",
                t: "毎日タップで記録",
                d: "業務前の点検・点呼から、業務中のタイムライン、業務後の点呼まで。すべてチェック式で30秒。",
                accent: "毎日 約30秒",
              },
              {
                n: "03",
                t: "PDFで提出",
                d: "週単位・半月単位で国交省様式のPDFを出力。そのまま印刷して提出するだけです。",
                accent: "タップ1回で出力",
              },
            ].map((s) => (
              <div key={s.n}>
                <div className="mb-5 flex items-baseline gap-3">
                  <div
                    className="text-[48px] font-black leading-none tracking-[-0.04em] text-primary sm:text-[56px]"
                    style={fontInter}
                  >
                    {s.n}
                  </div>
                  <div className="h-px flex-1 bg-[#16130f]/10" />
                </div>
                <div className="text-[20px] font-extrabold tracking-[-0.015em] sm:text-[22px]">
                  {s.t}
                </div>
                <div className="mt-2.5 text-[14px] leading-[1.85] text-[#6b6357]">
                  {s.d}
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1.5 text-[11px] font-semibold text-secondary">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  {s.accent}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-4 py-20 sm:px-8 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-12 grid gap-10 lg:mb-14 lg:grid-cols-[300px_1fr] lg:gap-20">
            <div>
              <Eyebrow>Features · 01–06</Eyebrow>
              <h2 className="mt-5 text-[34px] font-black leading-[1.1] tracking-[-0.025em] sm:text-[42px] lg:text-[44px]">
                現場の声から
                <br />
                生まれた機能。
              </h2>
            </div>
            <p className="max-w-xl text-[15px] leading-[1.95] text-[#3a342d] sm:text-[16px] lg:mt-3">
              毎日の業務だからこそ、使いやすさにこだわりました。
              法定の必須項目を抜け漏れなくカバーしながら、
              入力の摩擦を最小限まで減らしています。
            </p>
          </div>

          <div className="grid gap-px overflow-hidden border border-[#16130f]/10 bg-[#16130f]/10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                n: "01",
                t: "車両日常点検",
                d: "法定の点検項目を網羅。チェック形式で素早く入力でき、毎日の点検が30秒で完了します。",
                tag: "無料",
              },
              {
                n: "02",
                t: "点呼記録",
                d: "業務前・業務後の点呼に対応。アルコールの使用有無、酒気帯び有無、所見を漏れなく記録。",
                tag: "無料",
              },
              {
                n: "03",
                t: "業務の記録",
                d: "開始・終了・休憩の日時と地点、走行距離、経過地点をタイムライン形式で直感的に記録。",
                tag: "プレミアム",
                badge: "NEW",
              },
              {
                n: "04",
                t: "PDF出力",
                d: "国土交通省モデル様式に準拠したPDFを週・半月単位で出力。そのまま印刷して提出できます。",
                tag: "無料・プレミアム",
              },
              {
                n: "05",
                t: "勤務時間管理",
                d: "改善基準告示に基づく拘束時間・休息期間の自動チェック。1日・1ヶ月・1年単位で確認可能。",
                tag: "プレミアム",
              },
              {
                n: "06",
                t: "事故の記録",
                d: "事故発生時の概要・原因・再発防止対策など6項目を記録。3年間の保存に対応します。",
                tag: "プレミアム",
              },
            ].map((f) => (
              <div
                key={f.n}
                className="flex min-h-[240px] flex-col bg-[#faf7f1] px-7 py-9"
              >
                <div className="flex items-baseline justify-between">
                  <div
                    className="text-[13px] font-extrabold tracking-wide text-primary"
                    style={fontInter}
                  >
                    {f.n}
                  </div>
                  <div className="flex items-center gap-2">
                    {f.badge && (
                      <span
                        className="text-[9px] font-bold uppercase tracking-[0.18em] text-secondary"
                        style={fontInter}
                      >
                        {f.badge}
                      </span>
                    )}
                    <span className="text-[10px] font-semibold tracking-wide text-[#6b6357]">
                      {f.tag}
                    </span>
                  </div>
                </div>
                <div className="mt-7 text-[20px] font-extrabold leading-[1.3] tracking-[-0.015em] sm:text-[22px]">
                  {f.t}
                </div>
                <div className="mt-3 text-[13.5px] leading-[1.85] text-[#6b6357]">
                  {f.d}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#16130f]/10 bg-white p-5">
              <h4 className="font-bold text-[#16130f]">オフライン対応</h4>
              <p className="mt-1 text-sm text-[#6b6357]">
                電波の届かない場所でも記録可能。復帰時にクラウドへ自動同期されます。
              </p>
            </div>
            <div className="rounded-xl border border-[#16130f]/10 bg-white p-5">
              <h4 className="font-bold text-[#16130f]">使いやすいデザイン</h4>
              <p className="mt-1 text-sm text-[#6b6357]">
                大きなボタンと分かりやすい画面で、スマホ操作が苦手な方でも安心です。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPLIANCE */}
      <section
        id="compliance"
        className="bg-[#f1ebde] px-4 py-20 sm:px-8 lg:px-16 lg:py-24"
      >
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[300px_1fr] lg:gap-20">
          <div>
            <Eyebrow variant="secondary">Compliance · 法令対応</Eyebrow>
            <h2 className="mt-5 text-[32px] font-black leading-[1.1] tracking-[-0.025em] sm:text-[40px] lg:text-[42px]">
              法令に、
              <br />
              ぴったり寄り添う。
            </h2>
            <p className="mt-6 text-[14px] leading-[1.95] text-[#3a342d]">
              2025年4月1日に強化された
              <br className="hidden sm:block" />
              「貨物軽自動車運送事業輸送安全規則」に基づく
              <br className="hidden sm:block" />
              記録義務に、delilogはひとつひとつ正面から対応しています。
            </p>
            <div className="mt-6 inline-flex items-center gap-2.5 rounded-lg border border-secondary/30 bg-white px-4 py-2.5">
              <div className="grid h-5 w-5 place-items-center rounded-full bg-secondary text-[11px] font-bold text-white">
                ✓
              </div>
              <span className="text-[12px] font-semibold text-[#3a342d]">
                国土交通省モデル様式に準拠
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                law: "貨物軽自動車運送事業輸送安全規則",
                ref: "日常点検",
                t: "車両日常点検",
                d: "走行前のチェック項目を網羅。チェック式で素早く入力でき、毎日の記録をクラウドに保存します。",
                status: "対応済",
              },
              {
                law: "貨物軽自動車運送事業輸送安全規則",
                ref: "点呼記録",
                t: "業務前・業務後の点呼",
                d: "アルコールの使用有無、酒気帯び有無、所見の項目に対応。記録は1年間保存。",
                status: "対応済",
              },
              {
                law: "貨物軽自動車運送事業輸送安全規則",
                ref: "業務の記録",
                t: "業務の記録（運行記録）",
                d: "開始・終了・休憩の日時と地点、走行距離、経過地点をタイムライン形式で記録できます。",
                status: "対応済",
              },
              {
                law: "貨物軽自動車運送事業輸送安全規則",
                ref: "事故の記録",
                t: "事故の記録",
                d: "事故概要・原因・再発防止策を6項目で記録し、3年間の保存に対応します。",
                status: "対応済",
              },
            ].map((c) => (
              <div
                key={c.t}
                className="rounded-xl border border-[#16130f]/10 bg-white p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="text-[10px] uppercase leading-[1.5] tracking-[0.1em] text-[#6b6357]"
                    style={fontInter}
                  >
                    <div className="font-bold text-[#3a342d]">{c.law}</div>
                    <div>{c.ref}</div>
                  </div>
                  <span
                    className={cn(
                      "rounded px-2 py-0.5 text-[10px] font-bold tracking-wide",
                      c.status === "対応済"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-primary/10 text-primary-700"
                    )}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="mt-3.5 text-[18px] font-extrabold tracking-[-0.01em]">
                  {c.t}
                </div>
                <div className="mt-2 text-[13px] leading-[1.75] text-[#6b6357]">
                  {c.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-4 py-20 sm:px-8 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1280px]">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="mb-10 mt-5 text-[34px] font-black leading-[1.1] tracking-[-0.025em] sm:text-[42px] lg:mb-14 lg:text-[44px]">
            まずは無料で。
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                name: "無料プラン",
                price: "¥0",
                unit: "",
                sub: "まずはお試し",
                accent: false,
                cta: "無料で始める",
                feats: [
                  "車両1台まで登録",
                  "車両日常点検",
                  "点呼記録（業務前・業務後）",
                  "運行記録の閲覧・PDF出力",
                  "PDF出力 月5枚（透かしあり）",
                  "オフライン対応",
                  "クラウド同期",
                ],
              },
              {
                name: "Premium 月額",
                price: "¥600",
                unit: "/月",
                sub: "気軽に始めたい方に",
                accent: true,
                cta: "14日間無料で試す",
                feats: [
                  "車両台数 無制限",
                  "車両日常点検",
                  "点呼記録（業務前・業務後）",
                  "運行記録の作成・編集・出力",
                  "PDF出力 無制限（透かしなし）",
                  "勤務時間管理",
                  "事故の記録",
                ],
              },
              {
                name: "Premium 年額",
                price: "¥6,000",
                unit: "/年",
                sub: "月¥500・2ヶ月分おトク",
                accent: false,
                badge: "BEST",
                cta: "14日間無料で試す",
                feats: [
                  "車両台数 無制限",
                  "車両日常点検",
                  "点呼記録（業務前・業務後）",
                  "運行記録の作成・編集・出力",
                  "PDF出力 無制限（透かしなし）",
                  "勤務時間管理",
                  "事故の記録",
                ],
              },
            ].map((p, i) => (
              <div
                key={p.name}
                className={cn(
                  "relative rounded-2xl border p-8",
                  p.accent
                    ? "border-[#16130f] bg-[#16130f] text-[#faf7f1]"
                    : "border-[#16130f]/10 bg-[#faf7f1] text-[#16130f]"
                )}
              >
                {p.badge && (
                  <div
                    className="absolute -top-2.5 right-6 rounded bg-primary px-3 py-1 text-[10px] font-extrabold tracking-[0.18em] text-white"
                    style={fontInter}
                  >
                    {p.badge}
                  </div>
                )}
                <div
                  className={cn(
                    "text-[13px] font-medium",
                    p.accent ? "text-[#faf7f1]/70" : "text-[#6b6357]"
                  )}
                >
                  {p.name}
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <div
                    className="text-[48px] font-black leading-none tracking-[-0.04em] sm:text-[56px]"
                    style={fontInter}
                  >
                    {p.price}
                  </div>
                  {p.unit && (
                    <div
                      className={cn(
                        "text-[14px]",
                        p.accent ? "text-[#faf7f1]/60" : "text-[#6b6357]"
                      )}
                    >
                      {p.unit}
                    </div>
                  )}
                </div>
                <div
                  className={cn(
                    "mt-1.5 text-[12px]",
                    p.accent ? "text-[#faf7f1]/65" : "text-[#6b6357]"
                  )}
                >
                  {p.sub}
                </div>

                <ul
                  className={cn(
                    "mt-7 space-y-2 border-t pt-5 text-[13px] leading-[2]",
                    p.accent ? "border-white/15" : "border-[#16130f]/10"
                  )}
                >
                  {p.feats.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span
                        className={cn(
                          "mt-2 h-1 w-1 shrink-0 rounded-full",
                          p.accent ? "bg-[#faf7f1]/60" : "bg-[#6b6357]"
                        )}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={APP_STORE_URL}
                  className={cn(
                    "mt-5 inline-flex w-full items-center justify-center rounded-xl px-4 py-3.5 text-[14px] font-bold tracking-wide transition-transform hover:-translate-y-0.5",
                    p.accent
                      ? "bg-primary text-white"
                      : i === 0
                        ? "bg-[#16130f] text-white"
                        : "bg-[#16130f] text-white"
                  )}
                >
                  {p.cta}
                </a>
                {i !== 0 && (
                  <p
                    className={cn(
                      "mt-3 text-center text-[11px]",
                      p.accent ? "text-[#faf7f1]/60" : "text-[#6b6357]"
                    )}
                  >
                    トライアル期間中はいつでもキャンセル可能
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section
        id="roadmap"
        className="bg-[#f1ebde] px-4 py-20 sm:px-8 lg:px-16 lg:py-24"
      >
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[300px_1fr] lg:gap-20">
          <div>
            <Eyebrow>Roadmap</Eyebrow>
            <h2 className="mt-5 text-[32px] font-black leading-[1.1] tracking-[-0.025em] sm:text-[40px] lg:text-[42px]">
              これから、
              <br />
              さらに便利に。
            </h2>
            <p className="mt-6 text-[14px] leading-[1.95] text-[#3a342d]">
              現場のドライバーから寄せられた声を反映し、
              機能を順次追加していきます。
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                t: "指導・監督記録",
                d: "運転者への指導の実施日時・内容・対象者を記録し、3年間の保存に対応（2025年4月義務化）。",
                tag: "近日対応",
                priority: true,
              },
              {
                t: "実績管理",
                d: "配送実績の集計と可視化。日次・月次の業務量をひと目で振り返れます。",
              },
              {
                t: "売上・経費管理",
                d: "日次・月次の売上集計と、ガソリン代などの経費を入力・管理できます。",
              },
              {
                t: "請求書発行",
                d: "インボイス制度に対応した請求書を、アプリから直接作成できます。",
              },
              {
                t: "Web管理画面",
                d: "PCブラウザからデータ閲覧・管理ができる管理画面を提供予定です。",
              },
            ].map((r) => (
              <div
                key={r.t}
                className="rounded-xl border border-[#16130f]/10 bg-white p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-[18px] font-extrabold tracking-[-0.01em]">
                    {r.t}
                  </div>
                  {r.tag && (
                    <span
                      className={cn(
                        "shrink-0 rounded px-2 py-0.5 text-[10px] font-bold tracking-wide",
                        r.priority
                          ? "bg-primary/10 text-primary-700"
                          : "bg-[#16130f]/5 text-[#6b6357]"
                      )}
                    >
                      {r.tag}
                    </span>
                  )}
                </div>
                <div className="mt-2 text-[13px] leading-[1.85] text-[#6b6357]">
                  {r.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 py-20 sm:px-8 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[300px_1fr] lg:gap-20">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-5 text-[34px] font-black leading-[1.1] tracking-[-0.025em] sm:text-[42px] lg:text-[44px]">
              よくある
              <br />
              ご質問。
            </h2>
            <p className="mt-5 text-[14px] leading-[1.95] text-[#3a342d]">
              他にもご不明な点があれば、お気軽にお問い合わせください。
            </p>
          </div>

          <div>
            {[
              {
                q: "無料プランでも法令対応はできますか？",
                a: "車両日常点検と点呼記録の基本機能は無料プランでもすべてご利用いただけます。PDF出力は月5枚まで（透かしあり）対応しています。",
              },
              {
                q: "車両を複数台所有しています。",
                a: "Premiumプランで車両台数が無制限になります。複数台運用される個人事業主・小規模運送会社の方におすすめです。",
              },
              {
                q: "スマホが苦手なドライバーでも使えますか？",
                a: "大きなボタンと分かりやすい画面構成で、スマホ操作に慣れていない方でも安心です。日常点検も点呼も、数タップ・約30秒で完了します。",
              },
              {
                q: "電波の届かない配送現場でも使えますか？",
                a: "オフライン対応で、圏外でも記録可能です。電波の入る場所に戻れば、自動でクラウドに同期されます。",
              },
              {
                q: "PDFはそのまま提出に使えますか？",
                a: "国土交通省のモデル様式に準拠しているため、印刷してそのまま提出できます。週単位・半月単位での出力に対応しています。",
              },
              {
                q: "トライアル期間中の解約は可能ですか？",
                a: "14日間のPremium無料トライアル期間中はいつでもキャンセル可能です。期間中の課金は発生しません。",
              },
            ].map((f, i) => (
              <div
                key={f.q}
                className={cn(
                  "py-6",
                  i === 0
                    ? "border-t border-[#16130f]/30"
                    : "border-t border-[#16130f]/10"
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="mt-1 min-w-7 text-[13px] font-extrabold text-primary"
                    style={fontInter}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <div className="text-[17px] font-bold tracking-[-0.01em] sm:text-[18px]">
                      {f.q}
                    </div>
                    <div className="mt-2.5 text-[14px] leading-[1.85] text-[#3a342d]">
                      {f.a}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t border-[#16130f]/10" />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#16130f] px-4 py-20 text-[#faf7f1] sm:px-8 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <Eyebrow variant="primary">End · Call To Action</Eyebrow>
              <h3 className="mt-5 text-[44px] font-black leading-[1.05] tracking-[-0.03em] sm:text-[56px] lg:text-[64px]">
                業務記録を、
                <br />
                <span className="text-primary">これひとつで。</span>
              </h3>
              <p className="mt-6 max-w-xl text-[15px] leading-[1.85] text-[#a89a85] sm:text-[16px]">
                delilogなら、毎日の点検・点呼・運行記録が驚くほどスムーズに。
                まずは無料ダウンロードして、明日の業務から試してみてください。
              </p>
            </div>
            <div className="lg:text-right">
              <div className="inline-flex">
                <a
                  href={APP_STORE_URL}
                  className="inline-flex items-center gap-3 rounded-2xl bg-primary px-7 py-4 text-[16px] font-extrabold text-[#16130f] transition-transform hover:-translate-y-0.5"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M17.05 12.04c-.03-3.07 2.51-4.55 2.62-4.62-1.43-2.09-3.66-2.38-4.45-2.41-1.89-.19-3.69 1.11-4.65 1.11-.97 0-2.45-1.08-4.04-1.05-2.07.03-3.99 1.21-5.05 3.06-2.16 3.74-.55 9.27 1.55 12.31 1.03 1.49 2.25 3.16 3.84 3.1 1.55-.06 2.13-1 4-1 1.86 0 2.4 1 4.04.97 1.67-.03 2.72-1.51 3.74-3.01 1.18-1.73 1.66-3.4 1.69-3.49-.04-.02-3.24-1.24-3.27-4.93z" />
                  </svg>
                  App Storeで入手 →
                </a>
              </div>
              <div className="mt-3.5 text-[12px] text-[#a89a85] lg:mt-4">
                基本無料 / Premium 14日間無料トライアル
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-[12px] text-[#a89a85] sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <Image
                src="/icon.png"
                alt="delilog"
                width={22}
                height={22}
                className="rounded"
              />
              <span className="font-bold text-[#faf7f1]">delilog</span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link
                href="/privacy-policy"
                className="transition-colors hover:text-white"
              >
                プライバシーポリシー
              </Link>
              <Link
                href="/terms-of-service"
                className="transition-colors hover:text-white"
              >
                利用規約
              </Link>
              <span>© 2025–2026 delilog</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
