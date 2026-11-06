import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jstDate, publishDateOf, selectDue, nextPublishDates, disallowedPaths, approvalProblem, safeLog } from './schedule.mjs';

test('JST の日付: UTC 21:00 は翌日の朝6時', () => {
  assert.equal(jstDate(new Date('2026-11-06T21:00:00Z')), '2026-11-07');
  assert.equal(jstDate(new Date('2026-11-06T14:59:59Z')), '2026-11-06');
  assert.equal(jstDate(new Date('2026-12-31T15:00:00Z')), '2027-01-01');
});

test('publish:YYYY-MM-DD ラベルから公開日を読む', () => {
  assert.equal(publishDateOf(['approved', 'publish:2026-11-08']), '2026-11-08');
  assert.equal(publishDateOf(['approved']), null);
  assert.equal(publishDateOf(['publish:2026-13-01']), null);
  assert.equal(publishDateOf(['publish:2026-02-30']), null);
  assert.equal(publishDateOf(['publish:20261108']), null);
});

test('公開日が2つ付いていたら読まない（どちらか分からないため）', () => {
  assert.equal(publishDateOf(['publish:2026-11-08', 'publish:2026-11-10']), null);
});

const pr = (number, labels, headRefName = `blog/a${number}`) => ({ number, labels, headRefName, title: `t${number}` });

test('今日以前・approved・blog/ ブランチだけを、公開日・番号の順に選ぶ', () => {
  const prs = [
    pr(5, ['approved', 'publish:2026-11-08']),
    pr(3, ['approved', 'publish:2026-11-06']),
    pr(4, ['approved', 'publish:2026-11-08']),
    pr(6, ['approved', 'publish:2026-11-09']),
    pr(7, ['publish:2026-11-07']),
    pr(8, ['approved']),
    pr(9, ['approved', 'publish:2026-11-01'], 'feat/other'),
  ];
  const { due, waitingApproval } = selectDue(prs, '2026-11-08');
  assert.deepEqual(due.map((p) => p.number), [3, 4, 5]);
  assert.deepEqual(due.map((p) => p.publishOn), ['2026-11-06', '2026-11-08', '2026-11-08']);
  assert.deepEqual(waitingApproval.map((p) => p.number), [7]);
});

test('ラベルは文字列でも {name} でも読める（gh の JSON の形）', () => {
  const { due } = selectDue([pr(1, [{ name: 'approved' }, { name: 'publish:2026-11-01' }])], '2026-11-01');
  assert.deepEqual(due.map((p) => p.number), [1]);
});

test('次の公開日: 予約済みの最後の日の2日後から（無ければ明後日から）2日おき', () => {
  assert.deepEqual(nextPublishDates({ today: '2026-11-06', taken: ['2026-11-08'], count: 3 }), ['2026-11-10', '2026-11-12', '2026-11-14']);
  assert.deepEqual(nextPublishDates({ today: '2026-11-06', taken: [], count: 2 }), ['2026-11-08', '2026-11-10']);
  assert.deepEqual(nextPublishDates({ today: '2026-11-06', taken: ['2026-11-01'], count: 1 }), ['2026-11-08']);
  assert.deepEqual(nextPublishDates({ today: '2026-12-30', taken: [], count: 2, intervalDays: 3 }), ['2027-01-01', '2027-01-04']);
});

test('フォークからの PR は対象にしない', () => {
  const fork = { ...pr(1, ['approved', 'publish:2026-11-01']), isCrossRepository: true };
  assert.deepEqual(selectDue([fork], '2026-11-01').due, []);
});

test('記事の PR が変えてよいのは記事・図・公開画像・共有の3ファイル・記事の計画だけ', () => {
  assert.deepEqual(
    disallowedPaths([
      'content/blog/a.md',
      'content/figures/a/og.json',
      'public/blog/a/og.png',
      '.claude/knowledge/misconceptions.md',
      'docs/BLOG_BACKLOG.md',
      'docs/BLOG_SCHEDULE.md',
      'docs/plans/blog-a.md',
    ]),
    [],
  );
  assert.deepEqual(
    disallowedPaths(['content/blog/a.md', 'package.json', 'next.config.js', '.github/workflows/x.yml', 'public/app_icon.png', 'docs/plans/run-x.md']),
    ['package.json', 'next.config.js', '.github/workflows/x.yml', 'public/app_icon.png', 'docs/plans/run-x.md'],
  );
});

const labeled = (login, at, name = 'approved') => ({ event: 'labeled', label: { name }, actor: { login }, created_at: at });

test('approved はオーナーが、最後のコミットより後に付けたものだけ有効', () => {
  const head = '2026-11-06T10:00:00Z';
  assert.equal(approvalProblem({ events: [labeled('antsline', '2026-11-06T11:00:00Z')], owner: 'antsline', headCommittedAt: head }), null);
  assert.match(approvalProblem({ events: [labeled('someone', '2026-11-06T11:00:00Z')], owner: 'antsline', headCommittedAt: head }), /オーナー以外/);
  assert.match(approvalProblem({ events: [labeled('antsline', '2026-11-06T09:00:00Z')], owner: 'antsline', headCommittedAt: head }), /承認の後にコミット/);
  assert.match(approvalProblem({ events: [labeled('antsline', '2026-11-06T11:00:00Z', 'publish:2026-11-07')], owner: 'antsline', headCommittedAt: head }), /見つからない/);
});

test('最後に付けた approved で判定する（付け直したら新しいほう）', () => {
  const events = [labeled('antsline', '2026-11-06T09:00:00Z'), labeled('antsline', '2026-11-06T12:00:00Z')];
  assert.equal(approvalProblem({ events, owner: 'antsline', headCommittedAt: '2026-11-06T10:00:00Z' }), null);
});

test('ログに出す文字から Actions のコマンド（::）と改行を潰す', () => {
  assert.equal(safeLog('::error::x\n::add-mask::y'), ': :error: :x : :add-mask: :y');
});
