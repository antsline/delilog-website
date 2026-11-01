#!/usr/bin/env node
/**
 * 記事の字数・構成を確かめる。
 *
 *   npm run blog:stats -- <slug>   1記事を判定（範囲外なら失敗）
 *   npm run blog:stats -- --all    全記事の一覧（判定は表示だけで失敗にしない）
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeArticle, checkArticle, pngSize } from './lib/articleStats.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const BLOG_DIR = join(ROOT, 'content', 'blog');
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function imageSizes(paths) {
  const sizes = {};
  for (const path of paths) {
    const file = join(ROOT, 'public', path);
    if (!path.startsWith('/') || !existsSync(file)) continue;
    const size = pngSize(readFileSync(file));
    if (size) sizes[path] = size;
  }
  return sizes;
}

function inspect(slug) {
  const file = join(BLOG_DIR, `${slug}.md`);
  if (!existsSync(file)) throw new Error(`記事がありません: ${file}`);
  const stats = analyzeArticle(readFileSync(file, 'utf8'));
  return { slug, stats, problems: checkArticle(stats, imageSizes(stats.images)) };
}

function main() {
  const arg = process.argv[2];
  if (arg === '--all') {
    const slugs = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
    const rows = slugs.map(inspect).sort((a, b) => a.stats.chars - b.stats.chars);
    console.log('| 記事 | 本文の字数 | 図 | CTA | 冒頭の要約 | 指摘 |\n|---|---:|---:|---:|---|---:|');
    for (const { slug, stats, problems } of rows) {
      console.log(`| ${slug} | ${stats.chars.toLocaleString('en-US')} | ${stats.images.length} | ${stats.ctaCount} | ${stats.hasSummary ? 'あり' : 'なし'} | ${problems.length} |`);
    }
    return;
  }
  if (!arg || !SLUG_PATTERN.test(arg)) {
    console.error('使い方: npm run blog:stats -- <slug> | --all');
    process.exit(2);
  }
  const { stats, problems } = inspect(arg);
  console.log(`本文 ${stats.chars.toLocaleString('en-US')}字・図 ${stats.images.length}枚・CTA ${stats.ctaCount}枚・冒頭の要約 ${stats.hasSummary ? 'あり' : 'なし'}`);
  if (problems.length === 0) {
    console.log('OK');
    return;
  }
  for (const p of problems) console.log(`NG ${p}`);
  process.exit(1);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
