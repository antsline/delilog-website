/**
 * ブログからストアへのリンクに付ける「入口の名前」（純関数）。
 *
 * 記事ごとの短い ID は content/blog-short-ids.json が正。
 * - App Store: ct=b_<ID>_<配置>（ct は40文字まで）
 * - Google Play: utm_source=b_<ID>&utm_medium=blog&utm_content=<配置>
 * - 記事の QR: /download?from=blog_<ID>（リダイレクトでは ct と utm_source を同じ値にする）
 *
 * TypeScript からも scripts/blog のテスト（node --test）からも読めるように .mjs で書く。
 */

export const MAX_CAMPAIGN_LENGTH = 40;

// App Store Connect のプロバイダID（キャンペーンリンクの pt）。
export const APP_STORE_PROVIDER_ID = '127806295';
export const MAX_SHORT_ID_LENGTH = 20;
export const SHORT_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** ブログ一覧（/blog）の ID。記事の ID には使えない */
export const INDEX_ID = 'index';

/** 対応表の末尾に置く固定の行のキー（union で行を足しても JSON が壊れないようにするため） */
export const TABLE_SENTINEL_KEY = '_';

/**
 * 配置の名前（utm_content と ct の末尾）。
 * 記事: dlbox / top / inline1〜3 / end / footer / header / sticky / body（カードの外の素のリンク）
 * 一覧: list / header
 */
export const PLACEMENTS = Object.freeze([
  'dlbox',
  'top',
  'inline1',
  'inline2',
  'inline3',
  'end',
  'footer',
  'header',
  'sticky',
  'body',
  'list',
]);

/**
 * 記事の短い ID。対応表に無い記事は slug から作る（20文字まで）。
 * @param {string | undefined} slug 記事の slug。一覧などは undefined
 * @param {Record<string, string>} table
 * @returns {string}
 */
export function shortIdFor(slug, table) {
  if (!slug) return INDEX_ID;
  const registered = slug === TABLE_SENTINEL_KEY ? undefined : table[slug];
  if (registered) return registered;
  return slug.slice(0, MAX_SHORT_ID_LENGTH).replace(/-+$/, '');
}

/** Google Play の utm_source（記事のリンク） */
export function blogSource(shortId) {
  return `b_${shortId}`;
}

/** App Store の ct（記事のリンク） */
export function blogCt(shortId, placement) {
  return `b_${shortId}_${placement}`.slice(0, MAX_CAMPAIGN_LENGTH);
}

/** 記事の QR の読み取り元（/download?from=...） */
export function blogQrSource(shortId) {
  return `blog_${shortId}`;
}

/**
 * 記事の1つの配置のリンクの印。
 * @param {string | undefined} slug
 * @param {string} placement
 * @param {Record<string, string>} table
 * @returns {{ ct: string, source: string, medium: string, content: string }}
 */
export function blogStoreCampaign(slug, placement, table) {
  const id = shortIdFor(slug, table);
  return { ct: blogCt(id, placement), source: blogSource(id), medium: 'blog', content: placement };
}

/**
 * 対応表の問題を返す（空なら OK）。
 * @param {Record<string, string>} table
 * @param {string[]} slugs 確かめる記事の slug（全記事か、1記事）
 * @returns {string[]}
 */
export function shortIdProblems(table, slugs) {
  const problems = [];
  const entries = Object.entries(table).filter(([key]) => key !== TABLE_SENTINEL_KEY);
  const seen = new Map();

  for (const [slug, id] of entries) {
    if (!SHORT_ID_PATTERN.test(id) || id.length > MAX_SHORT_ID_LENGTH) {
      problems.push(`${slug}: 短い ID「${id}」は英小文字・数字・ハイフンで${MAX_SHORT_ID_LENGTH}文字まで`);
    }
    if (id === INDEX_ID) problems.push(`${slug}: 「${INDEX_ID}」はブログ一覧用なので使えない`);
    if (seen.has(id)) problems.push(`${slug}: 短い ID「${id}」が ${seen.get(id)} と重なっている`);
    seen.set(id, slug);
  }

  for (const slug of slugs) {
    if (!Object.hasOwn(table, slug) || slug === TABLE_SENTINEL_KEY) {
      problems.push(`${slug}: content/blog-short-ids.json に短い ID が無い`);
      continue;
    }
    for (const placement of PLACEMENTS) {
      const raw = `b_${table[slug]}_${placement}`;
      if (raw.length > MAX_CAMPAIGN_LENGTH) {
        problems.push(`${slug}: ct「${raw}」が${MAX_CAMPAIGN_LENGTH}文字を超える`);
      }
    }
  }
  return problems;
}

/** 本文のカードの n 枚目の配置名。CTA は3枚までなので、4枚目以降は body にまとめる */
export function inlinePlacement(n) {
  return n >= 1 && n <= 3 ? `inline${n}` : 'body';
}

/**
 * App Store のキャンペーンリンク。
 * @param {string} baseUrl 例: https://apps.apple.com/jp/app/delilog/id6753698337
 * @param {string} ct
 */
export function appStoreCampaignHref(baseUrl, ct) {
  const params = new URLSearchParams({ pt: APP_STORE_PROVIDER_ID, ct: ct.slice(0, MAX_CAMPAIGN_LENGTH), mt: '8' });
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Google Play のリンク（referrer に utm_* を入れる）。
 * @param {string} baseUrl 例: https://play.google.com/store/apps/details?id=com.sozel.delilog
 * @param {string} source
 * @param {string} medium
 * @param {string} [content]
 */
export function googlePlayCampaignHref(baseUrl, source, medium, content) {
  const params = new URLSearchParams({ utm_source: source, utm_medium: medium });
  if (content) params.set('utm_content', content);
  return `${baseUrl}&referrer=${encodeURIComponent(params.toString())}`;
}

/**
 * QR（/download）から来た人の印。App Store の ct と Google Play の utm_source を同じ値にする。
 * @param {string} source 読み取り元（例: blog_tenko-tpl / template_tenko7）
 * @returns {{ ct: string, source: string, medium: string }}
 */
export function qrStoreCampaign(source) {
  return { ct: source.slice(0, MAX_CAMPAIGN_LENGTH), source, medium: 'qr' };
}

/**
 * 記事の QR に入れる URL。
 * @param {string} siteUrl 例: https://delilog.app
 * @param {string} shortId
 */
export function blogQrUrl(siteUrl, shortId) {
  return `${siteUrl}/download?from=${blogQrSource(shortId)}`;
}

/**
 * 記事の QR 画像の置き場所（app/blog-qr/[file]/route.ts がビルド時に作る）。
 * @param {string} shortId
 */
export function blogQrImagePath(shortId) {
  return `/blog-qr/${shortId}.svg`;
}

/**
 * QR 画像のファイル名（例: tenko-tpl.svg）から短い ID を取り出す。形式が違えば null。
 * @param {string} file
 * @returns {string | null}
 */
export function shortIdFromQrFile(file) {
  const id = file.match(/^(.+)\.svg$/)?.[1];
  return id && SHORT_ID_PATTERN.test(id) && id.length <= MAX_SHORT_ID_LENGTH ? id : null;
}
