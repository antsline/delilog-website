import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const SLUG_PATTERN = /^[a-z0-9-]+$/;

export type BlogFrontmatter = {
  title: string;
  description: string;
  date: string;
  slug: string;
  ogImage?: string;
  tags?: string[];
  author?: string;
};

export type BlogPostMeta = BlogFrontmatter & {
  readingTimeMin: number;
};

export type BlogHeading = {
  id: string;
  text: string;
  level: 2;
};

export type BlogPost = BlogPostMeta & {
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

  return { data, content: parsed.content };
}

function estimateReadingTime(japaneseText: string): number {
  const characters = japaneseText.replace(/\s+/g, "").length;
  const charactersPerMinute = 600;
  return Math.max(1, Math.round(characters / charactersPerMinute));
}

// Note: sanitize: false は、content/blog/ 配下が内部執筆のみである前提に基づく。
// 外部寄稿や CMS 取り込みを受け入れる場合は、rehype-sanitize を挟むか sanitize: true に切り替えること。
async function markdownToHtml(markdown: string): Promise<string> {
  const processed = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(markdown);
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
      const { data, content } = await readMarkdownFile(filename);
      return {
        ...data,
        readingTimeMin: estimateReadingTime(content),
      };
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
    const contentHtml = injectHeadingIds(rawHtml, headings);

    const markerIdx = contentHtml.indexOf(TOC_MARKER);
    const contentHtmlBeforeToc =
      markerIdx >= 0 ? contentHtml.slice(0, markerIdx) : contentHtml;
    const contentHtmlAfterToc =
      markerIdx >= 0 ? contentHtml.slice(markerIdx + TOC_MARKER.length) : "";

    return {
      ...data,
      readingTimeMin: estimateReadingTime(content),
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
