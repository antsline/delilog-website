# ブログ記事: 軽貨物の単価相場は？出前館400円・赤帽20km5,000円の公表値と月収の読み方【2026年版】（作り直し）

作成: 2026-11-02
ブランチ: blog/keikamotsu-tanka-soba-2026
WORKTREE: /Users/narajunichi/delilog-website/.claude/worktrees/blog-keikamotsu-tanka-soba-2026
状態: 実行中

承認: 2026-11-02 ユーザー「承認。Aでいきましょう」。既存記事の作り直し（slug・date 維持）。数字は公式の公表値と国の調査だけ（求人サイトの掲載例は使わない）。手取りの試算は載せない

## 検証コマンド

| 種類 | コマンド |
|---|---|
| test | `npm test` |
| 字数・構成 | `npm run blog:stats -- keikamotsu-tanka-soba-2026` |
| 図 | `npm run blog:figures -- keikamotsu-tanka-soba-2026` |
| ビルド | `npm run build` |
| スマホ表示 | `npm run blog:mobile -- keikamotsu-tanka-soba-2026` |

## タスク

- [x] T1: ファクトチェック — 03-fact-check.md。裏が取れない主張は「削除」「書き換え」と判定
- [ ] T2: プロダクト整合性 — 04-consistency.md
- [ ] T3: 執筆 — content/blog/keikamotsu-tanka-soba-2026.md。blog:stats が OK
- [ ] T4: 図と OG — content/figures/keikamotsu-tanka-soba-2026/。blog:figures が OK
- [ ] T5: 最終レビュー — 06-review.md。5つの検証コマンドがすべて OK、スマホのスクショを目で確認
- [ ] T6: 公開準備 — 被リンク元のアンカー更新、konenashi の案内の言い換え、旧 PNG の削除、BLOG_BACKLOG 更新、push、プレビュー URL を取得

## 実行ログ

| タスク | コミット | メモ |
|---|---|---|
| T1 | (このコミット) | 26件: 採用12・書き換え9・削除5。M055〜M057 追記。Amazon Flex が公式に金額（4時間程度で最大9,600円）を出しており結論を3社に変更 |

## 失敗カウンタ

| タスク | エラーの要旨 | 回数 | 試したこと |
|---|---|---|---|

## 最終報告に載せる項目

- 結論の変更: 公式に金額を確認できたのは出前館・赤帽に加えて Amazon Flex（公式トップ「4時間程度の稼働で最大9,600円」2025年4〜6月・関東圏・軽貨物車の想定）
- 書き換え: 各社「非公表」→「公式ページで金額を確認できなかった」／月収調査は「売上ベース」と断定しない（調査項目は「平均月収」で定義なし）／赤帽は「全国統一」と書かず、4組合の公式ページで同額まで
- 削除: 令和6年度アンケートの収入項目／適正原価と軽貨物／Uber Eats の配達調整金廃止／軽自動車税・自賠責の改定額／青色申告65万円の要件
- 他記事への波及（今回は直さない）: keikamotsu-jittai-toukei の「売上ベースである可能性が高い」
