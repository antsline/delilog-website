# ブログ記事: 軽貨物の業務の記録（運行記録）テンプレ【無料DL】PDF・Excelと記入例｜1人親方向け【2026年版】

作成: 2026-11-16
ブランチ: blog/gyoumu-no-kiroku-template
WORKTREE: /Users/narajunichi/delilog-website/.claude/worktrees/blog-gyoumu-no-kiroku-template
公開日: 2026-11-18（種類: 作り直し）
状態: 実行中

## 検証コマンド

| 種類 | コマンド |
|---|---|
| test | `npm test` |
| 字数・構成 | `npm run blog:stats -- gyoumu-no-kiroku-template` |
| 図 | `npm run blog:figures -- gyoumu-no-kiroku-template` |
| ビルド | `npm run build` |
| スマホ表示 | `npm run blog:mobile -- gyoumu-no-kiroku-template` |

## タスク

- [x] T1: ファクトチェック — 03-fact-check.md。裏が取れない主張は「削除」「書き換え」と判定
- [x] T2: プロダクト整合性 — 04-consistency.md
- [ ] T3: 執筆 — content/blog/gyoumu-no-kiroku-template.md と content/blog-short-ids.json の1行（既存 gyomu-tpl）。blog:stats が OK
- [ ] T4: 図と OG — content/figures/gyoumu-no-kiroku-template/。blog:figures が OK
- [ ] T5: 最終レビュー — 06-review.md。5つの検証コマンドがすべて OK、スマホのスクショを目で確認
- [ ] T6: 公開準備 — BLOG_SCHEDULE・BLOG_BACKLOG の週まとめ更新（週の最初の1本）、blog/gyoumu-no-kiroku-template を push、PR（publish:2026-11-18）、プレビュー URL を取得

## 実行ログ

| タスク | コミット | メモ |
|---|---|---|
| T1 | (このコミット) | 採用6・書き換え8・削除3。M067〜M069 追加 |
| T2 | (このコミット) | 重大3件を構成書に反映（まとめのカード文言・様式例準拠と書かない・T1 処置の反映） |

## 失敗カウンタ

| タスク | エラーの要旨 | 回数 | 試したこと |
|---|---|---|---|

## 最終報告に載せる項目

- ファクトチェック: 採用6・書き換え8・削除3（03-fact-check.md）。外した主張: 事故と同日の業務記録3年保存／罰則（最大100万円）／約4割増の統計／日常点検1年保存／30分以上の休憩だけ書けばよい・施設エリア単位でよい／屋号欄・稼働時間自動計算の記述
- 新しい誤解: M067（まとめ書き）・M068（休憩は10分未満だけ省略可）・M069（待機30分・荷役1時間の数え方）
