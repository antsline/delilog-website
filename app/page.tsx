'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const mockups = [
    "/screenshot_mockup_1.png",
    "/screenshot_mockup_2.png",
    "/screenshot_mockup_3.png",
    "/screenshot_mockup_4.png",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockups.length);
    }, 3000); // 3秒ごとに切り替え

    return () => clearInterval(timer);
  }, [mockups.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">
            <span className="text-[#fb6c39]">delilog</span>
            {" "}- <span className="text-lg text-[#1876be]">デリログ</span>
          </h1>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* 左側：テキストコンテンツ */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-6">
                <Image
                  src="/app_icon.png"
                  alt="delilog アプリアイコン"
                  width={120}
                  height={120}
                  className="rounded-3xl shadow-lg"
                />
              </div>
              <h2 className="text-5xl font-bold text-[#fb6c39] mb-6">
                delilog
              </h2>
              <p className="text-xl lg:text-2xl text-gray-700 mb-4 leading-relaxed">
                軽運送自営業者向けの業務管理アプリ
              </p>
              <p className="text-lg lg:text-xl text-gray-600 mb-6 leading-relaxed">
                車両日常点検・業務前点呼・業務後点呼を簡単に記録
              </p>
              <ul className="text-base lg:text-lg text-gray-600 mb-12 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-[#1876be] rounded flex items-center justify-center text-white text-sm font-bold">✓</span>
                  <span>法定の点検・点呼項目に対応</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-[#1876be] rounded flex items-center justify-center text-white text-sm font-bold">✓</span>
                  <span>オフラインでも記録可能</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-[#1876be] rounded flex items-center justify-center text-white text-sm font-bold">✓</span>
                  <span>PDF出力で書類作成も簡単</span>
                </li>
              </ul>
              <div className="flex justify-center lg:justify-start gap-4">
                <a
                  href="https://apps.apple.com/jp/app/id6753698337"
                  className="inline-block hover:opacity-80 transition"
                >
                  <Image
                    src="/app-store-badge-ja.svg"
                    alt="Download on the App Store"
                    width={200}
                    height={67}
                    className="h-14 w-auto"
                  />
                </a>
              </div>
            </div>

            {/* 右側：モックアップカルーセル */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-[400px]">
                {/* カルーセル画像 */}
                <div className="relative overflow-hidden">
                  {mockups.map((mockup, index) => (
                    <div
                      key={index}
                      className={`transition-opacity duration-500 ${
                        index === currentSlide ? "opacity-100" : "opacity-0 absolute inset-0"
                      }`}
                    >
                      <Image
                        src={mockup}
                        alt={`delilog アプリ画面 ${index + 1}`}
                        width={400}
                        height={800}
                        className="max-w-full h-auto"
                        priority={index === 0}
                      />
                    </div>
                  ))}
                </div>

                {/* インジケーター（ドット） */}
                <div className="flex justify-center gap-2 mt-6">
                  {mockups.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide
                          ? "bg-[#1876be] w-6"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`スライド ${index + 1} に移動`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 機能紹介 */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-[#fb6c39] mb-16">
            主な機能
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 車両日常点検 */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
                <Image
                  src="/car_inspection_1.png"
                  alt="車両日常点検"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover object-center scale-110"
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-[#1876be] mb-3">
                  車両日常点検
                </h4>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>・法定点検項目を網羅</li>
                  <li>・チェック形式で簡単入力</li>
                  <li>・点検記録をPDF化して保存</li>
                </ul>
              </div>
            </div>

            {/* 業務前点呼・業務後点呼 */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
                <Image
                  src="/alcohol_check_1.png"
                  alt="業務前点呼・業務後点呼"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover object-center scale-110"
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-[#1876be] mb-3">
                  業務前点呼・業務後点呼
                </h4>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>・必要項目を漏れなく記録</li>
                  <li>・国交省様式に対応したPDF</li>
                  <li>・業務前後の点呼を効率化</li>
                </ul>
              </div>
            </div>

            {/* オフライン対応 */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden">
                <Image
                  src="/no_signal_2.png"
                  alt="オフライン対応"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover scale-110"
                  style={{ objectPosition: 'center 30%' }}
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-[#1876be] mb-3">
                  オフライン対応
                </h4>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>・ネット接続なしでも記録可能</li>
                  <li>・圏外でも業務を止めない</li>
                  <li>・後からワンタップで同期</li>
                </ul>
              </div>
            </div>

            {/* データ管理 */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
                <Image
                  src="/print_document_1.png"
                  alt="記録の保存と出力"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover object-center scale-110"
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-[#1876be] mb-3">
                  記録の保存と出力
                </h4>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>・デジタルで記録を保存</li>
                  <li>・提出時にワンタップで印刷</li>
                  <li>・複数車両の登録に対応</li>
                </ul>
              </div>
            </div>

            {/* シンプルなデザイン */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-pink-50 to-pink-100 overflow-hidden">
                <Image
                  src="/comfortable_operation_1.png"
                  alt="使いやすいデザイン"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover object-center scale-110"
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-[#1876be] mb-3">
                  使いやすいデザイン
                </h4>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>・直感的な操作画面</li>
                  <li>・必要な記録項目を網羅</li>
                  <li>・日々の記録作業を効率化</li>
                </ul>
              </div>
            </div>

            {/* データの安全性 */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-cyan-50 to-cyan-100 overflow-hidden">
                <Image
                  src="/safety_security_1.png"
                  alt="安心のデータ管理"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover object-center scale-110"
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-[#1876be] mb-3">
                  安心のデータ管理
                </h4>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>・スマホ故障時も安心</li>
                  <li>・クラウドで自動バックアップ</li>
                  <li>・過去の記録もすぐ確認</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 対象ユーザー */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-[#fb6c39] mb-12">
            こんな方におすすめ
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-lg text-gray-700 flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#1876be] rounded flex items-center justify-center text-white text-base font-bold">✓</span>
                <span>軽貨物運送業の個人事業主</span>
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-lg text-gray-700 flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#1876be] rounded flex items-center justify-center text-white text-base font-bold">✓</span>
                <span>スマホだけで記録したい方</span>
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-lg text-gray-700 flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#1876be] rounded flex items-center justify-center text-white text-base font-bold">✓</span>
                <span>書類管理を効率化したい方</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 今後追加予定の機能 */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#fb6c39] mb-4">
              今後追加予定の機能
            </h3>
            <p className="text-gray-600">
              さらに便利になる機能を開発中です
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-dashed border-gray-300">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📊</span>
                <h4 className="text-lg font-bold text-gray-700">運行記録</h4>
              </div>
              <p className="text-sm text-gray-500">日々の運行を詳細に記録</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-dashed border-gray-300">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📈</span>
                <h4 className="text-lg font-bold text-gray-700">実績管理・明細書発行</h4>
              </div>
              <p className="text-sm text-gray-500">配送実績を可視化・明細書を作成</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-dashed border-gray-300">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">💰</span>
                <h4 className="text-lg font-bold text-gray-700">売上管理</h4>
              </div>
              <p className="text-sm text-gray-500">売上の記録と集計を自動化</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-dashed border-gray-300">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">💳</span>
                <h4 className="text-lg font-bold text-gray-700">経費管理</h4>
              </div>
              <p className="text-sm text-gray-500">経費を記録して利益分析に活用</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-dashed border-gray-300">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📄</span>
                <h4 className="text-lg font-bold text-gray-700">請求書発行</h4>
              </div>
              <p className="text-sm text-gray-500">請求書を簡単に作成・発行</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-dashed border-gray-300">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">💻</span>
                <h4 className="text-lg font-bold text-gray-700">Web管理サイト</h4>
              </div>
              <p className="text-sm text-gray-500">PCブラウザでデータ管理</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#1876be] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <Image
              src="/app_icon.png"
              alt="delilog アプリアイコン"
              width={100}
              height={100}
              className="rounded-3xl shadow-lg"
            />
          </div>
          <h3 className="text-3xl font-bold mb-6">
            今すぐ始めよう
          </h3>
          <p className="text-xl text-gray-300 mb-12">
            無料でダウンロードできます
          </p>
          <a
            href="https://apps.apple.com/jp/app/id6753698337"
            className="inline-block hover:opacity-80 transition"
          >
            <Image
              src="/app-store-badge-ja.svg"
              alt="Download on the App Store"
              width={200}
              height={67}
              className="h-14 w-auto"
            />
          </a>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-[#1876be] text-gray-200 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center gap-8 mb-6">
            <Link href="/privacy-policy" className="hover:text-white transition">
              プライバシーポリシー
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition">
              利用規約
            </Link>
          </div>
          <p className="text-sm">
            © 2025 delilog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
