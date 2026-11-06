---
description: delilog ブログの新記事を、企画＋構成の承認1回だけで、執筆・図の自動生成・スマホ確認・ブランチ push・Vercel プレビュー URL まで一気に進めるパイプライン。テーマを引数に取る。main への公開はユーザーがプレビューを見てから指示する。
---

ブログ記事パイプラインを開始します。

ユーザーから渡されたテーマ: $ARGUMENTS

## 方針

- **止まるのは2か所だけ**: 企画＋構成の承認（Step 2）と、同じ原因で3回失敗したとき。それ以外で「続けますか？」と聞かない
- 承認後は `run-plan-state` で Stop フック（`run-plan-guard`）の柵をかける。未完了のタスクを残して止まろうとすると差し戻される
- 記事は**専用の worktree（`.claude/worktrees/blog-<slug>`）とブランチ `blog/<slug>`** で作る。**ユーザーの作業ツリー（リポジトリの直下）には書き込まない**。未公開の変更が置いてあることが多い
- push するのは `blog/<slug>` ブランチだけ。**main への push・main でのコミットはしない**。公開はユーザーの「公開して」を受けて、PR のマージで行う（下の「公開の手順」）
- ルールの正は worktree の `CLAUDE.md`（字数・章構成・図・CTA・法令の一次資料）
- カスタムエージェントがこのセッションで認識されていなければ、`subagent_type: general-purpose` で `.claude/agents/<名前>.md` の内容を prompt に埋め込んで代わりに動かす

### サブエージェントの呼び方（全エージェント共通・必須）

サブエージェントはセッションの元のフォルダ（ユーザーの作業ツリー）で動く。`cd` は引き継がれない。そのため**すべての Agent 呼び出しの prompt の1行目に `WORKTREE=<worktree の絶対パス>` を書く**。各エージェントはこれを見て、`$WORKTREE` の下だけを読み書きする（エージェント定義の「作業ルート」）。

```
Agent({ subagent_type: "blog-writer", description: "...",
  prompt: "WORKTREE=/Users/.../delilog-website/.claude/worktrees/blog-<slug>\nmode: merge, slug: <slug>\n..." })
```

各タスクの後に、ユーザーの作業ツリーが変わっていないことを確かめる（Step 0 で取った指紋と比べる）。変わっていたら、その時点で `run-plan-state blocked "ユーザーの作業ツリーに書き込みがあった"` にして止まり、何が変わったかを報告する。

### 予約モード（`/blog-week` から呼ばれたとき）

週1回の `/blog-week` が、承認済みの構成と公開日を渡してこのパイプラインを1本ずつ呼ぶ。通常モードとの違いは次のとおり（ほかは全部同じ）:

| | 通常モード | 予約モード |
|---|---|---|
| 呼び方 | `/write-blog <テーマ>` | `/blog-week` から。`publish-on: YYYY-MM-DD`・種類（新規 / 作り直し）・承認済みの構成 |
| Step 1〜2 | 企画・構成を作って承認を待つ | **飛ばす**（worktree に `01-plan.md`・`02-outline.md` が承認済みで置いてある） |
| frontmatter の `date` | 書いた日 | 新規は `publish-on`。**作り直しは元の公開日のまま**（slug も変えない） |
| T6 の終わり | プレビュー URL を返す | PR を作り、ラベル `publish:<publish-on>` を付けてからプレビュー URL を返す |
| 公開 | 「公開して」で PR をマージ | 「公開して」で `approved` ラベルを付けるだけ。毎朝 6:00（JST）の `scheduled-publish` が公開日に main に入れる |

予約公開で取り込めるのは**記事まわりのファイルだけ**: `content/blog/*.md`・`content/figures/<slug>/`・`public/blog/<slug>/`・`.claude/knowledge/misconceptions.md`・`docs/BLOG_BACKLOG.md`・`docs/BLOG_SCHEDULE.md`・`docs/plans/blog-<slug>.md`。これ以外（`package.json`・`app/`・`lib/`・`scripts/` 等）を変えた PR は朝の取り込みで弾かれる。サイトのコードの変更が要ると分かったら、記事に入れず「人の判断が要る点」に書く。

