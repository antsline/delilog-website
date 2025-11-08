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
              <p><strong>運営者：</strong>SOZEL / ソゼル</p>
              <p><strong>連絡先：</strong>support@delilog.app</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第1条（適用）
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                本規約は、当アプリの提供するサービス（以下「本サービス」）の利用に関する条件を、
                ユーザーと当アプリとの間で定めるものです。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第2条（利用登録）
            </h2>
            <div className="space-y-2 text-gray-600">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  本サービスの利用を希望する者は、本規約に同意の上、当アプリの定める方法によって利用登録を申請し、
                  当アプリがこれを承認することによって、利用登録が完了するものとします。
                </li>
                <li>
                  当アプリは、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあります：
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                    <li>本規約に違反したことがある者からの申請である場合</li>
                    <li>その他、当アプリが利用登録を相当でないと判断した場合</li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第3条（アカウント管理）
            </h2>
            <div className="space-y-2 text-gray-600">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  ユーザーは、自己の責任において、本サービスのアカウント情報を適切に管理するものとします。
                </li>
                <li>
                  ユーザーは、いかなる場合にも、アカウント情報を第三者に譲渡または貸与し、
                  もしくは第三者と共用することはできません。
                </li>
                <li>
                  アカウント情報の管理不十分、使用上の過誤、第三者の使用等によって生じた損害に関する責任は、
                  ユーザーが負うものとします。
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第4条（禁止事項）
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません：</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>当アプリのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                <li>当アプリのサービスの運営を妨害するおそれのある行為</li>
                <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                <li>不正アクセスをし、またはこれを試みる行為</li>
                <li>他のユーザーに成りすます行為</li>
                <li>当アプリが許諾しない本サービス上での宣伝、広告、勧誘、または営業行為</li>
                <li>当アプリのサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
                <li>その他、当アプリが不適切と判断する行為</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第5条（本サービスの提供の停止等）
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                当アプリは、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく
                本サービスの全部または一部の提供を停止または中断することができるものとします：
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                <li>その他、当アプリが本サービスの提供が困難と判断した場合</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第6条（著作権）
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                本サービスおよび本サービスに関連するすべてのコンテンツの著作権は、当アプリまたは正当な権利を有する第三者に帰属します。
                ユーザーは、これらを当アプリの許可なく複製、転載、公衆送信、改変その他の利用をすることはできません。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第7条（利用制限および登録抹消）
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                当アプリは、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、
                ユーザーに対して、本サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします：
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>本規約のいずれかの条項に違反した場合</li>
                <li>登録事項に虚偽の事実があることが判明した場合</li>
                <li>その他、当アプリが本サービスの利用を適当でないと判断した場合</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第8条（保証の否認および免責事項）
            </h2>
            <div className="space-y-2 text-gray-600">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  当アプリは、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、
                  特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます）
                  がないことを保証するものではありません。
                </li>
                <li>
                  当アプリは、本サービスに起因してユーザーに生じたあらゆる損害について、一切の責任を負いません。
                </li>
                <li>
                  当アプリは、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた
                  取引、連絡または紛争等について一切責任を負いません。
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第9条（サービス内容の変更等）
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                当アプリは、ユーザーに通知することなく、本サービスの内容を変更し、または本サービスの提供を中止することができるものとし、
                これによってユーザーに生じた損害について一切の責任を負いません。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第10条（利用規約の変更）
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                当アプリは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
                変更後の本規約は、当アプリウェブサイトまたはアプリ内に掲示された時点で効力を生じるものとします。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第11条（個人情報の取扱い）
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                当アプリは、本サービスの利用によって取得する個人情報については、
                当アプリの<Link href="/privacy-policy" className="text-blue-600 hover:underline">プライバシーポリシー</Link>に従い適切に取り扱うものとします。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第12条（通知または連絡）
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                ユーザーと当アプリとの間の通知または連絡は、当アプリの定める方法によって行うものとします。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第13条（権利義務の譲渡の禁止）
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                ユーザーは、当アプリの書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、
                または担保に供することはできません。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第14条（準拠法・裁判管轄）
            </h2>
            <div className="space-y-2 text-gray-600">
              <ol className="list-decimal list-inside space-y-2">
                <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
                <li>
                  本サービスに関して紛争が生じた場合には、当アプリの所在地を管轄する裁判所を専属的合意管轄とします。
                </li>
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

export default function TermsOfService() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <TermsOfServiceContent />
    </Suspense>
  );
}
