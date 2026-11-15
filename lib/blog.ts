import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkCjkFriendly from "remark-cjk-friendly";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { blogLinkCampaign, tagStoreLinks } from "@/lib/storeCampaign";
import { inlinePlacement } from "@/lib/storeNaming.mjs";
import { blogQrSrc } from "@/lib/blogQr";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const SLUG_PATTERN = /^[a-z0-9-]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export type BlogFrontmatter = {
  title: string;
  description: string;
  date: string;
  /** 作り直し・大きな書き直しをした日（YYYY-MM-DD）。無ければ date と同じ扱い */
  updated?: string;
  slug: string;
  ogImage?: string;
  tags?: string[];
  author?: string;
  // 記事末尾のカード（BlogCtaCard）の見出しと本文。無ければ共通の文言
  ctaTitle?: string;
  ctaBody?: string;
};

export type BlogPostMeta = BlogFrontmatter;

export type BlogHeading = {
  id: string;
  text: string;
  level: 2;
};

export type BlogPost = BlogPostMeta & {
  // PC 表示のカードに出す記事別の QR 画像のパス
  qrSrc: string;
  contentHtmlBeforeToc: string;
  contentHtmlAfterToc: string;
  rawContent: string;
  headings: BlogHeading[];
};

const TOC_MARKER = "<!--TOC-->";

async function readMarkdownFile(filename: string): Promise<{ data: BlogFrontmatter; content: string }> {
  const filePath = path.join(BLOG_DIR, filename);
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = matter(raw);
  const data = parsed.data as BlogFrontmatter;

  if (!data.title || !data.description || !data.date || !data.slug) {
    throw new Error(
      `Blog post ${filename} is missing required frontmatter (title/description/date/slug).`,
    );
  }

  for (const key of ["ctaTitle", "ctaBody"] as const) {
    if (data[key] !== undefined && typeof data[key] !== "string") {
      throw new Error(`Blog post ${filename}: frontmatter ${key} must be a string.`);
    }
  }

  if (data.updated !== undefined) {
    if (!DATE_PATTERN.test(String(data.updated))) {
      throw new Error(`Blog post ${filename}: updated must be YYYY-MM-DD (got ${String(data.updated)}).`);
    }
    if (String(data.updated) <= String(data.date)) {
      throw new Error(`Blog post ${filename}: updated (${data.updated}) must be after date (${data.date}).`);
    }
  }

  return { data, content: parsed.content };
}

/** 最後に中身を変えた日。サイトマップ・構造化データの dateModified に使う */
export function lastModifiedDate(post: Pick<BlogFrontmatter, "date" | "updated">): string {
  return post.updated ?? post.date;
}

// Note: sanitize: false は、content/blog/ 配下が内部執筆のみである前提に基づく。
// 外部寄稿や CMS 取り込みを受け入れる場合は、rehype-sanitize を挟むか sanitize: true に切り替えること。
async function markdownToHtml(markdown: string): Promise<string> {
  const processed = await remark()
    .use(remarkCjkFriendly)
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  return String(processed);
}