---

## Step 0: 作業場所を作る（企画の前）

まず slug を決める（テーマから英小文字・数字・ハイフン。`/^[a-z0-9]+(-[a-z0-9]+)*$/`）。続きの実行かどうかを確かめてから、1回の Bash で作る（途中で1つでも失敗したら止まる）:

```bash
set -euo pipefail
SLUG=<slug>
ROOT=$(git rev-parse --show-toplevel)
WT="$ROOT/.claude/worktrees/blog-$SLUG"

# worktree の置き場を、この作業ツリーで今すぐ ignore する（コミット不要）
grep -qxF '.claude/worktrees/' "$(git rev-parse --git-common-dir)/info/exclude" || echo '.claude/worktrees/' >> "$(git rev-parse --git-common-dir)/info/exclude"
git check-ignore -q "$ROOT/.claude/worktrees/x"

# ユーザーの作業ツリーの指紋（あとで変わっていないか比べる）
mkdir -p "$ROOT/.claude/work"
( git -C "$ROOT" status --porcelain; git -C "$ROOT" diff ) | shasum > "$ROOT/.claude/work/.$SLUG-parent-fingerprint"

if [ -d "$WT" ]; then
  echo "既存の worktree を使う（続きの実行）"
else
  git fetch origin
  git worktree add -b "blog/$SLUG" "$WT" origin/main
  ln -s "$ROOT/node_modules" "$WT/node_modules"
fi
cd "$WT"
[ "$(git rev-parse --abbrev-ref HEAD)" = "blog/$SLUG" ]
[ "$(git rev-parse --show-toplevel)" = "$WT" ]
mkdir -p "$WT/.claude/work/$SLUG"
echo "WORKTREE=$WT"
```

- 最後の2つの確認（ブランチが `blog/<slug>`・トップが worktree）が通らなければ、**何もコミットせずに止まる**
- 以降、このセッションのコマンドは worktree の中で実行する（`pwd` で確かめる）
- **予約モード**では `/blog-week` が Step 0〜2 を済ませている。Step 3 から始める
- **続きの実行**（worktree が既にある）: `docs/plans/blog-<slug>.md` があれば Step 3 の最後（`run-plan-state start`）からやり直す。チェック済みのタスクは飛ばす。計画ファイルが無ければ Step 1 から

## Step 1: 企画と構成

1. `docs/BLOG_BACKLOG.md` を読み、テーマが既存の記事・候補と重ならないか見る
2. **blog-planner** → `$WORKTREE/.claude/work/<slug>/01-plan.md`
3. **blog-outliner** → `$WORKTREE/.claude/work/<slug>/02-outline.md`（章ごとの字数の割り当て・冒頭の結論の案・図の計画・要検証主張リスト）

## Step 2: 承認（唯一の承認ゲート）

次をまとめてユーザーに示し、**承認を待って止まる**:

- タイトル案・狙う検索キーワード・読者
- 冒頭の結論（2〜3文）
- 章立てと字数の割り当て（合計 4,000〜6,000字）
- 図の計画（2〜3枚。各図の1文のメッセージ）
- この記事で扱わない話題（別記事候補）
- 承認後は完成まで止まらないこと、終わりはプレビュー URL であること

修正の指示があれば planner / outliner をやり直して再提示する。「OK」「承認」「進めて」などが出るまで先に進まない。

## Step 3: 開始

worktree の中で、`docs/plans/blog-<slug>.md` に計画ファイルを書く（run-plan と同じ形式。行頭の `- [ ] T<番号>:` を変えない）:

