import Link from "next/link";
import { Clock } from "lucide-react";
import type { BlogPostMeta } from "@/lib/blog";
import { formatJapaneseDate } from "@/lib/blog";

export function BlogArticleCard({ post }: { post: BlogPostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-primary hover:shadow-lg"
    >
      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
        <time dateTime={post.date}>{formatJapaneseDate(post.date)}</time>
        <span className="text-slate-300">•</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          約{post.readingTimeMin}分で読めます
        </span>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-primary transition-colors">
        {post.title}
      </h2>

      <p className="text-slate-600 leading-relaxed mb-4 line-clamp-3">{post.description}</p>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
