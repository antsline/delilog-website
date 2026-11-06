---
description: 週に1回、ブログの次の3〜4本の企画と構成をまとめて1回で承認し、承認後は1本ずつ予約モードの /write-blog で PR まで作る。公開は毎朝の GitHub Actions が2日おきに行う。引数は本数（省略時4）。
---

週のブログ作りを始めます。本数: $ARGUMENTS（空なら 4）

仕組みの全体は `docs/BLOG_SCHEDULE.md` の「仕組み」。1本ごとの作り方は `.claude/commands/write-blog.md`（**予約モード**）。

## 方針

- **止まるのは承認の1回だけ**（Step 3）。あとは全部の記事の PR とプレビューができるまで止まらない（同じ原因で3回失敗したときを除く）
- 記事は1本ずつ専用の worktree とブランチ `blog/<slug>` で作る。**ユーザーの作業ツリー（リポジトリの直下）にはコミットしない**
- main には入れない。公開は毎朝 6:00（JST）の `scheduled-publish` が、公開日が来て `approved` が付いた PR から行う

## Step 0: 片付けと状況

```bash
set -euo pipefail
ROOT=$(git rev-parse --show-toplevel); cd "$ROOT"
git fetch -q --prune origin
# 片付けてよいのは「PR が閉じていて（公開済み or 公開しないと決めた）、リモートのブランチも消えた」記事だけ。
# まだ push していない（PR が無い）記事・止まった記事は残す
for wt in .claude/worktrees/blog-*; do
  [ -d "$wt" ] || continue
  b="blog/${wt##*/blog-}"
  closed=$(gh pr list --state closed --head "$b" --json number --jq 'length')
  if [ "$closed" -gt 0 ] && ! git ls-remote --exit-code --heads origin "$b" >/dev/null 2>&1 && [ -z "$(git -C "$wt" status --porcelain)" ]; then
    git worktree remove "$wt" && git branch -D "$b" && echo "片付け: $wt"
  fi
done
gh pr list --state open --json number,title,labels,headRefName,url --limit 100 > .claude/work/.open-prs.json
```

- 予約済みの記事（`publish:` ラベル付きの開いた PR）と、公開日が来ているのに `approved` が無い PR を一覧にする。後者はこの週の最初に「先週分の確認が残っています」と伝える（止まらない）
- `docs/BLOG_SCHEDULE.md` の「次の候補」から、**開いた PR が既にある slug を除いて**上から本数分を選ぶ

## Step 1: 公開日を割り振る

```bash
node --input-type=module -e "
import { readFileSync } from 'node:fs';
import { jstDate, publishDateOf, nextPublishDates } from './scripts/blog/lib/schedule.mjs';
const prs = JSON.parse(readFileSync('.claude/work/.open-prs.json', 'utf8'));
const taken = prs.map((p) => publishDateOf(p.labels)).filter(Boolean);
console.log(nextPublishDates({ today: jstDate(new Date()), taken, count: Number(process.argv[1]) }).join(' '));
" <本数>
```

候補の順に、出てきた日付を1つずつ当てる。

## Step 2: 企画と構成（全部の記事を並行で）

記事ごとに `/write-blog` の **Step 0（worktree を作る）** を行い、そのあと **blog-planner → blog-outliner** を動かす。記事どうしは独立なので、**planner は全記事を1つのメッセージで並行**に呼び、終わったら outliner も同様に並行で呼ぶ。プロンプトの1行目は必ず `WORKTREE=<その記事の worktree>`。

- 作り直しのときは、planner に「既存記事 `content/blog/<slug>.md` の作り直し（丸ごと）。slug と公開日は変えない。BLOG_SCHEDULE のメモの直し所を必ず反映」と伝える
- 新規のときは、BLOG_BACKLOG の該当候補のメモと「重複回避メモ」を渡す

進み具合は `.claude/work/blog-week-<今日>.md`（ユーザーの作業ツリーの ignore 済みフォルダ）に表で残す: slug・種類・公開日・worktree・状態（企画中 / 承認待ち / 執筆中 / PR 済み / 停止）。会話が圧縮されてもここから再開する。

## Step 3: まとめて承認（唯一の承認ゲート）

