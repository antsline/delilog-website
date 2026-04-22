import Image from "next/image";
import { APP_STORE_URL } from "@/lib/constants";

export function BlogCtaCard() {
  return (
    <aside className="not-prose my-12 rounded-2xl bg-gradient-to-br from-primary-50 via-white to-secondary-50 border border-primary-100 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex-shrink-0">
          <Image src="/icon.png" alt="delilog" width={64} height={64} className="rounded-2xl shadow-md" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-primary mb-1">軽貨物ドライバーのための業務記録アプリ</p>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">点呼・点検・運行記録を1つに</h3>
          <p className="text-sm text-slate-600 mb-4">
            点呼・日常点検は無料で無制限。運行記録などのプレミアム機能は14日間無料で試せます。
          </p>
          <a
            href={APP_STORE_URL}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105"
          >
            App Store でダウンロード
          </a>
        </div>
      </div>
    </aside>
  );
}
