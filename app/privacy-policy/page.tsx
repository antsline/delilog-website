'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PrivacyPolicy() {
  const searchParams = useSearchParams();
  const isApp = searchParams.get('app') === 'true';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー - アプリからのアクセス時は非表示 */}
      {!isApp && (
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
              ← delilog
            </Link>
          </div>
        </header>
      )}

      {/* コンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          プライバシーポリシー
        </h1>

        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-8">
          <section>
            <p className="text-gray-600 mb-4">
              本プライバシーポリシーは、delilog（以下「当アプリ」）が、ユーザーの個人情報をどのように収集、使用、保護するかについて説明するものです。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              事業者情報
            </h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>運営者：</strong>SOZEL / ソゼル</p>
              <p><strong>連絡先：</strong>support@delilog.app</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. 収集する情報
            </h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1.1 アカウント情報</h3>
                <p>ユーザー登録時に、以下の情報を収集します：</p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>メールアドレス</li>
                  <li>パスワード（暗号化して保存）</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1.2 業務記録データ</h3>
                <p>アプリの機能提供のため、以下の情報を収集します：</p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>車両情報（車両番号、車種など）</li>
                  <li>点検記録（日常点検の結果）</li>
                  <li>点呼記録（業務前・業務後点呼の内容）</li>
                  <li>写真データ（点検時の記録写真）</li>
                  <li>プロフィール情報（運転者名、事業者名など）</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1.3 位置情報</h3>
                <p>
                  ユーザーの許可を得た場合のみ、天気情報取得のための概算位置情報を取得します。
                  バックグラウンドでの位置情報の取得は行いません。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. 情報の使用目的
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>収集した情報は、以下の目的で使用します：</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>ユーザー認証およびアカウント管理</li>
                <li>業務記録の保存および同期</li>
                <li>天気情報の提供</li>
                <li>アプリの機能向上およびサポート対応</li>
                <li>重要なお知らせの配信</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. 情報の共有
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>当アプリは、以下の場合を除き、ユーザーの個人情報を第三者と共有することはありません：</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>ユーザーの同意がある場合</li>
                <li>法令に基づく開示が必要な場合</li>
                <li>ユーザーまたは第三者の生命、身体、財産の保護のために必要な場合</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. データの保存とセキュリティ
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                ユーザーの情報は、Supabase（クラウドデータベース）に暗号化して保存されます。
                当アプリは、業界標準のセキュリティ対策を実施し、不正アクセス、改ざん、漏洩からデータを保護します。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. ユーザーの権利
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>ユーザーは、以下の権利を有します：</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>自己の個人情報へのアクセス</li>
                <li>個人情報の訂正または削除の要求</li>
                <li>アカウントの削除</li>
              </ul>
              <p className="mt-2">
                これらの権利を行使する場合は、アプリ内の設定画面またはサポートまでお問い合わせください。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. クッキーおよび類似技術
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                当アプリは、認証およびセッション管理のためにクッキーを使用します。
                これらは、ユーザーのログイン状態を維持するために必要です。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. 子どものプライバシー
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                当アプリは、13歳未満の子どもから意図的に個人情報を収集しません。
                保護者の方で、お子様が個人情報を提供したと思われる場合は、サポートまでご連絡ください。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. プライバシーポリシーの変更
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                当アプリは、本プライバシーポリシーを随時更新する場合があります。
                変更があった場合は、アプリ内またはWebサイトにて通知します。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. お問い合わせ
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                本プライバシーポリシーに関するご質問やご意見がある場合は、以下までお問い合わせください：
              </p>
              <p className="font-semibold mt-4">
                メール: support@delilog.app
              </p>
            </div>
          </section>

          <section className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              最終更新日: 2025年10月30日
            </p>
          </section>
        </div>
      </main>

      {/* フッター - アプリからのアクセス時は非表示 */}
      {!isApp && (
        <footer className="bg-gray-900 text-gray-400 py-12 px-4 mt-20">
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
      )}
    </div>
  );
}
