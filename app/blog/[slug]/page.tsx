import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { BlogCtaCard } from "@/app/components/blog/BlogCtaCard";
import { TableOfContents } from "@/app/components/blog/TableOfContents";
import { formatJapaneseDate, getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { APP_STORE_URL, SITE_URL } from "@/lib/constants";

const DEFAULT_OG_IMAGE = "/icon.png";

function escapeJsonLd(json: string): string {
  return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "記事が見つかりません | delilog",
    };
  }

  const url = `${SITE_URL}/blog/${post.slug}`;
  const ogImage = post.ogImage ?? DEFAULT_OG_IMAGE;

  return {
    title: `${post.title} | delilog`,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: "delilog",
      locale: "ja_JP",
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      images: [
        {
          url: ogImage,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const url = `${SITE_URL}/blog/${post.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: post.author ?? "delilog編集部",
    },
    publisher: {
      "@type": "Organization",
      name: "delilog",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: url,
      },
    ],
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(structuredData)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(breadcrumbData)) }}
      />

      <nav className="mb-8 text-sm" aria-label="パンくず">
        <Link href="/blog" className="inline-flex items-center gap-1 text-slate-500 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Blog 一覧に戻る
        </Link>
      </nav>

      <header className="mb-10">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <time dateTime={post.date}>{formatJapaneseDate(post.date)}</time>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-4 h-4" />
            約{post.readingTimeMin}分で読めます
          </span>
          {post.author && (
            <>
              <span className="text-slate-300">•</span>
              <span>{post.author}</span>
            </>
          )}
        </div>
      </header>

      {(() => {
        const proseClassName =
          "prose prose-slate prose-lg max-w-none " +
          "prose-headings:tracking-tight prose-headings:scroll-mt-24 " +
          "prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-200 " +
          "prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 " +
          "prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-2 " +
          "prose-p:leading-relaxed prose-p:text-slate-700 " +
          "prose-a:text-primary prose-a:no-underline hover:prose-a:underline " +
          "prose-strong:text-slate-900 prose-strong:font-semibold " +
          "prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-slate-700 " +
          "prose-ul:my-4 prose-ol:my-4 prose-li:my-1 " +
          "prose-table:text-sm prose-th:bg-slate-50 prose-th:font-semibold prose-th:text-slate-900 " +
          "prose-code:text-primary prose-code:bg-primary/5 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none " +
          "prose-hr:border-slate-200 prose-hr:my-10 " +
          "prose-img:rounded-2xl prose-img:border prose-img:border-slate-200 prose-img:shadow-sm prose-img:my-10 prose-img:mx-auto";

        if (post.contentHtmlAfterToc) {
          return (
            <>
              <div
                className={proseClassName}
                dangerouslySetInnerHTML={{ __html: post.contentHtmlBeforeToc }}
              />
              <TableOfContents headings={post.headings} />
              <div
                className={proseClassName}
                dangerouslySetInnerHTML={{ __html: post.contentHtmlAfterToc }}
              />
            </>
          );
        }

        return (
          <>
            <TableOfContents headings={post.headings} />
            <div
              className={proseClassName}
              dangerouslySetInnerHTML={{ __html: post.contentHtmlBeforeToc }}
            />
          </>
        );
      })()}

      <BlogCtaCard />

      <div className="mt-16 pt-8 border-t border-slate-200 flex items-center justify-between">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Blog 一覧に戻る
        </Link>
        <a
          href={APP_STORE_URL}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <Image src="/icon.png" alt="" width={20} height={20} className="rounded" />
          delilog を試してみる
        </a>
      </div>
    </article>
  );
}
