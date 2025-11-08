import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">delilog</h1>
          <nav className="flex gap-6">
            <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900">
              プライバシーポリシー
            </Link>
            <Link href="/terms-of-service" className="text-gray-600 hover:text-gray-900">
              利用規約
            </Link>
          </nav>
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
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                delilog
              </h2>
              <p className="text-xl lg:text-2xl text-gray-700 mb-4 leading-relaxed">
                軽運送自営業者向けの業務管理アプリ
              </p>
              <p className="text-lg lg:text-xl text-gray-600 mb-6 leading-relaxed">
                車両日常点検・業務前点呼・業務後点呼を簡単に記録
              </p>
              <ul className="text-base lg:text-lg text-gray-600 mb-12 space-y-2">
                <li>✓ 法定の点検・点呼項目に対応</li>
                <li>✓ オフラインでも記録可能</li>
                <li>✓ PDF出力で書類作成も簡単</li>
              </ul>
              <div className="flex justify-center lg:justify-start gap-4">
                <a
                  href="https://apps.apple.com/jp/app/id6753698337"
                  className="inline-block bg-black text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition"
                >
                  App Storeでダウンロード
                </a>
              </div>
            </div>

            {/* 右側：モックアップ画像 */}
            <div className="flex-1 flex justify-center">
              <Image
                src="/screenshot_mockup_1.png"
                alt="delilog アプリ画面"
                width={400}
                height={800}
                className="max-w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 機能紹介 */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-16">
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
                <h4 className="text-xl font-bold text-gray-900 mb-3">
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
                <h4 className="text-xl font-bold text-gray-900 mb-3">
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
                <h4 className="text-xl font-bold text-gray-900 mb-3">
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
                <h4 className="text-xl font-bold text-gray-900 mb-3">
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
                <h4 className="text-xl font-bold text-gray-900 mb-3">
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
                <h4 className="text-xl font-bold text-gray-900 mb-3">
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
          <h3 className="text-3xl font-bold text-gray-900 mb-12">
            こんな方におすすめ
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-lg text-gray-700">✓ 運送事業者</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-lg text-gray-700">✓ 配送ドライバー</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-lg text-gray-700">✓ 軽貨物ドライバー</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-lg text-gray-700">✓ 運行管理者</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">
            今すぐ始めよう
          </h3>
          <p className="text-xl text-gray-300 mb-12">
            無料でダウンロードできます
          </p>
          <a
            href="https://apps.apple.com/jp/app/id6753698337"
            className="inline-block bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition"
          >
            App Storeでダウンロード
          </a>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
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
