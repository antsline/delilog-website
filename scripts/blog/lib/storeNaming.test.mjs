import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  MAX_CAMPAIGN_LENGTH,
  PLACEMENTS,
  blogQrSource,
  blogStoreCampaign,
  qrStoreCampaign,
  shortIdFor,
  shortIdProblems,
} from '../../../lib/storeNaming.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const TABLE = JSON.parse(readFileSync(join(ROOT, 'content', 'blog-short-ids.json'), 'utf8'));
const SLUGS = readdirSync(join(ROOT, 'content', 'blog'))
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''));

test('記事のリンクの印: ct=b_<ID>_<配置>、Play は utm_source=b_<ID> と utm_content=<配置>', () => {
  assert.deepEqual(blogStoreCampaign('tenko-kirokubo-template', 'dlbox', TABLE), {
    ct: 'b_tenko-tpl_dlbox',
    source: 'b_tenko-tpl',
    medium: 'blog',
    content: 'dlbox',
  });
});

test('一覧（slug なし）は index、対応表に無い記事は slug の先頭20文字', () => {
  assert.equal(shortIdFor(undefined, TABLE), 'index');
  assert.equal(shortIdFor('abcdefghij-klmnopqrs-tuvwxyz', {}), 'abcdefghij-klmnopqrs');
  assert.equal(shortIdFor('abcdefghij-klmnopqr-stu', {}), 'abcdefghij-klmnopqr');
});

test('記事の QR は from=blog_<ID>、リダイレクトでは ct と utm_source が同じ', () => {
  assert.equal(blogQrSource('tenko-tpl'), 'blog_tenko-tpl');
  assert.deepEqual(qrStoreCampaign('blog_tenko-tpl'), { ct: 'blog_tenko-tpl', source: 'blog_tenko-tpl', medium: 'qr' });
  assert.deepEqual(qrStoreCampaign('template_tenko7'), { ct: 'template_tenko7', source: 'template_tenko7', medium: 'qr' });
});

test('全記事に短い ID があり、重なりがなく、全配置の ct が40文字以内', () => {
  assert.deepEqual(shortIdProblems(TABLE, SLUGS), []);
  for (const slug of [...SLUGS, undefined]) {
    for (const placement of PLACEMENTS) {
      const { ct } = blogStoreCampaign(slug, placement, TABLE);
      assert.ok(ct.length <= MAX_CAMPAIGN_LENGTH, `${slug} ${placement}: ${ct}`);
    }
  }
});

test('対応表の問題を見つける: 登録漏れ・重なり・形式・index の使用', () => {
  const problems = shortIdProblems({ a: 'x', b: 'x', c: 'Bad_ID', d: 'index' }, ['a', 'e']);
  assert.equal(problems.length, 4);
  assert.match(problems.join('\n'), /重なっている/);
  assert.match(problems.join('\n'), /英小文字/);
  assert.match(problems.join('\n'), /一覧用/);
  assert.match(problems.join('\n'), /e: .*短い ID が無い/);
});

test('ストアの URL: LP の印は以前と同じ形、記事は utm_content まで入る', async () => {
  const { appStoreCampaignHref, googlePlayCampaignHref, inlinePlacement } = await import('../../../lib/storeNaming.mjs');
  const AS = 'https://apps.apple.com/jp/app/delilog/id6753698337';
  const GP = 'https://play.google.com/store/apps/details?id=com.sozel.delilog';
  assert.equal(appStoreCampaignHref(AS, 'lp'), `${AS}?pt=127806295&ct=lp&mt=8`);
  assert.equal(googlePlayCampaignHref(GP, 'lp', 'lp'), `${GP}&referrer=utm_source%3Dlp%26utm_medium%3Dlp`);
  assert.equal(
    googlePlayCampaignHref(GP, 'b_tenko-tpl', 'blog', 'dlbox'),
    `${GP}&referrer=utm_source%3Db_tenko-tpl%26utm_medium%3Dblog%26utm_content%3Ddlbox`,
  );
  assert.equal(appStoreCampaignHref(AS, 'x'.repeat(50)), `${AS}?pt=127806295&ct=${'x'.repeat(40)}&mt=8`);
  assert.deepEqual([1, 2, 3, 4].map(inlinePlacement), ['inline1', 'inline2', 'inline3', 'body']);
});

test('記事の QR: 行き先の from が /download の形式に合い、画像のファイル名から ID を戻せる', async () => {
  const { blogQrUrl, blogQrImagePath, shortIdFromQrFile, INDEX_ID } = await import('../../../lib/storeNaming.mjs');
  const FROM = /^[a-z0-9_-]{1,32}$/;
  for (const slug of [...SLUGS, undefined, 'not-registered-very-long-slug-name']) {
    const id = shortIdFor(slug, TABLE);
    const from = new URL(blogQrUrl('https://delilog.app', id)).searchParams.get('from');
    assert.match(from, FROM, `${slug}: ${from}`);
    assert.equal(shortIdFromQrFile(blogQrImagePath(id).split('/').pop()), id);
  }
  assert.equal(blogQrUrl('https://delilog.app', INDEX_ID), 'https://delilog.app/download?from=blog_index');
  assert.equal(shortIdFromQrFile('../x.svg'), null);
  assert.equal(shortIdFromQrFile('tenko-tpl.png'), null);
});
