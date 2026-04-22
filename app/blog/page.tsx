import type { Metadata } from "next";
import { BlogArticleCard } from "@/app/components/blog/BlogArticleCard";
import { getAllPostMetas } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog | delilog",
  description:
    "軽貨物ドライバー向けの法令対応・業務効率化に関する情報をお届けします。点呼記録、日常点検、運行記録、改善基準告示など、個人事業主のドライバーが知っておきたいテーマを解説。",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Blog | delilog",
    description:
      "軽貨物ドライバー向けの法令対応・業務効率化に関する情報をお届けします。",
    url: `${SITE_URL}/blog`,
    siteName: "delilog",
    locale: "ja_JP",
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllPostMetas();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <header className="mb-12 sm:mb-16 text-center">
        <p className="text-primary font-semibold tracking-wide uppercase mb-3 text-sm">Blog</p>
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          軽貨物ドライバーのための情報ブログ
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          法令対応・業務効率化・アプリ活用のヒントをお届けします。
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-center text-slate-500">記事は近日公開予定です。</p>
      ) : (
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-1 lg:grid-cols-2">
          {posts.map((post) => (
            <BlogArticleCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
