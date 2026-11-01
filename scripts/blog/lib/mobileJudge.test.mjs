import { test } from 'node:test';
import assert from 'node:assert/strict';
import { judgeImage } from './mobileJudge.mjs';

test('書き出した図: 最小の文字 × 縮み率がスマホでの最小の文字', () => {
  const r = judgeImage({ src: '/a.png', naturalWidth: 1080, naturalHeight: 1350, renderedWidth: 358, minFontPx: 44 });
  assert.equal(Math.round(r.effectiveMinFontPx * 10) / 10, 14.6);
  assert.deepEqual(r.problems, []);
});

test('書き出した図でも、実際の表示幅が狭ければ不合格', () => {
  const r = judgeImage({ src: '/a.png', naturalWidth: 1080, naturalHeight: 1350, renderedWidth: 300, minFontPx: 44 });
  assert.match(r.problems[0], /12\.2px/);
});

test('文字サイズが分からない横長の図は、縮み率で不合格にする', () => {
  const r = judgeImage({ src: '/old.png', naturalWidth: 1672, naturalHeight: 941, renderedWidth: 358 });
  assert.equal(r.effectiveMinFontPx, null);
  assert.match(r.problems[0], /横長/);
  assert.match(r.problems[0], /4\.7倍/);
});

test('文字サイズが分からない縦長の図は、目で確かめる扱い（不合格にしない）', () => {
  const r = judgeImage({ src: '/p.png', naturalWidth: 1080, naturalHeight: 1350, renderedWidth: 358 });
  assert.deepEqual(r.problems, []);
  assert.match(r.note, /目で/);
});

test('OG 画像（記事の先頭の飾り）は判定しない', () => {
  const r = judgeImage({ src: '/blog/x/og.png', naturalWidth: 1200, naturalHeight: 630, renderedWidth: 358 });
  assert.deepEqual(r.problems, []);
});