```markdown
# ブログ記事: <タイトル>

作成: YYYY-MM-DD
ブランチ: blog/<slug>
WORKTREE: <絶対パス>
公開日: YYYY-MM-DD（予約モードのときだけ。種類: 新規 / 作り直し）
状態: 実行中

## 検証コマンド

| 種類 | コマンド |
|---|---|
| test | `npm test` |
| 字数・構成 | `npm run blog:stats -- <slug>` |
| 図 | `npm run blog:figures -- <slug>` |
| ビルド | `npm run build` |
| スマホ表示 | `npm run blog:mobile -- <slug>` |

## タスク

- [ ] T1: ファクトチェック — 03-fact-check.md。裏が取れない主張は「削除」「書き換え」と判定
- [ ] T2: プロダクト整合性 — 04-consistency.md
- [ ] T3: 執筆 — content/blog/<slug>.md。blog:stats が OK
- [ ] T4: 図と OG — content/figures/<slug>/。blog:figures が OK
- [ ] T5: 最終レビュー — 06-review.md。5つの検証コマンドがすべて OK、スマホのスクショを目で確認
- [ ] T6: 公開準備 — 相互リンクと BLOG_BACKLOG の更新、blog/<slug> を push、プレビュー URL を取得

## 実行ログ

| タスク | コミット | メモ |
|---|---|---|

## 失敗カウンタ

| タスク | エラーの要旨 | 回数 | 試したこと |
|---|---|---|---|

## 最終報告に載せる項目

（外した主張・書き換えた主張・新しく足した誤解 M0XX・人の判断が要る点・ユーザーの未コミット変更とぶつかりうるファイル）
```

```bash
cd "$WT" && [ "$(git rev-parse --abbrev-ref HEAD)" = "blog/$SLUG" ] \
  && git add docs/plans/blog-$SLUG.md && git commit -m "docs: blog plan for $SLUG" \
  && run-plan-state start docs/plans/blog-$SLUG.md && run-plan-state status
```

`run-plan-state status` が running を返すことを確かめる。ここから先は止まらない。各タスクが終わったら、計画ファイルのチェックを `- [x]` にし、実行ログに1行足してコミットする（`feat(blog): T3 <slug> 本文` など）。コミットの前に毎回 `git rev-parse --abbrev-ref HEAD` が `blog/<slug>` であることを確かめる。

## Step 4: タスク

### T1 ファクトチェック

**blog-fact-checker**: `02-outline.md` の要検証主張を一次資料で検証し `03-fact-check.md` に保存。`misconceptions.md` を最初に読む。承認は求めない。各主張に「採用 / 書き換え / 削除」を付ける。新しい誤解は worktree の `misconceptions.md` に追記する。**番号はユーザーの作業ツリーの `misconceptions.md`（未コミットの追記を含む）と worktree の両方の最大番号の次**にする（公開後に番号がぶつからないように）。外した・書き換えた主張と追記した誤解を、計画ファイルの「最終報告に載せる項目」に写す。

### T2 プロダクト整合性

**consistency-guard**: `02-outline.md` と `03-fact-check.md` を CLAUDE.md の「プロダクト事実」と突き合わせて `04-consistency.md` に保存。食い違いは構成書に反映してから T3 へ。

### T3 執筆

**blog-writer** を3段で呼ぶ（sections は1メッセージで並行）:

1. `mode: skeleton` → `05a-skeleton.md`
2. `mode: sections` を2つ（例 `1-3` と `4-6`。後半は FAQ・まとめを含む。章が4つなら `1-2` と `3-4`）→ `05b-*.md` / `05c-*.md`
3. `mode: merge` → `content/blog/<slug>.md`（予約モードの `date` は上の表のとおり）。`npm run blog:stats -- <slug>` が OK になるまで削る（足りなければ「人の判断が要る点」に記録）。**既存記事の相互リンクはここでは書かない**（T6 で行う）

### T4 図と OG

**blog-figure-maker**: 構成書の図の計画どおりに `content/figures/<slug>/<名前>.html` と `og.json` を書き、`npm run blog:figures -- <slug>` が OK になるまで直す。書き出した PNG を Read して見た目も確かめる。`07-figures.md` に各図のメッセージと alt を残し、記事の画像の alt と一致させる。

### T5 最終レビュー

**blog-reviewer**: 誤字・事実・プロダクト整合・トーンを確認して直す。そのうえで検証コマンドを全部流す（`npm test` → `blog:stats` → `blog:figures` → `npm run build` → `blog:mobile`）。`.claude/work/<slug>/mobile/` のスクリーンショットを Read し、スマホで図の文字が読めること・表が崩れていないことを目で確かめる。結果を `06-review.md` に保存し、人の判断が要る点は計画ファイルの「最終報告に載せる項目」へ。

