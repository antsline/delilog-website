/**
 * ブログの予約公開: 公開日が来た記事の PR を main に入れる（毎朝 GitHub Actions が実行）。
 *
 *   node scripts/blog/publish-due.mjs --dry-run              入れる PR を表示するだけ（どこでも実行可）
 *   node scripts/blog/publish-due.mjs [--today YYYY-MM-DD]   取り込む（GitHub Actions の中だけ）
 *
 * 対象: 本体の blog/<slug> ブランチの開いた PR で、ラベル publish:YYYY-MM-DD が今日（JST）以前、かつ approved。
 * 取り込む前に確かめること:
 *   - approved はオーナーが付けたもので、オーナーの「approved-sha: <コミット>」コメントが今の先頭と一致
 *     （承認後の差し替えを公開しない）
 *   - PR が変えたファイルが記事まわりだけ（schedule.mjs の disallowedPaths）
 * 1本ずつ squash で取り込み、そのたびに npm run build を通す（ビルドにはトークンを渡さない）。
 * 衝突・ビルド失敗などの PR は取り込まず PR にコメントして飛ばす。最後に main へまとめて push し、
 * 取り込んだ PR を閉じてブランチを消す。途中で main が進んでいたら push せず翌朝に回す。
 * 1本でも失敗があれば終了コード 1（GitHub からオーナーにメールが届く）。
 */
import { execFileSync } from 'node:child_process';
import { approvalProblem, disallowedPaths, jstDate, safeLog, selectDue } from './lib/schedule.mjs';
import { headSha, resetTo, squashMerge } from './lib/squashMerge.mjs';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const todayArg = args.includes('--today') ? args[args.indexOf('--today') + 1] : null;

function run(cmd, cmdArgs, options = {}) {
  return execFileSync(cmd, cmdArgs, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...options }).trim();
}

function gh(...ghArgs) {
  return run('gh', ghArgs);
}

function gitText(...gitArgs) {
  return run('git', gitArgs);
}

/** ビルドなど PR のコードが走るコマンドには、書き込みできるトークンを渡さない */
function envWithoutTokens() {
  const { GH_TOKEN, GITHUB_TOKEN, ...rest } = process.env;
  return rest;
}

function comment(pr, body) {
  try {
    gh('pr', 'comment', String(pr.number), '--body', body);
  } catch (error) {
    console.error(`  PR #${pr.number} へのコメントに失敗: ${error.message}`);
  }
}

function listOpenPrs() {
  const json = gh('pr', 'list', '--state', 'open', '--limit', '100', '--json', 'number,title,labels,headRefName,headRefOid,isCrossRepository,url');
  return JSON.parse(json);
}

function buildPasses() {
  try {
    run('npm', ['run', 'build'], { env: envWithoutTokens(), maxBuffer: 64 * 1024 * 1024 });
    return { ok: true };
  } catch (error) {
    const tail = String(error.stdout || '').split('\n').slice(-15).join('\n');
    return { ok: false, reason: `npm run build が失敗:\n\n\`\`\`\n${tail}\n\`\`\`` };
  }
}

