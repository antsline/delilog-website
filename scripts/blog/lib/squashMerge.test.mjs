import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { squashMerge, headSha } from './squashMerge.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SHARED = 'docs/BLOG_BACKLOG.md';

function git(cwd, ...args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

function write(cwd, path, text) {
  mkdirSync(dirname(join(cwd, path)), { recursive: true });
  writeFileSync(join(cwd, path), text);
}

function repoWithTwoBranches() {
  const cwd = mkdtempSync(join(tmpdir(), 'squash-'));
  git(cwd, 'init', '-q', '-b', 'main');
  git(cwd, 'config', 'user.email', 't@example.com');
  git(cwd, 'config', 'user.name', 't');
  copyFileSync(join(ROOT, '.gitattributes'), join(cwd, '.gitattributes'));
  write(cwd, SHARED, '# 候補\n\n- 既存\n');
  write(cwd, 'content/blog/a.md', '本文\n');
  git(cwd, 'add', '-A');
  git(cwd, 'commit', '-qm', 'init');
  for (const name of ['x', 'y']) {
    git(cwd, 'switch', '-q', '-c', `blog/${name}`, 'main');
    write(cwd, `content/blog/${name}.md`, `${name}\n`);
    write(cwd, SHARED, `# 候補\n\n- 既存\n- ${name} を公開予定\n`);
    git(cwd, 'commit', '-qam', name);
    git(cwd, 'add', '-A');
    git(cwd, 'commit', '-qm', `${name} files`);
  }
  git(cwd, 'switch', '-q', 'main');
  return cwd;
}

test('同じ共有ファイルの同じ場所に追記した2つの PR を、続けて取り込める（union）', () => {
  const cwd = repoWithTwoBranches();
  assert.equal(squashMerge(cwd, 'blog/x', 'x (#1)').ok, true);
  assert.equal(squashMerge(cwd, 'blog/y', 'y (#2)').ok, true);
  const shared = readFileSync(join(cwd, SHARED), 'utf8');
  assert.match(shared, /x を公開予定/);
  assert.match(shared, /y を公開予定/);
  assert.equal(git(cwd, 'log', '--format=%s', '-1'), 'y (#2)');
});

test('記事本文の衝突は union にせず、取り込み前に戻して理由を返す', () => {
  const cwd = repoWithTwoBranches();
  git(cwd, 'switch', '-q', '-c', 'blog/z', 'main');
  write(cwd, 'content/blog/a.md', 'z の書き換え\n');
  git(cwd, 'commit', '-qam', 'z');
  git(cwd, 'switch', '-q', 'main');
  write(cwd, 'content/blog/a.md', 'main の書き換え\n');
  git(cwd, 'commit', '-qam', 'main edit');
  const before = headSha(cwd);
  const result = squashMerge(cwd, 'blog/z', 'z (#3)');
  assert.equal(result.ok, false);
  assert.match(result.reason, /衝突/);
  assert.equal(headSha(cwd), before);
  assert.equal(git(cwd, 'status', '--porcelain'), '');
  assert.equal(readFileSync(join(cwd, 'content/blog/a.md'), 'utf8'), 'main の書き換え\n');
});

test('差分が無いブランチは取り込まない', () => {
  const cwd = repoWithTwoBranches();
  assert.equal(squashMerge(cwd, 'blog/x', 'x').ok, true);
  const again = squashMerge(cwd, 'blog/x', 'x again');
  assert.equal(again.ok, false);
  assert.match(again.reason, /差分がない/);
});
