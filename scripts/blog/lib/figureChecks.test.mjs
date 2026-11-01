import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  FIGURE_SIZE,
  MOBILE_CONTENT_WIDTH,
  displayFontPx,
  checkFigure,
} from './figureChecks.mjs';

test('スマホでの文字サイズは、記事幅に縮んだ倍率で決まる', () => {
  // 1080px の図が 358px の記事幅に縮む → 約 1/3
  assert.equal(Math.round(displayFontPx(42, FIGURE_SIZE.width, MOBILE_CONTENT_WIDTH)), 14);
  assert.equal(Math.round(displayFontPx(24, 1672, MOBILE_CONTENT_WIDTH)), 5);
});

const ok = {
  texts: [{ text: '点呼記録簿は17列', fontPx: 72 }],
  overflows: [],
  itemCount: 3,
  docHeight: 1350,
};

test('大きい文字・はみ出しなし・要素6つまでなら合格', () => {
  assert.deepEqual(checkFigure(ok), []);
});

test('スマホで14px未満になる文字は不合格（どの文字かを返す）', () => {
  const problems = checkFigure({ ...ok, texts: [...ok.texts, { text: '注記', fontPx: 30 }] });
  assert.equal(problems.length, 1);
  assert.match(problems[0], /注記/);
  assert.match(problems[0], /14px/);
});

test('枠からはみ出す要素は不合格', () => {
  const problems = checkFigure({ ...ok, overflows: ['業務前点呼の箱'] });
  assert.equal(problems.length, 1);
  assert.match(problems[0], /はみ出/);
});

test('図の高さが 1350px を超えたら不合格', () => {
  const problems = checkFigure({ ...ok, docHeight: 1500 });
  assert.match(problems.join('\n'), /1350/);
});

test('data-item が7つ以上なら不合格（1枚1メッセージ・要素6つまで）', () => {
  assert.equal(checkFigure({ ...ok, itemCount: 6 }).length, 0);
  assert.match(checkFigure({ ...ok, itemCount: 7 })[0], /6つまで/);
});

test('同じ文字が何度も出ても、指摘は1件にまとめる', () => {
  const small = { text: '注記', fontPx: 20 };
  assert.equal(checkFigure({ ...ok, texts: [small, small] }).length, 1);
});

test('測れる文字が1つも無い図は不合格（目で確かめられない）', () => {
  assert.match(checkFigure({ ...ok, texts: [] })[0], /文字が見つからない/);
});