### T6 公開準備（push まで）

1. 関連する既存記事（2〜3本）の「あわせて読みたい」に新記事を足す（**作り直しのときは足さない**。既にリンクされている）。`docs/BLOG_BACKLOG.md` の該当候補を「公開予定（プレビュー中）」にする（予約モードは「公開予定（YYYY-MM-DD 予約）」）。どちらも worktree の中で。`docs/BLOG_SCHEDULE.md` は `/blog-week` の指示があった記事（その週の最初の1本）でだけ直す
2. ユーザーの作業ツリーで未コミットの変更があるファイル（`git -C <ROOT> status --porcelain`）と、このブランチで変えたファイルが重なっていれば、計画ファイルの「最終報告に載せる項目」に「ぶつかりうるファイル」として書く
3. 検証コマンドをもう一度全部流す
4. 計画ファイルの T6 を `- [x]`・状態を「完了」にし、成果物と一緒に**1つのコミット**にする（push 後にもう1回コミットするとプレビューが二重になるため）。CLAUDE.md の Git コミット規則に従い、`Co-Authored-By` は付けない:

   ```bash
   cd "$WT" && [ "$(git rev-parse --abbrev-ref HEAD)" = "blog/$SLUG" ] \
     && git add content/blog/ content/figures/$SLUG/ public/blog/$SLUG/ .claude/knowledge/misconceptions.md docs/BLOG_BACKLOG.md docs/BLOG_SCHEDULE.md docs/plans/blog-$SLUG.md \
     && git commit -m "feat: N本目のブログ記事「<タイトル抜粋>」を追加

   - content/blog/$SLUG.md（本文 X,XXX字・図 N 枚）
   - 図と OG は content/figures/$SLUG/ から書き出し
   - 既存記事 N 本の「あわせて読みたい」に追加
   - ファクトチェックで外した主張: N 件"
   ```

5. `git push -u origin blog/$SLUG`（**このブランチだけ**）
   - **予約モード**: 続けて PR を作り、公開日のラベルを付ける（ラベルが無ければ作る）:

     ```bash
     DATE=<publish-on>
     gh label create "publish:$DATE" --color 1875bd --description "予約公開日（JST 6:00）" 2>/dev/null || true
     gh label create approved --color 16a34a --description "オーナーが法令の記述を確かめた" 2>/dev/null || true
     gh pr create --base main --head blog/$SLUG --label "publish:$DATE" \
       --title "feat: ブログ記事「<タイトル抜粋>」を追加（$DATE 公開予定）" \
       --body "<最終報告の要点。特に『公開前に確かめてほしい法令の記述』>"
     ```

     作り直しのときのタイトルは「feat: ブログ記事「<タイトル抜粋>」を作り直す（$DATE 公開予定）」
6. プレビューを待つ（1回の Bash の中で待つ。単独の sleep でターンを終えない。Bash のタイムアウトは 600000ms にする）:

   ```bash
   SHA=$(git rev-parse HEAD); REPO=antsline/delilog-website; STATE=pending; URL=
   for i in $(seq 1 28); do
     ID=$(gh api "repos/$REPO/deployments?sha=$SHA" --jq '.[0].id // empty' 2>/dev/null || true)
     if [ -n "$ID" ]; then
       STATE=$(gh api "repos/$REPO/deployments/$ID/statuses" --jq '.[0].state // "pending"')
       URL=$(gh api "repos/$REPO/deployments/$ID/statuses" --jq '.[0].environment_url // empty')
       case "$STATE" in success|failure|error) break;; esac
     fi
     sleep 20
   done
   echo "state=$STATE url=$URL"
   ```

   - `success`: URL を最終報告に載せる
   - `failure` / `error`: Vercel のビルドが落ちた。T6 の失敗として直す（3回ルール）
   - 時間切れ（pending のまま）: 失敗扱いにせず、最終報告に「プレビュー待ち（GitHub の blog/<slug> ブランチの Deployments で確かめられる）」と書く

## Step 5: 最終報告

`run-plan-state finish` を実行し、ユーザーの作業ツリーの指紋が Step 0 と同じことを確かめてから、次の形で報告する（ここではもうコミット・push しない）:

