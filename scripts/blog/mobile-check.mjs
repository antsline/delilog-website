#!/usr/bin/env node
/**
 * 記事をスマホ幅（390px）で開き、図が読めるかを確かめる。
 *
 *   npm run build && npm run blog:mobile -- <slug>
 *
 * ビルド済みのサイトを next start で立ち上げ、記事の先頭と各図のスクリーンショットを
 * .claude/work/<slug>/mobile/ に保存する（端末と同じ2倍の解像度）。図ごとにスマホでの
 * 最小の文字サイズを出し、14px 未満・縮みすぎの横長の図があれば失敗する。
 */
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchBrowser } from './lib/browser.mjs';
import { judgeImage } from './lib/mobileJudge.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PORT = Number(process.env.BLOG_MOBILE_PORT ?? 3999);
const VIEWPORT = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const MOBILE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

function portIsFree(port) {
  return new Promise((resolvePort) => {
    const probe = createServer()
      .once('error', () => resolvePort(false))
      .once('listening', () => probe.close(() => resolvePort(true)))
      .listen(port);
  });
}

/** サーバーの起動を待つ。起動に失敗して終わっていたら、すぐ失敗にする */
async function waitForServer(url, hasExited, timeoutMs = 60000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (hasExited()) throw new Error('next start が起動直後に終了しました（ビルドが壊れている可能性）');
    try {
      const res = await fetch(url);
      if (res.status < 500) return;
    } catch {
      // まだ立ち上がっていない
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`サーバーが ${timeoutMs / 1000} 秒で立ち上がりませんでした: ${url}`);
}

function readManifest(slug) {
  const file = join(ROOT, 'content', 'figures', slug, 'manifest.json');
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
}

async function main() {
  const slug = process.argv[2];
  if (!slug || !SLUG_PATTERN.test(slug)) {
    console.error('使い方: npm run blog:mobile -- <slug>');
    process.exit(2);
  }
  if (!existsSync(join(ROOT, '.next', 'BUILD_ID'))) {
    console.error('ビルドがありません。先に npm run build を実行してください');
    process.exit(2);
  }
  const outDir = join(ROOT, '.claude', 'work', slug, 'mobile');
  mkdirSync(outDir, { recursive: true });
  const manifest = readManifest(slug);

  if (!(await portIsFree(PORT))) {
    console.error(`ポート ${PORT} が使用中です（前回のサーバーが残っている可能性）。止めるか BLOG_MOBILE_PORT で別のポートを指定してください`);
    process.exit(2);
  }
  const server = spawn(join(ROOT, 'node_modules', '.bin', 'next'), ['start', '-p', String(PORT)], {
    cwd: ROOT,
    stdio: 'ignore',
    detached: true, // 子プロセス（next の worker）ごと止められるように
  });
  let exited = false;
  server.on('exit', () => {
    exited = true;
  });
  let browser;
  let failed = false;
  try {
    browser = await launchBrowser();
    const base = `http://localhost:${PORT}`;
    await waitForServer(`${base}/`, () => exited);
    const url = `${base}/blog/${slug}`;
    const res = await fetch(url);
    if (res.status === 404) throw new Error(`記事が見つかりません: /blog/${slug}（slug の綴りと、ビルドに含まれているかを確かめる）`);
    const page = await browser.newPage();
    await page.setUserAgent(MOBILE_UA);
    await page.setViewport(VIEWPORT);
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: join(outDir, '00-top.png') });

    // 本文（.prose）の中で、スマホに表示されている画像だけ（PC 用の QR やカードのアイコンは除く）
    const handles = [];
    const images = [];
    for (const handle of await page.$$('article .prose img')) {
      const info = await handle.evaluate((el) => {
        const r = el.getBoundingClientRect();
        if (el.closest('[data-cta]')) return null; // CTA カードのアイコン
        if (r.width === 0 || r.height === 0 || getComputedStyle(el).visibility === 'hidden') return null;
        return {
          src: new URL(el.currentSrc || el.src).pathname,
          naturalWidth: el.naturalWidth,
          naturalHeight: el.naturalHeight,
          renderedWidth: r.width,
        };
      });
      if (info) {
        handles.push(handle);
        images.push(info);
      }
    }
    for (const [i, info] of images.entries()) {
      const name = info.src.split('/').pop();
      const result = judgeImage({ ...info, minFontPx: manifest[name]?.minFontPx });
      const shot = join(outDir, `${String(i + 1).padStart(2, '0')}-${name}`);
      await handles[i].scrollIntoView();
      await handles[i].screenshot({ path: shot });
      const font = result.effectiveMinFontPx === null ? '不明' : `${result.effectiveMinFontPx.toFixed(1)}px`;
      console.log(
        `${result.problems.length ? 'NG' : 'OK'} ${info.src}（表示幅 ${Math.round(info.renderedWidth)}px・${result.scale.toFixed(1)}倍に縮小・最小の文字 ${font}）`,
      );
      for (const p of result.problems) console.log(`   - ${p}`);
      if (result.note) console.log(`   ・${result.note}`);
      failed ||= result.problems.length > 0;
    }
    console.log(`\nスクリーンショット: ${outDir}`);
  } finally {
    await browser?.close().catch(() => {});
    try {
      process.kill(-server.pid);
    } catch {
      // もう終わっている
    }
  }
  if (failed) process.exit(1);
}

main().catch((error) => {
  console.error('スマホ表示の確認に失敗しました:', error.message);
  process.exit(1);
});
