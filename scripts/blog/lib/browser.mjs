import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

/**
 * 手元の Chromium を探す。`BLOG_CHROME_PATH` があればそれを使い、無ければ
 * Playwright が入れた Chromium の一番新しいものを使う。
 */
export function findChrome() {
  const fromEnv = process.env.BLOG_CHROME_PATH;
  if (fromEnv) {
    if (!existsSync(fromEnv)) throw new Error(`BLOG_CHROME_PATH が見つかりません: ${fromEnv}`);
    return fromEnv;
  }
  const cache = join(homedir(), 'Library', 'Caches', 'ms-playwright');
  const candidates = existsSync(cache)
    ? readdirSync(cache)
        .filter((d) => /^chromium-\d+$/.test(d))
        .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]))
    : [];
  for (const dir of candidates) {
    for (const arch of ['chrome-mac-arm64', 'chrome-mac']) {
      const bin = join(
        cache,
        dir,
        arch,
        'Google Chrome for Testing.app',
        'Contents',
        'MacOS',
        'Google Chrome for Testing',
      );
      if (existsSync(bin)) return bin;
    }
  }
  throw new Error(
    'Chromium が見つかりません。`npx playwright install chromium` を実行するか、BLOG_CHROME_PATH に Chrome の実行ファイルを指定してください',
  );
}

export async function launchBrowser() {
  return puppeteer.launch({ executablePath: findChrome(), headless: true });
}
