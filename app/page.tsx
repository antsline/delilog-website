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
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            delilog
          </h2>
          <p className="text-2xl text-gray-700 mb-4">
            配送業務管理
          </p>
          <p className="text-xl text-gray-600 mb-12">
            運送業務の記録を一元管理
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            配送・運送業向けの業務記録管理アプリ。車両日常点検、業務前点呼、業務後点呼を簡単に記録。PDF出力で書類作成も効率化。オフライン対応で現場でも安心。
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#"
              className="inline-block bg-black text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition"
            >
              App Storeでダウンロード
            </a>
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
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="text-4xl mb-4">📋</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                車両日常点検
              </h4>
              <ul className="text-gray-600 space-y-2">
                <li>・法定点検項目を網羅</li>
                <li>・写真撮影で異常箇所を記録</li>
                <li>・点検履歴の一覧表示</li>
                <li>・PDF出力で報告書類を作成</li>
              </ul>
            </div>

            {/* 業務前点呼・業務後点呼 */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="text-4xl mb-4">📝</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                業務前点呼・業務後点呼
              </h4>
              <ul className="text-gray-600 space-y-2">
                <li>・アルコールチェック記録</li>
                <li>・健康状態の確認</li>
                <li>・車両状態の記録</li>
                <li>・点呼記録簿のPDF出力</li>
              </ul>
            </div>

            {/* オフライン対応 */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="text-4xl mb-4">📱</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                オフライン対応
              </h4>
              <ul className="text-gray-600 space-y-2">
                <li>・ネット接続なしでも記録可能</li>
                <li>・オンライン復帰時に自動同期</li>
                <li>・現場での使用に最適</li>
              </ul>
            </div>

            {/* データ管理 */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="text-4xl mb-4">☁️</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                データ管理
              </h4>
              <ul className="text-gray-600 space-y-2">
                <li>・クラウドバックアップで安心</li>
                <li>・複数車両の管理に対応</li>
                <li>・期間指定でPDF一括出力</li>
              </ul>
            </div>

            {/* シンプルなデザイン */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="text-4xl mb-4">✨</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                使いやすいデザイン
              </h4>
              <ul className="text-gray-600 space-y-2">
                <li>・直感的な操作画面</li>
                <li>・法令に準拠した記録項目</li>
                <li>・書類作成の手間を大幅削減</li>
              </ul>
            </div>

            {/* データの安全性 */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                データの安全性
              </h4>
              <ul className="text-gray-600 space-y-2">
                <li>・データの紛失リスクを軽減</li>
                <li>・セキュアなクラウド保存</li>
                <li>・いつでもデータにアクセス</li>
              </ul>
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
            href="#"
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
