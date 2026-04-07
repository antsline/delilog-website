'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PrivacyPolicyContent() {
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
              Delilog（以下「当アプリ」）は、ユーザーの皆様のプライバシーを尊重し、個人情報の保護に努めます。本プライバシーポリシーは、当アプリがどのような情報を収集し、どのように利用・管理するかについて説明するものです。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              事業者情報
            </h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>アプリ名：</strong>Delilog（デリログ）</p>
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
                <h3 className="font-semibold text-gray-900 mb-2">1.1 ユーザーが提供する情報</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>アカウント情報</strong>：メールアドレス、パスワード（暗号化保存）</li>
                  <li>
                    <strong>業務記録情報</strong>：
                    <ul className="list-disc list-inside ml-8 mt-1 space-y-1">
                      <li>車両情報（車両番号、車種等）</li>
                      <li>日常点検記録（点検日時、点検項目、点検結果）</li>
                      <li>点呼記録（点呼日時、点呼方法、アルコールチェック結果等）</li>
                      <li>運行記録（出発・到着日時、場所、走行距離、荷役・待機情報等）</li>
                      <li>事故記録（発生日時、場所、状況、損害情報等）</li>
                      <li>署名データ（点呼記録用）</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1.2 ローカル保存のみの情報（サーバー送信なし）</h3>
                <p><strong>運転者名・事業者名</strong>：PDF出力用にデバイスローカルにのみ保存され、サーバーには送信されません。</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1.3 自動的に収集される情報</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>デバイス情報</strong>：端末識別子（匿名化）、OSバージョン</li>
                  <li><strong>利用状況</strong>：アプリの利用状況、エラーログ（匿名）</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1.4 位置情報</h3>
                <p>
                  ユーザーの許可を得た場合のみ、天気情報取得のための概算位置情報を取得します。
                  バックグラウンドでの位置情報の取得は行いません。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. 情報の利用目的
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>収集した情報は、以下の目的で利用します：</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>サービスの提供・運営</li>
                <li>ユーザーサポート・問い合わせ対応</li>
                <li>サービスの改善・新機能の開発</li>
                <li>統計データの作成（匿名化）</li>
                <li>不正利用の防止・セキュリティ対策</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. 情報の保存場所と期間
            </h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">3.1 保存場所</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>ローカルストレージ</strong>：デバイス内のSQLiteデータベース（OS標準暗号化）</li>
                  <li><strong>クラウドストレージ</strong>：Supabase（PostgreSQL）- 認証情報と業務記録のみ</li>
                </ul>
                <p className="mt-2 ml-4">運転者名・事業者名はクラウドに保存されません。</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">3.2 保存期間</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>業務記録</strong>：法令に基づき最低1年間保存（ユーザーが削除するまで保持）</li>
                  <li><strong>アカウント情報</strong>：アカウント削除まで保持</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. 第三者への提供
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>当アプリは、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>ユーザーの同意がある場合</li>
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要な場合</li>
              </ul>
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900 mb-2">利用している第三者サービス</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Supabase</strong>（認証・データベース）：米国・欧州、GDPR準拠</li>
                  <li><strong>Sentry</strong>（エラー監視）：匿名化されたエラーログのみ</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. セキュリティ
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>当アプリは、情報の安全性を確保するため、以下の対策を実施しています。</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>通信の暗号化（HTTPS/TLS）</li>
                <li>パスワードのハッシュ化保存</li>
                <li>データベースアクセスの認証・認可</li>
                <li>ローカルデータのOS標準暗号化</li>
                <li>定期的なセキュリティアップデート</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. ユーザーの権利
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>ユーザーは、自身の個人情報について以下の権利を有します：</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>アクセス権</strong>：自身の情報の確認</li>
                <li><strong>訂正権</strong>：誤った情報の修正</li>
                <li><strong>削除権</strong>：アカウント削除による全データの削除</li>
                <li><strong>データポータビリティ</strong>：データのエクスポート（PDF形式）</li>
              </ul>
              <p className="mt-2">
                これらの権利を行使する場合は、アプリ内の設定またはお問い合わせ先までご連絡ください。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Cookie・トラッキング技術
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                当アプリは、現時点でCookieやトラッキング技術を使用していません。将来的に使用する場合は、本ポリシーを更新してお知らせします。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. 子どものプライバシー
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                当アプリは、13歳未満の子どもを対象としたサービスではありません。13歳未満の方の個人情報を故意に収集することはありません。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. プライバシーポリシーの変更
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                当アプリは、本ポリシーを必要に応じて変更することがあります。重要な変更がある場合は、アプリ内通知またはメールでお知らせします。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. お問い合わせ
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                本ポリシーに関するご質問・ご意見は、以下までご連絡ください：
              </p>
              <p className="font-semibold mt-4">
                メール: support@delilog.app
              </p>
              <p>対応時間：平日 9:00-17:00（土日祝日を除く）</p>
            </div>
          </section>

          <section className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              最終更新日: 2026年4月7日
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
              © 2026 delilog. All rights reserved.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <PrivacyPolicyContent />
    </Suspense>
  );
}
