'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TermsOfServiceContent() {
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
          利用規約
        </h1>

        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-8">
          <section>
            <p className="text-gray-600 mb-4">
              本利用規約（以下「本規約」）は、delilog（以下「当アプリ」）の利用条件を定めるものです。
              ユーザーは、当アプリを利用することにより、本規約に同意したものとみなされます。
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
              第1条（適用）
            </h2>
            <div className="space-y-2 text-gray-600">
              <ol className="list-decimal list-inside space-y-2">
                <li>本規約は、当アプリの提供者（以下「当方」）とユーザーとの間の当アプリの利用に関わる一切の関係に適用されます。</li>
                <li>当方が当アプリ上で掲載する利用に関するルール等は、本規約の一部を構成します。</li>
                <li>本規約の内容と前項のルール等の内容が矛盾する場合は、ルール等の内容が優先されます。</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第2条（定義）
            </h2>
            <div className="space-y-2 text-gray-600">
              <ol className="list-decimal list-inside space-y-2">
                <li><strong>サービス</strong>：当アプリが提供する運送業務記録管理サービス</li>
                <li><strong>ユーザー</strong>：当アプリを利用する個人または法人</li>
                <li><strong>登録情報</strong>：ユーザーが当アプリに登録した情報</li>
                <li><strong>業務記録</strong>：日常点検記録、点呼記録、運行記録、事故記録等のユーザーが入力した業務データ</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第3条（アカウント登録）
            </h2>
            <div className="space-y-2 text-gray-600">
              <ol className="list-decimal list-inside space-y-2">
                <li>ユーザーは、当アプリの利用にあたり、正確な情報を登録する必要があります。</li>
                <li>ユーザーは、登録したメールアドレスとパスワードを自己の責任で管理するものとします。</li>
                <li>ユーザーは、登録情報に変更があった場合、速やかに変更の手続きを行うものとします。</li>
                <li>アカウントの貸与、譲渡、売買等は禁止します。</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第4条（サービスの内容）
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>当アプリは、以下の機能を提供します。</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>車両管理機能</li>
                <li>日常点検記録の作成・保存</li>
                <li>点呼記録（業務前・業務後）の作成・保存</li>
                <li>運行記録の作成・保存</li>
                <li>事故記録の作成・保存</li>
                <li>記録のPDF出力・共有機能</li>
                <li>データ同期機能（クラウドバックアップ）</li>
                <li>その他、当方が随時提供する機能</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第5条（利用料金・サブスクリプション）
            </h2>
            <div className="space-y-2 text-gray-600">
              <ol className="list-decimal list-inside space-y-2">
                <li>当アプリの基本機能は無料で提供します。</li>
                <li>当アプリは「delilog Premium」（有料プラン）を提供しています。</li>
                <li>delilog Premiumは、Apple App Store を通じた自動更新サブスクリプションです。</li>
                <li>
                  サブスクリプションの詳細は以下の通りです。
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>月額プラン：1ヶ月ごとの自動更新</li>
                    <li>年額プラン：1年ごとの自動更新</li>
                    <li>各プランの価格はアプリ内の購入画面に表示されます</li>
                    <li>初回登録時に14日間の無料トライアルが付与されます</li>
                  </ul>
                </li>
                <li>
                  サブスクリプションの課金について
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>購入はApple IDに紐づくお支払い方法に請求されます</li>
                    <li>サブスクリプション期間終了の少なくとも24時間前にキャンセルしない限り、自動的に更新されます</li>
                    <li>サブスクリプションの管理・キャンセルは、端末の「設定」アプリから行うことができます</li>
                  </ul>
                </li>
                <li>返金については、Appleの返金ポリシーに従います。</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第6条（禁止事項）
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>ユーザーは、当アプリの利用にあたり、以下の行為をしてはなりません：</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>当アプリのサーバーまたはネットワークに過度な負荷をかける行為</li>
                <li>当アプリの運営を妨害する行為</li>
                <li>不正アクセス、クラッキング等の行為</li>
                <li>他のユーザーの情報を不正に収集・利用する行為</li>
                <li>他のユーザーになりすます行為</li>
                <li>リバースエンジニアリング、逆コンパイル、逆アセンブル等の行為</li>
                <li>当アプリの知的財産権を侵害する行為</li>
                <li>当方または第三者に不利益、損害を与える行為</li>
                <li>その他、当方が不適切と判断する行為</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第7条（サービスの停止・変更）
            </h2>
            <div className="space-y-2 text-gray-600">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  当方は、以下の場合、事前の通知なくサービスの全部または一部を停止できます。
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>システムの保守・点検を行う場合</li>
                    <li>天災地変、停電等の不可抗力により提供できない場合</li>
                    <li>その他、当方がやむを得ないと判断した場合</li>
                  </ul>
                </li>
                <li>当方は、サービスの内容を変更または終了することができます。重要な変更の場合は事前に通知します。</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第8条（免責事項）
            </h2>
            <div className="space-y-2 text-gray-600">
              <ol className="list-decimal list-inside space-y-2">
                <li>当方は、当アプリの正確性、完全性、有用性、安全性等について、いかなる保証も行いません。</li>
                <li><strong>当アプリで作成した記録の法的効力、運輸局監査での受理可否等について、当方は一切保証しません。</strong></li>
                <li><strong>法令遵守、記録の真正性確保、最終的な業務判断は、ユーザーの責任で行ってください。</strong></li>
                <li>当アプリの利用により生じた損害について、当方は一切の責任を負いません。ただし、当方の故意または重過失による場合を除きます。</li>
                <li>当方は、ユーザー間またはユーザーと第三者との間で生じたトラブルについて、一切の責任を負いません。</li>
                <li>データの消失、バックアップの失敗等について、当方は責任を負いません。重要なデータは、ユーザー自身でもバックアップを取ることを推奨します。</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第9条（知的財産権）
            </h2>
            <div className="space-y-2 text-gray-600">
              <ol className="list-decimal list-inside space-y-2">
                <li>当アプリに関する知的財産権は、すべて当方または正当な権利者に帰属します。</li>
                <li>本規約に基づく当アプリの利用許諾は、当アプリに関する知的財産権の使用許諾を意味するものではありません。</li>
                <li>ユーザーが作成した業務記録の著作権は、ユーザーに帰属します。</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第10条（データの取り扱い）
            </h2>
            <div className="space-y-2 text-gray-600">
              <ol className="list-decimal list-inside space-y-2">
                <li>ユーザーの個人情報の取り扱いについては、別途定める<Link href="/privacy-policy" className="text-blue-600 hover:underline">プライバシーポリシー</Link>に従います。</li>
                <li>当方は、ユーザーが入力した業務記録を、サービス提供の目的でクラウドに保存します。</li>
                <li>運転者名・事業者名は、デバイスローカルにのみ保存され、クラウドには送信されません。</li>
                <li>
                  当方は、以下の場合、ユーザーの業務記録を閲覧・利用することがあります。
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>ユーザーからのサポート依頼に対応する場合</li>
                    <li>サービス改善のための統計データとして利用する場合（匿名化）</li>
                    <li>法令に基づく開示要請があった場合</li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第11条（アカウント削除・利用停止）
            </h2>
            <div className="space-y-2 text-gray-600">
              <ol className="list-decimal list-inside space-y-2">
                <li>ユーザーは、いつでもアカウントを削除できます。</li>
                <li>
                  当方は、ユーザーが以下に該当する場合、事前通知なくアカウントを停止または削除できます。
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>本規約に違反した場合</li>
                    <li>登録情報に虚偽があった場合</li>
                    <li>1年以上ログインがない場合</li>
                    <li>その他、当方が不適切と判断した場合</li>
                  </ul>
                </li>
                <li>アカウント削除後、ユーザーの業務記録は削除されます（法令で保存が必要な場合を除く）。</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第12条（保証の否認）
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>当アプリは「現状有姿」で提供されます。当方は、以下について保証しません。</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>サービスがユーザーの特定の目的に適合すること</li>
                <li>サービスに不具合がないこと</li>
                <li>サービスが中断しないこと</li>
                <li>データが消失しないこと</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第13条（規約の変更）
            </h2>
            <div className="space-y-2 text-gray-600">
              <ol className="list-decimal list-inside space-y-2">
                <li>当方は、必要に応じて本規約を変更できます。</li>
                <li>変更後の規約は、当アプリ内での表示またはメール通知により、ユーザーに通知されます。</li>
                <li>変更後もサービスを利用し続けた場合、変更後の規約に同意したものとみなします。</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第14条（準拠法・裁判管轄）
            </h2>
            <div className="space-y-2 text-gray-600">
              <ol className="list-decimal list-inside space-y-2">
                <li>本規約の準拠法は日本法とします。</li>
                <li>本規約に関する紛争については、仙台地方裁判所を第一審の専属的合意管轄裁判所とします。</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第15条（お問い合わせ）
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                本規約に関するお問い合わせは、以下までご連絡ください：
              </p>
              <p className="font-semibold mt-4">
                メール: support@delilog.app
              </p>
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

export default function TermsOfService() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <TermsOfServiceContent />
    </Suspense>
  );
}
