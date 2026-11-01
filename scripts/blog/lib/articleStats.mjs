/**
 * 記事の字数・構成の判定（純関数）。
 *
 * 字数は「読者が本文として読む文字」を数える: frontmatter・画像・HTML コメント・Markdown の記号・
 * リンクの URL・CTA カード・DL ボックス・「あわせて読みたい」「参考資料」は数えない。
 */

export const CHAR_RANGE = { min: 4000, max: 6000 };
export const MAX_CTA = 3;
export const FIGURE_PIXELS = { width: 1080, height: 1350 };

const EXCLUDED_SECTIONS = /^##\s*(あわせて読みたい|参考資料)/;

function stripFrontmatter(md) {
  return md.replace(/^---\n[\s\S]*?\n---\n/, '');
}

function dropExcludedSections(md) {
  const out = [];
  let skipping = false;
  for (const line of md.split('\n')) {
    if (/^##\s/.test(line)) skipping = EXCLUDED_SECTIONS.test(line);
    if (!skipping) out.push(line);
  }
  return out.join('\n');
}

/** 本文として読む文字だけを残したテキスト */
export function bodyText(md) {
  return dropExcludedSections(stripFrontmatter(md))
    .replace(/<!--(CTA|DLBOX)-->[\s\S]*?<!--\/\1-->/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<https?:[^>]+>/g, '')
    .replace(/https?:\/\/[\x21-\x7E]+/g, '') // URL は ASCII だけ。続く日本語は残す
    .replace(/^\s*\|?\s*:?-{3,}.*$/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, '')
    .replace(/[*_`|]/g, '')
    .replace(/<[^>]+>/g, '');
}

export function countChars(text) {
  return text.replace(/\s/g, '').length;
}

export function analyzeArticle(md) {
  const body = stripFrontmatter(md);
  const beforeFirstChapter = body.split(/^##\s/m)[0];
  return {
    chars: countChars(bodyText(md)),
    images: [...body.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)].map((m) => m[1]),
    ctaCount: (body.match(/<!--CTA-->/g) ?? []).length,
    hasSummary: /^>\s*\*\*結論/m.test(beforeFirstChapter),
  };
}

/** PNG のヘッダ（IHDR）から幅と高さを読む。PNG でなければ null */
export function pngSize(buffer) {
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (buffer.length < 24 || signature.some((b, i) => buffer[i] !== b)) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

const isOg = (path) => /\/og\.png$/.test(path);
const fmt = (n) => n.toLocaleString('en-US');

/**
 * @param {{chars: number, ctaCount: number, hasSummary: boolean, images: string[]}} stats
 * @param {Record<string, {width: number, height: number}>} imageSizes 画像のパス → 大きさ（無ければ未発見）
 */
export function checkArticle({ chars, ctaCount, hasSummary, images }, imageSizes) {
  const problems = [];
  if (chars > CHAR_RANGE.max) {
    problems.push(`長すぎる: 本文 ${fmt(chars)}字（${fmt(CHAR_RANGE.min)}〜${fmt(CHAR_RANGE.max)}字。収まらない話題は別記事に分ける）`);
  } else if (chars < CHAR_RANGE.min) {
    problems.push(`短すぎる: 本文 ${fmt(chars)}字（${fmt(CHAR_RANGE.min)}〜${fmt(CHAR_RANGE.max)}字）`);
  }
  if (ctaCount > MAX_CTA) problems.push(`CTA カードが ${ctaCount} 枚（${MAX_CTA}枚まで）`);
  if (!hasSummary) problems.push('冒頭の要約が無い（最初の章より前に「> **結論**: …」を置く）');
  for (const path of images.filter((p) => !isOg(p))) {
    const size = imageSizes[path];
    if (!size) {
      problems.push(`図が見つからない: ${path}`);
    } else if (size.width !== FIGURE_PIXELS.width || size.height !== FIGURE_PIXELS.height) {
      problems.push(`図の大きさ: ${path} は ${size.width}×${size.height}（${FIGURE_PIXELS.width}×${FIGURE_PIXELS.height} の縦長で作る）`);
    }
  }
  return problems;
}
