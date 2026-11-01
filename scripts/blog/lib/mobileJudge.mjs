import { MIN_DISPLAY_FONT_PX } from './figureChecks.mjs';

/**
 * スマホで表示された1枚の画像が読めるかの判定（純関数）。
 *
 * blog:figures で書き出した図は manifest に最小の文字サイズがあるので、表示幅で縮めた大きさで判定する。
 * それ以外（手作りの古い図）は文字サイズが分からないので、横長なら縮み率で不合格、縦長は目で確かめる。
 */
export function judgeImage({ src, naturalWidth, naturalHeight, renderedWidth, minFontPx }) {
  const scale = naturalWidth / renderedWidth;
  const base = { src, renderedWidth, scale, effectiveMinFontPx: null, problems: [], note: '' };
  if (/\/og\.png$/.test(src)) return { ...base, note: 'OG 画像（判定しない）' };
  if (typeof minFontPx === 'number') {
    const effective = minFontPx / scale;
    const problems =
      effective < MIN_DISPLAY_FONT_PX
        ? [`${src}: スマホで最小の文字が ${effective.toFixed(1)}px（${MIN_DISPLAY_FONT_PX}px 以上が必要）`]
        : [];
    return { ...base, effectiveMinFontPx: effective, problems };
  }
  if (naturalWidth > naturalHeight) {
    return {
      ...base,
      problems: [`${src}: 横長の図が ${scale.toFixed(1)}倍に縮んで表示される（${naturalWidth}×${naturalHeight}。1080×1350 の縦長で作り直す）`],
    };
  }
  return { ...base, note: `${src}: 文字サイズが分からないので、スクリーンショットを目で確かめる` };
}
