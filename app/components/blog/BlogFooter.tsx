import Image from "next/image";
import Link from "next/link";

export function BlogFooter() {
  return (
    <footer className="bg-white border-t border-slate-100 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icon.png" alt="delilog" width={24} height={24} className="rounded" />
            <span className="font-bold text-slate-700">delilog</span>
          </Link>
          <div className="flex gap-8 text-sm text-slate-600">
            <Link href="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">
              プライバシーポリシー
            </Link>
            <Link href="/terms-of-service" className="hover:text-primary transition-colors">
              利用規約
            </Link>
          </div>
          <p className="text-sm text-slate-400">&copy; 2025-2026 delilog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
