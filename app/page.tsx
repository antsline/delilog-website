'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  FileText,
  ClipboardList,
  TrendingUp,
  Receipt,
  CreditCard,
  Laptop,
  Menu,
  X,
  Check,
  Star
} from "lucide-react";
import { Button } from "./components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-primary/20">
      {/* Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-white/80 backdrop-blur-md border-b border-slate-200 py-3" : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/icon.png" alt="delilog" width={32} height={32} className="rounded-lg" />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-primary">delilog</span>
              <span className="text-slate-400 mx-2">|</span>
              <span className="text-slate-700">デリログ</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">機能</Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">料金</Link>
            <Link href="#roadmap" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">ロードマップ</Link>
            <Link href="/blog" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Blog</Link>
            <Button asChild variant="default" className="rounded-full shadow-lg shadow-primary/20">
              <a href="https://apps.apple.com/jp/app/id6753698337">ダウンロード</a>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-4 shadow-xl"
          >
            <div className="flex flex-col gap-4">
              <Link href="#features" className="text-base font-medium text-slate-600 py-2" onClick={() => setMobileMenuOpen(false)}>機能</Link>
              <Link href="#pricing" className="text-base font-medium text-slate-600 py-2" onClick={() => setMobileMenuOpen(false)}>料金</Link>
              <Link href="#roadmap" className="text-base font-medium text-slate-600 py-2" onClick={() => setMobileMenuOpen(false)}>ロードマップ</Link>
              <Link href="/blog" className="text-base font-medium text-slate-600 py-2" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Button asChild className="w-full">
                <a href="https://apps.apple.com/jp/app/id6753698337">ダウンロード</a>
              </Button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                軽貨物ドライバーの必需品
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-4xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                点検・点呼・運行記録。<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">スマホ1台で完結。</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg lg:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                軽貨物ドライバーのための業務記録アプリ。<br className="hidden lg:block" />
                法定点検・アルコールチェック・運行記録をまとめて管理。<br className="hidden lg:block" />
                面倒な書類作成から解放されます。
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a href="https://apps.apple.com/jp/app/id6753698337" className="hover:scale-105 transition-transform">
                  <Image src="/app-store-badge-ja.svg" alt="Download on the App Store" width={180} height={60} className="h-[52px] w-auto" />
                </a>
                <span className="text-sm text-slate-500">基本無料 / 14日間Premiumお試し</span>
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-12 flex items-center justify-center lg:justify-start gap-6 sm:gap-8 text-slate-500 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span>国交省様式PDF</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span>オフラインOK</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span>クラウド同期</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex-1 relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative flex items-center justify-center">
                {/* Back phone (点検) */}
                <motion.div
                  className="absolute -left-4 sm:left-0 top-8 w-[200px] sm:w-[240px] z-0 hidden sm:block"
                  initial={{ opacity: 0, x: -30, rotate: -8 }}
                  animate={{ opacity: 0.7, x: 0, rotate: -8 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Image
                    src="/screenshot_mockup_6.png"
                    alt="車両日常点検画面"
                    width={240}
                    height={480}
                    className="rounded-[2rem]"
                  />
                </motion.div>

                {/* Main phone (ホーム) */}
                <div className="relative w-[280px] sm:w-[300px] z-10">
                  <Image
                    src="/screenshot_mockup_5.png"
                    alt="delilog ホーム画面"
                    width={300}
                    height={600}
                    className="relative rounded-[2.5rem] z-10"
                    priority
                  />
                </div>

                {/* Back phone (運行記録) */}
                <motion.div
                  className="absolute -right-4 sm:right-0 top-8 w-[200px] sm:w-[240px] z-0 hidden sm:block"
                  initial={{ opacity: 0, x: 30, rotate: 8 }}
                  animate={{ opacity: 0.7, x: 0, rotate: 8 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Image
                    src="/screenshot_mockup_8.png"
                    alt="運行記録画面"
                    width={240}
                    height={480}
                    className="rounded-[2rem]"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary font-semibold tracking-wide uppercase mb-3">Features</h2>
            <p className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">現場の声から生まれた機能</p>
            <p className="text-lg text-slate-600">
              毎日の業務だからこそ、使いやすさにこだわりました。<br />
              必要な機能が、直感的に使えます。
            </p>
          </div>

          <div className="space-y-20 lg:space-y-32">
            <FeatureRow
              title="車両日常点検"
              description="法定点検項目を完全網羅。チェック形式で素早く入力でき、毎日の点検が30秒で完了します。エンジンルーム、車両外部、運転席まわりの全項目をカバー。"
              screenshotSrc="/screenshot_mockup_6.png"
              reverse={false}
            />
            <FeatureRow
              title="点呼記録"
              description="業務前・業務後の点呼記録に対応。アルコール検知器の使用有無や酒気帯びの確認、疲労・睡眠不足の状態まで漏れなく管理できます。"
              screenshotSrc="/screenshot_mockup_7.png"
              reverse={true}
            />
            <FeatureRow
              title="運行記録"
              description="タイムライン形式で業務の流れを直感的に記録。集荷・積込、納品・配達、荷役、休憩・待機をワンタップで追加。待機時間の自動検出にも対応しています。"
              screenshotSrc="/screenshot_mockup_8.png"
              reverse={false}
              badge="NEW"
            />
            <FeatureRow
              title="PDF出力"
              description="点呼記録簿・日常点検記録・業務の記録を国交省様式に対応したPDFとして出力。週単位・半月単位で期間を選び、そのまま印刷して提出できます。"
              screenshotSrc="/screenshot_mockup_10.png"
              reverse={true}
            />
            <FeatureRow
              title="記録一覧・クラウド保存"
              description="日々の記録をカレンダー形式で一覧表示。点検・点呼の実施状況がひと目でわかります。データはクラウドに安全に保存され、端末を紛失してもデータは消えません。"
              screenshotSrc="/screenshot_mockup_9.png"
              reverse={false}
            />
          </div>

          {/* Supplementary features */}
          <div className="mt-20 grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="flex items-start gap-4 p-5 rounded-xl border border-slate-200 bg-white">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">オフライン対応</h4>
                <p className="text-sm text-slate-600">電波の届かない場所でも記録可能。復帰時に自動同期されます。</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-xl border border-slate-200 bg-white">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">使いやすいデザイン</h4>
                <p className="text-sm text-slate-600">大きなボタンと分かりやすい画面で、スマホ操作が苦手な方でも安心。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary font-semibold tracking-wide uppercase mb-3">Pricing</h2>
            <p className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">まずは無料で始められます</p>
            <p className="text-lg text-slate-600">
              基本機能は無料。Premiumなら車両台数・PDF出力が無制限に。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="relative rounded-2xl border-2 border-slate-200 bg-white p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-1">無料プラン</h3>
                <p className="text-sm text-slate-500">まずはお試し</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold text-slate-900">¥0</span>
              </div>
              <ul className="space-y-4 mb-8">
                <PricingFeature text="車両1台まで登録" />
                <PricingFeature text="車両日常点検" />
                <PricingFeature text="点呼記録（業務前・業務後）" />
                <PricingFeature text="運行記録の閲覧・PDF出力" />
                <PricingFeature text="PDF出力 月5枚（透かしあり）" />
                <PricingFeature text="オフライン対応" />
                <PricingFeature text="クラウド同期" />
              </ul>
              <Button asChild variant="outline" className="w-full rounded-full" size="lg">
                <a href="https://apps.apple.com/jp/app/id6753698337">無料で始める</a>
              </Button>
            </div>

            {/* Premium Monthly */}
            <div className="relative rounded-2xl border-2 border-slate-200 bg-white p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Premium 月額</h3>
                <p className="text-sm text-slate-500">気軽に始めたい方に</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold text-slate-900">¥600</span>
                <span className="text-slate-500 ml-1">/月</span>
              </div>
              <ul className="space-y-4 mb-8">
                <PricingFeature text="車両台数 無制限" highlighted />
                <PricingFeature text="車両日常点検" />
                <PricingFeature text="点呼記録（業務前・業務後）" />
                <PricingFeature text="運行記録の作成・編集・出力" highlighted />
                <PricingFeature text="PDF出力 無制限（透かしなし）" highlighted />
                <PricingFeature text="オフライン対応" />
                <PricingFeature text="クラウド同期" />
              </ul>
              <Button asChild className="w-full rounded-full" size="lg">
                <a href="https://apps.apple.com/jp/app/id6753698337">14日間無料で試す</a>
              </Button>
              <p className="text-center text-xs text-slate-400 mt-3">トライアル期間中はいつでもキャンセル可能</p>
            </div>

            {/* Premium Annual */}
            <div className="relative rounded-2xl border-2 border-primary bg-white p-8">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-primary text-white text-sm font-medium">
                  <Star className="w-4 h-4" />
                  2ヶ月分おトク
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Premium 年額</h3>
                <p className="text-sm text-slate-500">長く使う方に</p>
              </div>
              <div className="mb-2">
                <span className="text-4xl font-bold text-slate-900">¥6,000</span>
                <span className="text-slate-500 ml-1">/年</span>
              </div>
              <p className="text-sm text-slate-500 mb-6">月あたり ¥500</p>
              <ul className="space-y-4 mb-8">
                <PricingFeature text="車両台数 無制限" highlighted />
                <PricingFeature text="車両日常点検" />
                <PricingFeature text="点呼記録（業務前・業務後）" />
                <PricingFeature text="運行記録の作成・編集・出力" highlighted />
                <PricingFeature text="PDF出力 無制限（透かしなし）" highlighted />
                <PricingFeature text="オフライン対応" />
                <PricingFeature text="クラウド同期" />
              </ul>
              <Button asChild className="w-full rounded-full" size="lg">
                <a href="https://apps.apple.com/jp/app/id6753698337">14日間無料で試す</a>
              </Button>
              <p className="text-center text-xs text-slate-400 mt-3">トライアル期間中はいつでもキャンセル可能</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
            <div>
              <h2 className="text-primary font-semibold tracking-wide uppercase mb-3">Roadmap</h2>
              <p className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">今後のアップデート予定</p>
              <p className="text-lg text-slate-600">
                皆様の声を反映し、さらに便利な機能を順次追加していきます。
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <RoadmapItem icon={<FileText />} title="事故の記録" description="事故発生時の概要・原因・再発防止対策を記録。3年間保存に対応（令和7年4月義務化）" />
            <RoadmapItem icon={<ClipboardList />} title="指導・監督記録" description="運転者への指導実施日時・内容・対象者を記録。3年間保存に対応（令和7年4月義務化）" />
            <RoadmapItem icon={<TrendingUp />} title="実績管理" description="配送実績の可視化と分析" />
            <RoadmapItem icon={<Receipt />} title="売上・経費管理" description="日次・月次の売上集計とガソリン代などの経費入力" />
            <RoadmapItem icon={<CreditCard />} title="請求書発行" description="インボイス対応の請求書をアプリから作成" />
            <RoadmapItem icon={<Laptop />} title="Web管理画面" description="PCブラウザでのデータ閲覧・管理機能" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-secondary-700 via-secondary to-secondary-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            業務記録を、これひとつで。
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            delilogなら、毎日の点検・点呼・運行記録が驚くほどスムーズに。<br />
            まずは無料ダウンロードしてお試しください。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="https://apps.apple.com/jp/app/id6753698337" className="transform hover:scale-105 transition-all">
              <Image src="/app-store-badge-ja.svg" alt="Download on the App Store" width={200} height={67} className="h-14 w-auto" />
            </a>
          </div>
          <p className="mt-8 text-sm text-white/60">
            基本無料 / Premium 14日間無料トライアルあり
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Image src="/icon.png" alt="delilog" width={24} height={24} className="rounded" />
              <span className="font-bold text-slate-700">delilog</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-600">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">プライバシーポリシー</Link>
              <Link href="/terms-of-service" className="hover:text-primary transition-colors">利用規約</Link>
            </div>
            <p className="text-sm text-slate-400">
              &copy; 2025-2026 delilog. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureRow({ title, description, screenshotSrc, reverse, badge }: {
  title: string;
  description: string;
  screenshotSrc: string;
  reverse: boolean;
  badge?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
      }}
      className={cn(
        "flex flex-col items-center gap-10 lg:gap-20",
        reverse ? "lg:flex-row-reverse" : "lg:flex-row"
      )}
    >
      <div className="flex-shrink-0 w-[240px] sm:w-[280px]">
        <Image
          src={screenshotSrc}
          alt={title}
          width={280}
          height={560}
          className="rounded-[2rem]"
        />
      </div>

      <div className="flex-1 text-center lg:text-left">
        <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h3>
          {badge && (
            <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-bold">
              {badge}
            </span>
          )}
        </div>
        <p className="text-lg text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

function PricingFeature({ text, highlighted }: { text: string; highlighted?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <Check className={cn("w-5 h-5 shrink-0 mt-0.5", highlighted ? "text-primary" : "text-slate-400")} />
      <span className={cn("text-sm", highlighted ? "font-medium text-slate-900" : "text-slate-600")}>{text}</span>
    </li>
  );
}

function RoadmapItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all">
      <div className="p-2 bg-primary/10 rounded-lg text-primary">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}