```
## 完成: <タイトル>（ブランチ blog/<slug>）

プレビュー: <URL>/blog/<slug>
（Vercel にログインした端末で開く。スマホで見てから「公開して」と返してください）

- 本文 X,XXX字・図 N 枚・CTA N 枚
- スマホ表示: 図ごとの最小の文字 XXpx（スクショ .claude/worktrees/blog-<slug>/.claude/work/<slug>/mobile/）

### ファクトチェックで外した・書き換えた主張
- …（無ければ「なし」）

### 新しく足した誤解パターン
- M0XX: …（無ければ「なし」）

### 人の判断が要る点
- …（無ければ「なし」）

### 公開後に手元でぶつかりうるファイル
- …（ユーザーの未コミット変更と同じファイル。無ければ「なし」）

### この記事で扱わなかった話題（別記事候補）
- …
```

## 公開の手順（ユーザーが「公開して」と言ったら）

**予約モードの記事**は `/blog-week` の「『公開して』と言われたら」に従う（`approved` ラベルを付けるだけ。マージしない）。以下は通常モードの記事。

worktree の中で:

```bash
set -euo pipefail
cd "$WT"; [ "$(git rev-parse --abbrev-ref HEAD)" = "blog/$SLUG" ]
git fetch origin
if ! git merge-base --is-ancestor origin/main HEAD; then
  git rebase origin/main
  npm run build && npm run blog:stats -- $SLUG
  git push --force-with-lease origin blog/$SLUG   # 自分のブランチだけ。プレビューが作り直される
fi
gh pr create --base main --head blog/$SLUG --title "feat: ブログ記事「<タイトル抜粋>」を追加" --body "<最終報告の要点>"
```

- rebase して push し直したときは、T6 の 6 と同じ方法で新しい SHA のプレビューが success になるのを待ってからマージする
- マージ: `gh pr merge blog/$SLUG --squash`（`--delete-branch` は付けない。worktree の中では gh が main に切り替えようとして失敗する）

マージ後（リポジトリの直下に戻って）:

1. 本番（https://delilog.app/blog/<slug>）が開けることを確かめる（2〜3分）
2. 片付け: `git worktree remove .claude/worktrees/blog-<slug>` → `git branch -D blog/<slug>` → `git push origin --delete blog/<slug>`
3. ユーザーの作業ツリーは**更新しない**（未コミットの変更がある。pull はユーザーの判断。最終報告の「ぶつかりうるファイル」を改めて伝える）
4. ユーザーへ: Search Console で URL のインデックス登録をリクエスト（canonical URL）、X 投稿案（必要なら作る）

## 3回ルール

- 検証コマンドが落ちたら直してやり直す。**同じ原因で3回目**になったら、計画ファイルの状態を「停止」にして `run-plan-state blocked "T<番号>: <要旨>"`、停止報告を出して止まる
- 字数を合わせるために結論・FAQ を丸ごと消す、図のチェックを外す、文字サイズの下限を下げる、で通すのは禁止
- 停止報告: 進捗（完了 X / 6）・止まった理由・試したこと3回・原因の見立て・判断してほしいこと（選択肢と推奨）
- 再開: ユーザーの判断が出たら、worktree に `cd` して `run-plan-state start docs/plans/blog-<slug>.md`（チェック済みのタスクは飛ばされる）

## 中間成果物

```
.claude/worktrees/blog-<slug>/.claude/work/<slug>/
├── 01-plan.md          # planner
├── 02-outline.md       # outliner
├── 03-fact-check.md    # fact-checker
├── 04-consistency.md   # consistency-guard
├── 05a-skeleton.md     # writer (skeleton)
├── 05b-*.md / 05c-*.md # writer (sections)
├── 06-review.md        # reviewer
├── 07-figures.md       # figure-maker
└── mobile/             # blog:mobile のスクリーンショット
```

コミットするのは `content/blog/<slug>.md`・`content/figures/<slug>/`・`public/blog/<slug>/`・既存記事の相互リンク・`misconceptions.md`・`docs/BLOG_BACKLOG.md`・計画ファイル。`.claude/work/` と `.claude/worktrees/` は git ignore。
