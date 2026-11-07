# ブログ記事: 点呼記録簿テンプレート【無料DL】PDF（7行・10行）・Excelと記入例｜軽貨物1人親方向け【2026年版】

作成: 2026-11-08
ブランチ: blog/tenko-kirokubo-template
WORKTREE: /Users/narajunichi/delilog-website/.claude/worktrees/blog-tenko-kirokubo-template
公開日: 2026-11-14（予約モード。種類: 作り直し）
状態: 完了

## 検証コマンド

| 種類 | コマンド |
|---|---|
| test | `npm test` |
| 字数・構成 | `npm run blog:stats -- tenko-kirokubo-template` |
| 図 | `npm run blog:figures -- tenko-kirokubo-template` |
| ビルド | `npm run build` |
| スマホ表示 | `npm run blog:mobile -- tenko-kirokubo-template` |

## タスク

- [x] T1: ファクトチェック — 03-fact-check.md。裏が取れない主張は「削除」「書き換え」と判定
- [x] T2: プロダクト整合性 — 04-consistency.md
- [x] T3: 執筆 — content/blog/tenko-kirokubo-template.md。blog:stats が OK
- [x] T4: 図と OG — content/figures/tenko-kirokubo-template/。blog:figures が OK
- [x] T5: 最終レビュー — 06-review.md。5つの検証コマンドがすべて OK、スマホのスクショを目で確認
- [x] T6: 公開準備 — blog/tenko-kirokubo-template を push、PR（publish:2026-11-14）、プレビュー URL を取得（作り直しのため相互リンク追加なし。BLOG_BACKLOG・BLOG_SCHEDULE は触らない）

## 実行ログ

| タスク | コミット | メモ |
|---|---|---|
| T1 | (このコミット) | 19件中 採用15・書き換え4・削除0。M051 の注意を更新 |
| T2 | (このコミット) | 食い違いなし |
| T3 | (このコミット) | 本文 4,811字（構成 5,400字の約9割）。writer の3段は1人で通しで書いた。記入例の表は4列×2表に分けた |
| T4 | b300005 | 図2枚＋OG。blog:figures 全て OK。旧図3枚（横長）を削除 |
| T5 | (このコミット) | 5つの検証コマンドすべて OK。第2章の「違うのは後ろの3列」を「2列ずつ」に訂正 |
| T6 | (このコミット) | 検証コマンド再実行すべて OK。push・PR・ラベル publish:2026-11-14 |

## 失敗カウンタ

| タスク | エラーの要旨 | 回数 | 試したこと |
|---|---|---|---|

## 最終報告に載せる項目

- 書き換えた主張: 「国交省の例と同じ17列」→「同じ並びの17列・同じ注記（上段を氏名・屋号、1列目を車両番号にした1人親方向け）」／交替運転者通告の「該当なし」は法令の要求ではなく書き忘れと区別する工夫として／「紙とアプリは片方でよい」→「いずれでも差し支えない。両方に残す決まりは見当たらない」
- 削除した主張: なし
- misconceptions.md: M051 の注意書きを更新（新規追記なし）
- 依頼文の訂正（日常点検）を反映: 点呼記録簿の「日常点検の状況」は毎回書く欄。点検の毎日義務とは書かない
- 他記事の「あわせて読みたい」のアンカー（旧タイトル「国交省準拠PDF版と記入例」）は更新していない（同じ週の別 PR とのぶつかりを避けるため。リンク先 slug は同じなので切れない）