全記事を1つの返答で示し、**承認を待って止まる**。記事ごとに:

- 公開日・種類（新規 / 作り直し）・タイトル案・狙う検索語・読者
- 冒頭の結論（2〜3文）
- 章立てと字数の割り当て（合計 4,000〜6,000字）
- 図の計画（2〜3枚。各図の1文のメッセージ）と OG 画像の文言
- この記事で扱わない話題

最後に「承認後は全部の PR とプレビューまで止まらない」「公開前にプレビューで法令の記述だけ確かめて『公開して』と返してほしい」と添える。

- 一部だけ直したいと言われたら、その記事だけ planner / outliner をやり直して、**全記事をもう一度まとめて**示す
- 1本を外すと言われたら、その worktree を消し、残りの公開日は詰めずにそのまま使う

## Step 4: 1本ずつ作る

承認された記事を**公開日の早い順に1本ずつ**、`/write-blog` の予約モードで最後（PR とプレビュー）まで進める。渡すもの: `publish-on`・種類・承認済みの構成（worktree の `.claude/work/<slug>/02-outline.md`）。

- 1本終わるごとに `blog-week-<今日>.md` の状態を「PR 済み」にし、PR 番号とプレビュー URL を書く
- **予定表と BACKLOG の更新は、その週の最初の1本の PR にだけまとめて入れる**（残りの記事の PR では `docs/BLOG_SCHEDULE.md`・`docs/BLOG_BACKLOG.md` を触らない。表の行の書き換えは取り込み時にぶつかるため）。最初の1本の PR で行うこと:
  1. 先週までに公開された記事（PR が閉じてブランチが消えたもの）を、BLOG_SCHEDULE の「予約済み」から消し、BLOG_BACKLOG の「公開済み記事」に移す（作り直しは字数とメモを更新）。公開しないと決めたものは「次の候補」に戻すか消す
  2. 今週の全記事を BLOG_SCHEDULE の「次の候補」から消し、「予約済み・プレビュー中」に足す（公開日・種類・slug・タイトル。PR 番号は書かない。ブランチ `blog/<slug>` で引ける）
  3. BLOG_BACKLOG の該当候補を「公開予定（YYYY-MM-DD 予約）」にする
- 1本が3回ルールで止まったら、その記事を「停止」にして次の記事へ進む（週全体は止めない）。止まった理由は最終報告に書く

## Step 5: 最終報告

```
## 今週のブログ: N 本を予約しました

| 公開日 | 種類 | タイトル | プレビュー | PR |
|---|---|---|---|---|

### 公開前に確かめてほしいこと（法令の記述）
- <slug>: 確かめてほしい箇所（章・主張・一次資料の URL）

### ファクトチェックで外した・書き換えた主張
- …（無ければ「なし」）

### 止まった記事
- …（無ければ「なし」）

確かめたら「公開して」（全部）または「<slug> を公開して」と返してください。
公開日の朝 6 時に自動で出ます。公開日より後に「公開して」と言った場合は、その次の朝に出ます。
```

## 「公開して」と言われたら

対象の PR に、**今の先頭コミットを書いた承認コメント**と `approved` ラベルを付ける（main には入れない）。朝の取り込みは、このコメントのコミットと PR の先頭が一致するときだけ公開する（承認の後にブランチが変わったら公開しない）:

```bash
SHA=$(gh pr view <番号> --json headRefOid --jq .headRefOid)
gh pr comment <番号> --body "公開を承認します（プレビュー確認済み）
approved-sha: $SHA"
gh pr edit <番号> --add-label approved
```

承認の後に記事を直したときは、直したあとにもう一度このコメントを付ける。

- 「今すぐ出して」と言われたら: `approved` を付けたうえで、その PR の `publish:` ラベルを今日の日付に替え、`gh workflow run scheduled-publish -f dry_run=false` を実行する。終わったら `gh run list --workflow scheduled-publish --limit 1` で結果を確かめて報告する
- 「<slug> は公開しない」と言われたら: PR を閉じ（`gh pr close`）、worktree とブランチを消す。BLOG_SCHEDULE の該当行は次の週の最初の PR で直す
- 公開後に Search Console で URL のインデックス登録をリクエストするかはオーナーの任意（サイトマップは自動で更新される）
