/**
 * ブログの予約公開で「どの PR を今日 main に入れるか」を決める純関数。
 *
 * PR のラベルで予約を表す:
 *   publish:YYYY-MM-DD  公開日（JST）。1つだけ付ける
 *   approved            オーナーが法令の記述を確かめて「公開して」と言った印
 * 対象は blog/<slug> ブランチの PR だけ。
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
    .filter((p) => (p.headRefName ?? '').startsWith('blog/'))
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
 * 予約済みの最後の日（今日より後のもの）の intervalDays 日後から始め、無ければ明日から。
 */
export function nextPublishDates({ today, taken, count, intervalDays = 2 }) {
  const future = taken.filter((d) => d > today).sort();
  const start = future.length ? addDays(future[future.length - 1], intervalDays) : addDays(today, 1);
  return Array.from({ length: count }, (_, i) => addDays(start, i * intervalDays));
}
