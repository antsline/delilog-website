import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bodyText, countChars, analyzeArticle, checkArticle, pngSize } from './articleStats.mjs';

const article = `---
title: "テスト"
slug: "test"
---

> **結論**: 点呼記録は1年保存。

![図](/blog/test/structure.png)

## 1. はじめに

これは**本文**です。[リンクの文字](https://example.com/very/long/url)は数える。

| 項目 | 内容 |
|---|---|
| 日時 | 08:00 |

<!--CTA-->

**カードの見出し**

カードの説明は数えない。

<!--/CTA-->

## あわせて読みたい

- [別の記事](/blog/other) — 説明

## 参考資料

- <https://www.mlit.go.jp/>
`;

test('本文から frontmatter・記法・URL・CTA・関連リンク・参考資料を除く', () => {
  const text = bodyText(article);
  assert.match(text, /これは本文です/);
  assert.match(text, /リンクの文字は数える/);
  assert.match(text, /日時/);
  assert.doesNotMatch(text, /title|https|example\.com|カードの説明|別の記事|mlit|\*\*|\||##/);
});

test('字数は空白・改行を除いて数える', () => {
  assert.equal(countChars('あい う\nえ\tお'), 5);
});

test('画像・CTA・冒頭の結論を数える', () => {
  const a = analyzeArticle(article);
  assert.deepEqual(a.images, ['/blog/test/structure.png']);
  assert.equal(a.ctaCount, 1);
  assert.equal(a.hasSummary, true);
});

test('結論が最初の章より後ろにあるなら、冒頭の要約は無い扱い', () => {
  const late = article.replace('> **結論**: 点呼記録は1年保存。', '').replace('これは**本文**です。', '> **結論**: 後ろ\n\nこれは本文です。');
  assert.equal(analyzeArticle(late).hasSummary, false);
});

const base = { chars: 5000, ctaCount: 2, hasSummary: true, images: [] };

test('4,000〜6,000字・CTA3枚まで・冒頭の要約ありなら合格', () => {
  assert.deepEqual(checkArticle(base, {}), []);
});

test('字数が範囲外なら不合格', () => {
  assert.match(checkArticle({ ...base, chars: 6500 }, {})[0], /6,000/);
  assert.match(checkArticle({ ...base, chars: 3000 }, {})[0], /4,000/);
});

test('CTA が4枚以上・要約なしは不合格', () => {
  assert.equal(checkArticle({ ...base, ctaCount: 4, hasSummary: false }, {}).length, 2);
});

test('記事内の図が 1080×1350 でなければ不合格（OG 画像は対象外）', () => {
  const images = ['/blog/t/a.png', '/blog/t/og.png', '/blog/t/b.png'];
  const sizes = { '/blog/t/a.png': { width: 1080, height: 1350 }, '/blog/t/b.png': { width: 1672, height: 941 } };
  const problems = checkArticle({ ...base, images }, sizes);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /b\.png.*1672×941/);
});

test('図のファイルが無ければ不合格', () => {
  assert.match(checkArticle({ ...base, images: ['/blog/t/x.png'] }, {})[0], /見つからない/);
});

test('PNG の幅と高さをヘッダから読む', () => {
  const header = Buffer.alloc(24);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(header, 0);
  header.writeUInt32BE(1080, 16);
  header.writeUInt32BE(1350, 20);
  assert.deepEqual(pngSize(header), { width: 1080, height: 1350 });
  assert.equal(pngSize(Buffer.from('not a png at all, sorry')), null);
});
