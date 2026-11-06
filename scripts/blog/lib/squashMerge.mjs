/**
 * ブランチを今のブランチに squash で取り込む（予約公開用）。
 * 衝突したら作業ツリーを取り込み前に戻して { ok: false } を返す。
 * 作業ツリーを捨てるので、CI の使い捨てのチェックアウトでだけ使う。
 */
import { execFileSync } from 'node:child_process';

function git(cwd, args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

export function headSha(cwd) {
  return git(cwd, ['rev-parse', 'HEAD']);
}

/** 取り込み前の状態に戻す（CI 専用） */
export function resetTo(cwd, sha) {
  git(cwd, ['reset', '--hard', sha]);
  git(cwd, ['clean', '-fd']);
}

export function squashMerge(cwd, ref, message) {
  const before = headSha(cwd);
  try {
    git(cwd, ['merge', '--squash', '--no-commit', ref]);
  } catch (error) {
    resetTo(cwd, before);
    return { ok: false, reason: `衝突: ${String(error.stderr || error.message).trim().split('\n').slice(-3).join(' / ')}` };
  }
  if (!git(cwd, ['status', '--porcelain'])) {
    return { ok: false, reason: '取り込む差分がない（すでに main に入っている）' };
  }
  git(cwd, ['commit', '-q', '-m', message]);
  return { ok: true, before, sha: headSha(cwd) };
}
