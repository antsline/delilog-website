/**
 * OG 画像の文言（content/figures/<slug>/og.json）の形を確かめる。
 * テンプレート（templates/og.html）は文字サイズを枠に合わせて縮めるが、縮めても崩れる形はここで弾く。
 */
export const OG_KEYS = ['line1Accent', 'line1', 'line2Accent', 'line2', 'badge', 'subtitle', 'number', 'unit'];

const len = (s) => [...String(s ?? '')].length;

export function ogSpecProblems(og) {
  const problems = [];
  const unknown = Object.keys(og).filter((k) => !OG_KEYS.includes(k));
  if (unknown.length) problems.push(`知らない項目: ${unknown.join(', ')}（使えるのは ${OG_KEYS.join(' / ')}）`);
  if (!len(og.line1Accent) && !len(og.line1)) problems.push('タイトルの1行目が空');
  if (!len(og.line2Accent) && !len(og.line2)) problems.push('タイトルの2行目が空（2行でそろえる）');
  const subtitle = Array.isArray(og.subtitle) ? og.subtitle : og.subtitle ? [og.subtitle] : [];
  if (subtitle.length > 2) problems.push('副題は2行まで');
  if (og.number !== undefined || og.unit !== undefined) {
    if (!len(og.number) || len(og.number) > 4) problems.push('数字は1〜4文字（例: 8・400・14）');
    if (!len(og.unit) || len(og.unit) > 5) problems.push('単位は1〜5文字（例: 項目・円・パターン）');
  }
  return problems;
}
