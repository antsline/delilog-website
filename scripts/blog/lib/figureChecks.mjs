/**
 * 記事内の図がスマホで読めるかの判定（純関数）。
 *
 * 図は 1080×1350 で作り、スマホでは記事の本文幅（390px の画面から左右の余白 16px ずつを
 * 引いた 358px）まで縮んで表示される。元の文字サイズ × 358 / 1080 がスマホでの大きさになる。
 */

export const FIGURE_SIZE = { width: 1080, height: 1350 };
export const OG_SIZE = { width: 1200, height: 630 };
export const MOBILE_CONTENT_WIDTH = 358;
export const MIN_DISPLAY_FONT_PX = 14;
export const MAX_ITEMS = 6;

export function displayFontPx(sourcePx, sourceWidth, displayWidth = MOBILE_CONTENT_WIDTH) {
  return (sourcePx * displayWidth) / sourceWidth;
}

/** 元の図で何 px 以上あればスマホで 14px 以上になるか */
export function minSourceFontPx(sourceWidth = FIGURE_SIZE.width) {
  return Math.ceil((MIN_DISPLAY_FONT_PX * sourceWidth) / MOBILE_CONTENT_WIDTH);
}

/**
 * @param {{ texts: {text: string, fontPx: number}[], overflows: string[], itemCount: number, docHeight: number }} measured
 * @returns {string[]} 問題の一覧（空なら合格）
 */
export function checkFigure({ texts, overflows, itemCount, docHeight }) {
  const problems = [];
  if (texts.length === 0) {
    problems.push('文字が見つからない: 測れる文字が無いので読めるか判定できない（文字は HTML の文字で書く。画像の中の文字は使わない）');
  }
  const reported = new Set();
  for (const { text, fontPx } of texts) {
    const shown = displayFontPx(fontPx, FIGURE_SIZE.width);
    if (shown >= MIN_DISPLAY_FONT_PX || reported.has(text)) continue;
    reported.add(text);
    problems.push(
      `文字が小さい: 「${text.slice(0, 20)}」は ${fontPx}px → スマホで ${shown.toFixed(1)}px（${MIN_DISPLAY_FONT_PX}px 以上が必要。元の図で ${minSourceFontPx()}px 以上にする）`,
    );
  }
  for (const label of overflows) {
    problems.push(`はみ出し: 「${label.slice(0, 20)}」が枠の外に出ている`);
  }
  if (docHeight > FIGURE_SIZE.height) {
    problems.push(`高さ超過: 中身の高さ ${docHeight}px（${FIGURE_SIZE.height}px に収める）`);
  }
  if (itemCount > MAX_ITEMS) {
    problems.push(`要素が多い: data-item が ${itemCount} 個（1枚1メッセージ・${MAX_ITEMS}つまで）`);
  }
  return problems;
}
