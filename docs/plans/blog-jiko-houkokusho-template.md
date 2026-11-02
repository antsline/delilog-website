# ブログ記事: 軽貨物「事故の記録」の書き方｜8項目の記入例とテンプレ（PDF・Excel無料DL）【2026年版】

作成: 2026-11-02
ブランチ: blog/jiko-houkokusho-template
WORKTREE: /Users/narajunichi/delilog-website/.claude/worktrees/blog-jiko-houkokusho-template
状態: 実行中

承認: 2026-11-02 ユーザー「承認。QRいれましょう」（配布 PDF・Excel の欄外に1行＋QR を入れる。読み取り元 template_jiko）

## 検証コマンド

| 種類 | コマンド |
|---|---|
| test | `npm test` |
| 字数・構成 | `npm run blog:stats -- jiko-houkokusho-template` |
| 図 | `npm run blog:figures -- jiko-houkokusho-template` |
| ビルド | `npm run build` |
| スマホ表示 | `npm run blog:mobile -- jiko-houkokusho-template` |

## タスク

- [x] T1: ファクトチェック — 03-fact-check.md。裏が取れない主張は「削除」「書き換え」と判定
- [x] T2: プロダクト整合性 — 04-consistency.md
- [x] T3: 執筆 — content/blog/jiko-houkokusho-template.md。blog:stats が OK
- [x] T4: 図と OG — content/figures/jiko-houkokusho-template/。blog:figures が OK
- [ ] T5: 最終レビュー — 06-review.md。5つの検証コマンドがすべて OK、スマホのスクショを目で確認
- [ ] T6: 公開準備 — 配布 PDF・Excel の欄外に1行＋QR（template_jiko、Excel はリンク）、相互リンクと BLOG_BACKLOG の更新、keikamotsu-anzentaisaku-2025 の 4-4 の修正、blog/jiko-houkokusho-template を push、プレビュー URL を取得

## 実行ログ

| タスク | コミット | メモ |
|---|---|---|
| T1 | (このコミット) | 28件: 採用13・書き換え9・削除4。M046・M047 を追記、M040 の条文根拠を訂正 |
| T2 | (このコミット) | 不整合3件（検索機能・クラウド表現・プラン表記）を構成書で修正。03 の判定11か所を反映 |
| T3 | (このコミット) | 本文 5,079字・CTA 2枚。FAQ は5問（構成書は4問。Q5「相手方が不明なとき」は T5 で事実確認） |
| T4 | (このコミット) | scope・items8・OG。最小文字 44px。items8 は8項目すべてを表示する形に修正 |

## 失敗カウンタ

| タスク | エラーの要旨 | 回数 | 試したこと |
|---|---|---|---|

## 最終報告に載せる項目

- 削除した主張: バイク便は事故の記録の対象外（誤り・M046）／日常点検記録は1年保存（一次資料なし）／1人親方は自宅で保存（一次資料なし）／delilog で事故の記録を検索できる（プロダクト事実にない）
- 書き換え: 30日以内は「通達で」と明示、発生場所は番地まで書く形（地図添付でも可・M047）、行政処分は「対象になり得る」まで（日車数・罰金は書かない）、国への報告は「一定の重大事故（速報は特に重大なもの）」
- misconceptions: M046・M047 を追記。M040 の条文根拠を訂正（第8条第1項第9号の括弧書きは「第九条の二及び第九条の五第一項」）。ユーザー手元の M040 は旧版のまま

- ぶつかりうるファイル（予定）: content/blog/keikamotsu-anzentaisaku-2025.md（ユーザーの未コミット変更あり）、.claude/knowledge/misconceptions.md
