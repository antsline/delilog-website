import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ogSpecProblems } from './ogSpec.mjs';

const ok = { line1Accent: '事故の記録', line1: 'の書き方', line2Accent: '軽貨物', line2: '8項目', badge: '2026年版', subtitle: ['物損でも', '3年間保存'], number: '8', unit: '項目' };

test('今の記事の og.json は問題なし', () => {
  assert.deepEqual(ogSpecProblems(ok), []);
});

test('知らない項目・タイトルの空行を指摘する', () => {
  assert.match(ogSpecProblems({ ...ok, color: 'red' }).join(), /知らない項目/);
  assert.match(ogSpecProblems({ ...ok, line2Accent: '', line2: '' }).join(), /2行目/);
});

test('副題は1〜2行・数字は4文字まで・単位は5文字まで（箱の中で横に並べるため）', () => {
  assert.match(ogSpecProblems({ ...ok, subtitle: ['a', 'b', 'c'] }).join(), /副題/);
  assert.match(ogSpecProblems({ ...ok, number: '12345' }).join(), /数字/);
  assert.match(ogSpecProblems({ ...ok, unit: '処方箋の数です' }).join(), /単位/);
  assert.match(ogSpecProblems({ ...ok, unit: '' }).join(), /単位/);
});

test('数字の箱は省略できる（number も unit も無し）', () => {
  const { number, unit, ...rest } = ok;
  assert.deepEqual(ogSpecProblems(rest), []);
});

test('副題は文字列1つでもよい', () => {
  assert.deepEqual(ogSpecProblems({ ...ok, subtitle: '1行だけ' }), []);
});
