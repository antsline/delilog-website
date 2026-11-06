/**
 * ブログの予約公開で「どの PR を今日 main に入れるか」を決める純関数。
 *
 * PR のラベルで予約を表す:
 *   publish:YYYY-MM-DD  公開日（JST）。1つだけ付ける
 *   approved            オーナーが法令の記述を確かめて「公開して」と言った印
 * 対象は本体リポジトリの blog/<slug> ブランチの PR だけ（フォークは除く）。
 */

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const PUBLISH_LABEL = /^publish:(\d{4}-\d{2}-\d{2})$/;
export const APPROVED_LABEL = 'approved';

/** その時刻の JST の日付（YYYY-MM-DD） */
export function jstDate(now) {
  return new Date(now.getTime() + JST_OFFSET_MS).toISOString().slice(0, 10);
}

function isRealDate(ymd) {
  const d = new Date(`${ymd}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === ymd;
}

function labelNames(labels) {
  return (labels ?? []).map((l) => (typeof l === 'string' ? l : l?.name ?? ''));
}

/** ラベルから公開日を読む。無い・不正・2つ以上なら null */
export function publishDateOf(labels) {
  const dates = labelNames(labels)
    .map((name) => name.match(PUBLISH_LABEL)?.[1])
    .filter((d) => d && isRealDate(d));
  return dates.length === 1 ? dates[0] : null;
}

/**
 * 今日 main に入れる PR（公開日が今日以前・approved・blog/ ブランチ）を公開日・番号の順で返す。
 * waitingApproval は公開日が来ているのに approved が無いもの（報告用）。
 */
export function selectDue(prs, today) {
  const candidates = prs
    .filter((p) => !p.isCrossRepository && (p.headRefName ?? '').startsWith('blog/'))
    .map((p) => ({ ...p, publishOn: publishDateOf(p.labels) }))
    .filter((p) => p.publishOn && p.publishOn <= today)
    .sort((a, b) => (a.publishOn === b.publishOn ? a.number - b.number : a.publishOn < b.publishOn ? -1 : 1));
  const approved = (p) => labelNames(p.labels).includes(APPROVED_LABEL);
  return {
    due: candidates.filter(approved),
    waitingApproval: candidates.filter((p) => !approved(p)),
  };
}

function addDays(ymd, days) {
  return new Date(Date.parse(`${ymd}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);
}

/**
 * 新しく作る記事の公開日を count 個決める。
 * 予約済みの最後の日（今日より後のもの）の intervalDays 日後から始める。
 * 無ければ明後日から（作る時間と、オーナーがプレビューを確かめる1日を空ける）。
 */
export function nextPublishDates({ today, taken, count, intervalDays = 2 }) {
  const future = taken.filter((d) => d > today).sort();
  const start = future.length ? addDays(future[future.length - 1], intervalDays) : addDays(today, 2);
  return Array.from({ length: count }, (_, i) => addDays(start, i * intervalDays));
}

// 記事の PR が変えてよいファイル。これ以外（package.json・next.config・ワークフロー等）を含む PR は
// 予約公開では取り込まない（ビルドで任意のコードが走るため。必要なら人が通常の PR として入れる）。
const ALLOWED_PATHS = [
  /^content\/blog\/[a-z0-9-]+\.md$/,
  /^content\/figures\/[a-z0-9-]+\/[^/]+$/,
  /^public\/blog\/[a-z0-9-]+\/[^/]+$/,
  /^\.claude\/knowledge\/misconceptions\.md$/,
  /^docs\/BLOG_BACKLOG\.md$/,
  /^docs\/BLOG_SCHEDULE\.md$/,
  /^docs\/plans\/blog-[a-z0-9-]+\.md$/,
];

export function disallowedPaths(paths) {
  return paths.filter((path) => !ALLOWED_PATHS.some((re) => re.test(path)));
}

const APPROVED_SHA = /^approved-sha: ([0-9a-f]{40})\s*$/m;

/**
 * approved が有効かを確かめる。問題があれば理由を返す。
 * 有効 = 最後に付いた approved ラベルがオーナーによるもの、かつオーナーの最新の
 * 「approved-sha: <コミット>」コメントが PR の今の先頭コミットと一致（承認後の差し替えを公開しない）。
 * コミットの日時は書く側が自由に決められるので、日時では比べない。
 */
export function approvalProblem({ events, comments, owner, headOid }) {
  const approvals = events
    .filter((e) => e.event === 'labeled' && e.label?.name === APPROVED_LABEL)
    .sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
  const last = approvals[approvals.length - 1];
  if (!last) return 'approved を付けた記録が見つからない';
  if (last.actor?.login !== owner) return `approved を付けたのがオーナー以外（${last.actor?.login ?? '不明'}）`;
  const approvedShas = comments
    .filter((c) => (c.user?.login ?? c.author?.login) === owner)
    .sort((a, b) => (a.created_at < b.created_at ? -1 : 1))
    .map((c) => c.body?.match(APPROVED_SHA)?.[1])
    .filter(Boolean);
  const approvedSha = approvedShas[approvedShas.length - 1];
  if (!approvedSha) return 'オーナーの「approved-sha: <コミット>」コメントが無い';
  if (approvedSha !== headOid) {
    return '承認の後にブランチが変わった（プレビューを確かめ直して承認し直す）';
  }
  return null;
}

/** Actions のログに出す外部の文字列から、ワークフローコマンド（::）と改行を潰す */
export function safeLog(text) {
  return String(text).replace(/\r?\n/g, ' ').replace(/::/g, ': :');
}