function extractH2Headings(markdown: string): BlogHeading[] {
  const headings: BlogHeading[] = [];
  const lines = markdown.split("\n");
  let inFencedCode = false;
  let index = 0;

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFencedCode = !inFencedCode;
      continue;
    }
    if (inFencedCode) continue;

    const match = line.match(/^##\s+(.+?)\s*$/);
    if (!match) continue;

    const text = match[1]
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/`(.+?)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim();

    headings.push({ id: `section-${index}`, text, level: 2 });
    index++;
  }

  return headings;
}

function injectHeadingIds(html: string, headings: BlogHeading[]): string {
  let i = 0;
  return html.replace(/<h2(\s[^>]*)?>/g, (match, attrs: string | undefined) => {
    if (i >= headings.length) return match;
    const id = headings[i].id;
    i++;
    if (attrs && /\bid\s*=/.test(attrs)) {
      return match;
    }
    return `<h2 id="${id}"${attrs ?? ""}>`;
  });
}

// PC で読んでいる人向けの QR（app/components/blog/DesktopQr.tsx と同じ見た目）。スマホでは出さない。
function desktopQrHtml(qrSrc: string): string {
  return [
    '<div class="hidden lg:flex flex-col items-center flex-shrink-0 gap-1.5">',
    `<img src="${qrSrc}" alt="delilog のダウンロード用QRコード" width="96" height="96" class="rounded-md" loading="lazy" />`,
    '<span class="text-[11px] leading-tight text-slate-500 text-center">スマホで読み取って<br />インストール</span>',
    '</div>',
  ].join('');
}

function transformInlineCtas(html: string, slug: string, qrSrc: string): string {
  let ctaIndex = 0;
  // <!--CTA:top--> は記事の冒頭のカード（data-cta="top"）。inline-N の番号には数えない。
  return html.replace(/<!--CTA(:top)?-->\s*([\s\S]*?)\s*<!--\/CTA-->/g, (_match, top: string | undefined, rawInner: string) => {
    if (!top) {
      ctaIndex += 1;
    }
    const placement = top ? "top" : inlinePlacement(ctaIndex);
    const dataCta = top ? "top" : `inline-${ctaIndex}`;
    const inner = tagStoreLinks(rawInner, blogLinkCampaign(slug, placement));
    return [
      `<aside data-cta="${dataCta}" class="not-prose my-12 rounded-2xl bg-gradient-to-br from-primary-50 via-white to-secondary-50 border border-primary-100 p-6 sm:p-8">`,
      '<div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">',
      '<div class="flex-shrink-0">',
      '<img src="/icon.png" alt="delilog" width="64" height="64" class="rounded-2xl shadow-md" />',
      '</div>',
      '<div class="flex-1">',
      '<p class="text-sm mb-1">',
      '<span class="font-bold text-slate-900">delilog</span>',
      '<span class="mx-1.5 text-slate-300">·</span>',
      '<span class="font-semibold text-primary">軽貨物ドライバーのための業務記録アプリ</span>',
      '</p>',
      '<div class="inline-cta-body">',
      inner.trim(),
      '</div>',
      '</div>',
      desktopQrHtml(qrSrc),
      '</div>',
      '</aside>',
    ].join('');
  });
}

// テンプレDL系記事の冒頭に置く「即ダウンロード」ボックス。
// 検索意図（テンプレを今すぐDLしたい）に最短で応えつつ、離脱前にアプリ導線を1つ確保する。
function transformDlBoxes(html: string, slug: string): string {
  return html.replace(/<!--DLBOX-->\s*([\s\S]*?)\s*<!--\/DLBOX-->/g, (_match, rawInner: string) => {
    const inner = tagStoreLinks(rawInner, blogLinkCampaign(slug, "dlbox"));
    return [
      '<aside data-cta="dlbox" class="not-prose my-10 rounded-2xl border-2 border-primary/30 bg-white p-6 sm:p-7 shadow-sm">',
      '<div class="dlbox-body">',
      inner.trim(),
      '</div>',
      '</aside>',
    ].join('');
  });
}

export async function getAllPostMetas(): Promise<BlogPostMeta[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(BLOG_DIR);
  } catch {
    return [];
  }

  const files = entries.filter((entry) => entry.endsWith(".md"));
  const metas = await Promise.all(
    files.map(async (filename) => {
      const { data } = await readMarkdownFile(filename);
      return { ...data };
    }),
  );

  return metas.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!SLUG_PATTERN.test(slug)) {
    return null;
  }

  const filename = `${slug}.md`;
  const resolvedPath = path.join(BLOG_DIR, filename);
  if (!resolvedPath.startsWith(BLOG_DIR + path.sep)) {
    return null;
  }

  try {
    const { data, content } = await readMarkdownFile(filename);
    const headings = extractH2Headings(content);
    const rawHtml = await markdownToHtml(content);
    const qrSrc = blogQrSrc(slug);
    // カードの中のリンクは配置ごとに印を付け、残った素のリンクは body として付ける。
    const contentHtml = tagStoreLinks(
      transformDlBoxes(transformInlineCtas(injectHeadingIds(rawHtml, headings), slug, qrSrc), slug),
      blogLinkCampaign(slug, "body"),
    );

    const markerIdx = contentHtml.indexOf(TOC_MARKER);
    const contentHtmlBeforeToc =
      markerIdx >= 0 ? contentHtml.slice(0, markerIdx) : contentHtml;
    const contentHtmlAfterToc =
      markerIdx >= 0 ? contentHtml.slice(markerIdx + TOC_MARKER.length) : "";

    return {
      ...data,
      qrSrc,
      contentHtmlBeforeToc,
      contentHtmlAfterToc,
      rawContent: content,
      headings,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  const metas = await getAllPostMetas();
  return metas.map((meta) => meta.slug);
}

export function formatJapaneseDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}