function main() {
  if (todayArg && !/^\d{4}-\d{2}-\d{2}$/.test(todayArg)) throw new Error('--today は YYYY-MM-DD');
  const today = todayArg ?? jstDate(new Date());
  const { due, waitingApproval } = selectDue(listOpenPrs(), today);

  console.log(`今日（JST）: ${today}`);
  console.log(`入れる PR: ${due.length ? due.map((p) => `#${p.number}（${p.publishOn}）${safeLog(p.title)}`).join(' / ') : 'なし'}`);
  for (const p of waitingApproval) {
    console.log(`公開日が来たが approved が無い: #${p.number}（${p.publishOn}）${safeLog(p.title)}`);
  }
  if (dryRun || !due.length) return 0;

  const repo = process.env.GITHUB_REPOSITORY;
  const owner = process.env.GITHUB_REPOSITORY_OWNER;
  const token = process.env.GH_TOKEN;
  if (process.env.GITHUB_ACTIONS !== 'true' || !repo || !owner || !token) {
    throw new Error('取り込みは GitHub Actions の中でだけ行う（手元では --dry-run を使う）');
  }
  if (gitText('rev-parse', '--abbrev-ref', 'HEAD') !== 'main') throw new Error('main のチェックアウトで実行する');
  const startSha = headSha(ROOT);

  const merged = [];
  const failed = [];
  for (const pr of due) {
    console.log(`\n#${pr.number} ${safeLog(pr.headRefName)}`);
    try {
      const result = mergeOne(pr, { repo, owner });
      if (!result.ok) {
        console.log(`  取り込まない: ${safeLog(result.reason)}`);
        failed.push({ pr, reason: result.reason });
        continue;
      }
      console.log(`  取り込み OK（${result.sha.slice(0, 7)}）`);
      merged.push({ pr, sha: result.sha });
    } catch (error) {
      console.log(`  取り込み中にエラー: ${safeLog(error.message)}`);
      failed.push({ pr, reason: `取り込み中にエラー: ${error.message}` });
    }
  }

  if (merged.length) {
    gitText('fetch', '-q', 'origin', 'main');
    if (gitText('rev-parse', 'origin/main') !== startSha) {
      const reason = '作業中に main が進んだので、今回は push しなかった。明日の朝にもう一度取り込む';
      console.log(`\n${reason}`);
      for (const { pr } of merged) comment(pr, `予約公開（${pr.publishOn}）: ${reason}。本番は変わっていません。`);
      return 1;
    }
    run('git', ['push', '-q', `https://x-access-token:${token}@github.com/${repo}.git`, 'HEAD:main']);
    console.log(`\nmain に push: ${headSha(ROOT).slice(0, 7)}`);
    for (const { pr, sha } of merged) {
      comment(pr, `予約公開（${pr.publishOn}）で main に入れました（${sha.slice(0, 7)}）。数分で本番に出ます。`);
      try {
        gh('pr', 'close', String(pr.number), '--delete-branch');
      } catch (error) {
        console.error(`  #${pr.number} の後片付けに失敗（公開は済み）: ${safeLog(error.message)}`);
      }
    }
  }
  for (const { pr, reason } of failed) {
    comment(pr, `予約公開（${pr.publishOn}）で main に入れられませんでした。本番は変わっていません。\n\n${reason}`);
  }
  return failed.length ? 1 : 0;
}

/** 1本の PR を確かめて取り込み、ビルドを通す。だめなら取り込み前に戻して理由を返す */
function mergeOne(pr, { repo, owner }) {
  const ref = `refs/remotes/pr/${pr.number}`;
  gitText('fetch', '-q', 'origin', `+pull/${pr.number}/head:${ref}`);
  if (gitText('rev-parse', ref) !== pr.headRefOid) {
    return { ok: false, reason: 'PR の一覧を取った後にブランチが更新された（明日の朝にもう一度確かめる）' };
  }
  const events = JSON.parse(gh('api', '--paginate', '--slurp', `repos/${repo}/issues/${pr.number}/events`)).flat();
  const comments = JSON.parse(gh('api', '--paginate', '--slurp', `repos/${repo}/issues/${pr.number}/comments`)).flat();
  const approval = approvalProblem({ events, comments, owner, headOid: pr.headRefOid });
  if (approval) return { ok: false, reason: approval };

  const result = squashMerge(ROOT, ref, `${pr.title} (#${pr.number})`);
  if (!result.ok) return result;

  const changed = gitText('diff', '--name-only', result.before, 'HEAD').split('\n').filter(Boolean);
  const outside = disallowedPaths(changed);
  if (outside.length) {
    resetTo(ROOT, result.before);
    return { ok: false, reason: `記事以外のファイルを変えている（予約公開では入れない。通常の PR として確かめて入れる）: ${outside.join(', ')}` };
  }
  const build = buildPasses();
  if (!build.ok) {
    resetTo(ROOT, result.before);
    return build;
  }
  return result;
}

try {
  process.exitCode = main();
} catch (error) {
  console.error(`予約公開を中止: ${error.message}`);
  process.exitCode = 1;
}
