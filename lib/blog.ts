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

export type BlogPost = BlogPostMeta & {
  contentHtml: string;
  rawContent: string;
};

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
    const contentHtml = await markdownToHtml(content);
    return {
      ...data,
      readingTimeMin: estimateReadingTime(content),
      contentHtml,
      rawContent: content,
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
