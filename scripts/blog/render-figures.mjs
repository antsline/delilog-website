#!/usr/bin/env node
/**
 * 記事の図と OG 画像を HTML から PNG に書き出す。
 *
 *   npm run blog:figures -- <slug>
 *
 * 入力: content/figures/<slug>/
 *   - <name>.html  図の中身（<main class="fig"> の内側だけを書く。スタイルは templates/base.css）
 *   - og.json      OG 画像の文言（line1Accent / line1 / line2Accent / line2 / badge / subtitle / number / unit）
 * 出力: public/blog/<slug>/<name>.png（1080×1350）と og.png（1200×630）
 *       content/figures/<slug>/manifest.json（図ごとの最小の文字サイズ。blog:mobile が使う）
 *
 * スマホで 14px 未満になる文字・枠からのはみ出し・要素7つ以上があれば、書き出したうえで失敗する。
 *
 * 見本や試し書きには --src / --out で入出力先を変えられる（public に出さずに確かめるため）:
 *   node scripts/blog/render-figures.mjs sample --src scripts/blog/examples --out /tmp/figs
 */
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { launchBrowser } from './lib/browser.mjs';
import { FIGURE_SIZE, OG_SIZE, checkFigure } from './lib/figureChecks.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const TEMPLATES = join(ROOT, 'scripts', 'blog', 'templates');
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function wrap(templateName, inner) {
  const template = readFileSync(join(TEMPLATES, templateName), 'utf8');
  const base = `<base href="${pathToFileURL(TEMPLATES).href}/">`;
  const publicUrl = pathToFileURL(join(ROOT, 'public')).href;
  return template
    .replace('<head>', `<head>\n${base}`)
    .replace('<!--FIGURE-->', () => inner)
    .replaceAll('{{PUBLIC}}', publicUrl)
    .replace(/(src|href)="\/(?!\/)/g, `$1="${publicUrl}/`);
}

const OG_KEYS = ['line1Accent', 'line1', 'line2Accent', 'line2', 'badge', 'subtitle', 'number', 'unit'];

function fillOg(og) {
  const unknown = Object.keys(og).filter((k) => !OG_KEYS.includes(k));
  if (unknown.length) throw new Error(`og.json に知らない項目があります: ${unknown.join(', ')}（使えるのは ${OG_KEYS.join(' / ')}）`);
  let html = wrap('og.html', '');
  for (const [key, value] of Object.entries(og)) {
    const text = Array.isArray(value) ? value.map(escapeHtml).join('<br>') : escapeHtml(value);
    html = html.replace(new RegExp(`(data-field="${key}">)(</)`), (_, open, close) => `${open}${text}${close}`);
  }
  if (!og.number) html = html.replace(/<div class="og-num"[\s\S]*?<\/div>/, '');
  return html;
}

/** ページ内で文字サイズ・はみ出し・要素数を測る */
async function measure(page, size) {
  return page.evaluate(({ width, height }) => {
    const texts = [];
    const overflows = [];
    // 描画されている大きさで測る（transform・zoom・SVG の viewBox による縮みを掛ける）
    const scaleOf = (el) => {
      if (el instanceof SVGElement) {
        const ctm = el.getScreenCTM();
        return ctm ? Math.hypot(ctm.a, ctm.b) : 1;
      }
      const h = el.offsetHeight;
      const ratio = h > 0 ? el.getBoundingClientRect().height / h : 1;
      return Math.abs(ratio - 1) < 0.05 ? 1 : ratio; // 端数の誤差は無視し、transform・zoom の縮みだけ拾う
    };
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.textContent.trim();
      const el = node.parentElement;
      if (!text || !el || el.closest('style,script,template,title')) continue;
      const visible = el.checkVisibility ? el.checkVisibility({ checkVisibilityCSS: true }) : el.getClientRects().length > 0;
      if (!visible) continue;
      texts.push({ text, fontPx: Math.round(parseFloat(getComputedStyle(el).fontSize) * scaleOf(el) * 10) / 10 });
    }
    for (const el of document.querySelectorAll('main *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const cs = getComputedStyle(el);
      const clipped =
        (el.scrollWidth > el.clientWidth + 1 && cs.overflowX !== 'visible') ||
        (el.scrollHeight > el.clientHeight + 1 && cs.overflowY !== 'visible');
      const outside = r.right > width + 1 || r.bottom > height + 1 || r.left < -1 || r.top < -1;
      if (clipped || outside) overflows.push((el.textContent || el.className || el.tagName).trim());
    }
    const main = document.querySelector('main');
    return {
      texts,
      overflows,
      itemCount: document.querySelectorAll('[data-item]').length,
      docHeight: Math.max(main.scrollHeight, main.getBoundingClientRect().height),
    };
  }, size);
}

// setContent（about:blank）からは file:// の CSS・画像を読めないので、一時ファイルを開く
const workDir = mkdtempSync(join(tmpdir(), 'blog-figures-'));
let pageCount = 0;

async function render(page, html, size, outPath) {
  await page.setViewport({ ...size, deviceScaleFactor: 1 });
  const htmlPath = join(workDir, `page-${(pageCount += 1)}.html`);
  writeFileSync(htmlPath, html);
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  const measured = await measure(page, size);
  await page.screenshot({ path: outPath, clip: { x: 0, y: 0, ...size } });
  return measured;
}

function option(name) {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : undefined;
}

async function main() {
  const slug = process.argv[2];
  if (!slug || !SLUG_PATTERN.test(slug)) {
    console.error('使い方: npm run blog:figures -- <slug>（英小文字・数字・ハイフン）');
    process.exit(2);
  }
  const srcDir = option('--src') ? resolve(option('--src')) : join(ROOT, 'content', 'figures', slug);
  if (!existsSync(srcDir)) {
    console.error(`図の HTML がありません: ${srcDir}`);
    process.exit(2);
  }
  const outDir = option('--out') ? resolve(option('--out')) : join(ROOT, 'public', 'blog', slug);
  mkdirSync(outDir, { recursive: true });

  const figures = readdirSync(srcDir).filter((f) => f.endsWith('.html')).sort();
  const browser = await launchBrowser();
  const manifest = {};
  let failed = false;
  try {
    const page = await browser.newPage();
    for (const file of figures) {
      const name = file.replace(/\.html$/, '');
      const outPath = join(outDir, `${name}.png`);
      const measured = await render(page, wrap('figure.html', readFileSync(join(srcDir, file), 'utf8')), FIGURE_SIZE, outPath);
      const problems = checkFigure(measured);
      const minFontPx = measured.texts.length ? Math.min(...measured.texts.map((t) => t.fontPx)) : null;
      manifest[`${name}.png`] = { ...FIGURE_SIZE, minFontPx };
      console.log(`${problems.length ? 'NG' : 'OK'} ${name}.png（最小の文字 ${minFontPx}px）`);
      for (const p of problems) console.log(`   - ${p}`);
      failed ||= problems.length > 0;
    }
    const ogPath = join(srcDir, 'og.json');
    if (existsSync(ogPath)) {
      const og = JSON.parse(readFileSync(ogPath, 'utf8'));
      const measured = await render(page, fillOg(og), OG_SIZE, join(outDir, 'og.png'));
      const overflow = measured.overflows.length > 0;
      console.log(`${overflow ? 'NG' : 'OK'} og.png`);
      for (const label of measured.overflows) console.log(`   - はみ出し: 「${label.slice(0, 20)}」`);
      failed ||= overflow;
    } else {
      console.log('（og.json が無いので OG 画像は作っていません）');
    }
  } finally {
    await browser.close();
    rmSync(workDir, { recursive: true, force: true });
  }
  writeFileSync(join(srcDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  if (failed) {
    console.error('\nスマホで読めない図があります。上の指摘を直して、もう一度書き出してください。');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('図の書き出しに失敗しました:', error.message);
  process.exit(1);
});
