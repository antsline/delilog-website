# ブログの予約公開（週1回まとめて承認 → 2日に1本）

作成: 2026-11-06
ブランチ: feat/blog-schedule
WORKTREE: /Users/narajunichi/delilog-website/.claude/worktrees/feat-blog-schedule
状態: 実行中

## 要件

- 週に1回 `/blog-week` を呼ぶと、予定表から次の3〜4本を選び、企画と構成をまとめて1回で承認できる
- 承認後は1本ずつ今の `/write-blog` の流れ（ファクトチェック → 執筆 → 図 → 検証 → プレビュー）で作り、公開日を2日おきに割り振った PR にする
- オーナーはプレビューで法令の記述だけを確かめて「公開して」と返す（その PR に `approved` ラベルが付く）
- 毎朝 6:00（JST）に GitHub Actions が、公開日が今日以前で `approved` の PR を main に入れる → Vercel が本番に出す。オーナーの手は要らない
- 新しい記事も、旧記事の作り直しも同じ仕組みで出せる（作り直しは記事を隠さず、公開日に中身が入れ替わる）
- OG 画像（記事のメイン画像）の崩れを直し、全15本を同じテンプレートでそろえる（11/6 オーナー追加。デザインの方向は今のまま）
- 非目標: サイトのコード（記事の表示・未来日付の非表示）は変えない／Search Console の登録依頼は自動化しない（サイトマップは公開時に更新される）／SNS への投稿

## 受け入れ条件

- 公開日の判定（JST の今日・`publish:YYYY-MM-DD` ラベル・`approved` の有無・日付順）が純関数のテストで証明されている
- 同じ週に作った PR が同じ共有ファイル（`misconceptions.md`・`BLOG_BACKLOG.md`・`BLOG_SCHEDULE.md`）に追記していても、予約公開が衝突で止まらない（`.gitattributes` の union。テストで確かめる）
- ワークフローは `workflow_dispatch` の dry-run（入れる PR を表示するだけ）で動作確認できる
- 衝突やビルド失敗のときは本番に何も入れず、その PR にコメントを残してジョブを失敗させる（GitHub からオーナーにメールが届く）
- `docs/BLOG_SCHEDULE.md` に次の候補が順番つきで並んでいる（作り直しと新記事を交互、確定申告ガイドを11〜12月中）

## 検証コマンド（1タスクごとに全部通す）

| 種類 | コマンド |
|---|---|
| test | `npm test` |
| typecheck | `npx tsc --noEmit` |
| build | `npm run build` |
| lint | なし（ESLint の設定が無く `next lint` は対話になる） |

## タスク

- [x] T1: 公開対象を選ぶ純関数 — `scripts/blog/lib/schedule.mjs`（JST の今日・ラベルの解釈・対象 PR の選択と並び）とテスト
- [x] T2: 予約公開スクリプト — `scripts/blog/publish-due.mjs`（gh で PR を取得 → squash で main に取り込み → build → push → PR を閉じる。dry-run あり）と `.gitattributes`（共有ファイルを union）。union の挙動を一時リポジトリで確かめるテスト
- [x] T3: GitHub Actions — `.github/workflows/scheduled-publish.yml`（毎日 21:00 UTC＝6:00 JST と手動実行・dry-run 入力・権限 contents/pull-requests write）
- [x] T4: 予定表 — `docs/BLOG_SCHEDULE.md`（公開予定の表・次の候補の並び・ルール）。候補は BLOG_BACKLOG と memory の作り直しリストから
- [x] T5: `/blog-week` コマンドと `/write-blog` の予約モード — 週の流れ（候補選び → まとめて承認 → 1本ずつ作る → PR とラベル → 「公開して」で approved）。`/write-blog` に `publish-on` と承認済み構成の受け取り、作り直しのときの扱いを足す。CLAUDE.md のパイプライン節も合わせる
- [x] T6: OG 画像テンプレートの崩れを直す — 数字は太いゴシックで固定サイズの箱・単位は横書きで下にそろえる・タイトルと副題は枠に合わせて自動で文字サイズを決める。`blog:figures` が崩れ（はみ出し・タイトルの幅不足）を NG にする。判定は純関数＋テスト
- [ ] T7: 全15本の OG 画像を作り直す — 古い11本は今の og.png の文言から og.json を作る。15枚を目で確かめ、前後比較の一覧画像を作る

## リスクのあるタスク

- T2・T3（external）: main に自動で書き込む。衝突・ビルド失敗のときに本番へ何も入れないこと、dry-run で中身を確かめられることをレビューで見る

## 実行ログ

| タスク | コミット | メモ |
|---|---|---|
| T1 | 7597473 | schedule.mjs とテスト6件。npm test 30件 OK |
| T2 | 8d13877 | code-reviewer の HIGH 2件を反映: フォーク PR を除外・PR ごとに try/catch／記事まわり以外のファイルを含む PR は入れない・ビルドにトークンを渡さない・approved はオーナーが最後のコミットより後に付けたものだけ・pull/N/head を headRefOid で固定。MEDIUM: main が進んだら push しない・ログの :: を潰す。ブランチ保護・ルールセットは無し（確認済み）。テスト38件 |
| T3 | b20fc5c | 毎日 21:00 UTC＋手動（dry_run 既定オン）。checkout は persist-credentials: false。レビューは T2 と同時 |
| T4 | a2a197b | 候補20本（作り直し11・新規9）。8/14 に最優先とした請求書テンプレが未着手だったので新規の先頭に。経費記事は 1.4.14 公開後 |
| T5 | 33b24b3 | /blog-week 新設・/write-blog に予約モード・CLAUDE.md。予定表の更新は週の最初の1本の PR だけ（同じ行の書き換えの衝突を避ける）。最初の公開日を「明日」→「明後日」に（オーナーの確認の1日を空ける・テスト更新） |
| T6 | (このコミット) | 数字は Noto Sans JP 900（Georgia 明朝をやめた）・箱は 340×228 固定・単位は横書きで数字の右のベースライン。タイトル（64〜92px）と副題（30〜40px）は fit() で枠に合わせる。行の切れ判定は overflow-x: clip（hidden だと縦方向の誤検知で全部 NG になった）。og.json の形は ogSpec.mjs で検査。テスト43件 |

## 失敗カウンタ

| タスク | エラーの要旨 | 回数 | 試したこと |
|---|---|---|---|

## 未解決の点

- 初回の本番動作は、最初の予約日に Actions のログで確認する（または手動実行の dry-run）
