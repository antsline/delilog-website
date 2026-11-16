# ブログ記事: 軽貨物の運転者等台帳テンプレ｜1人親方の5項目と記入例（PDF・Excel無料DL）【2026年版】

作成: 2026-11-16
ブランチ: blog/untensha-daichou-template
WORKTREE: /Users/narajunichi/delilog-website/.claude/worktrees/blog-untensha-daichou-template
公開日: 2026-11-20（種類: 新規）
状態: 完了

## 検証コマンド

| 種類 | コマンド |
|---|---|
| test | `npm test` |
| 字数・構成 | `npm run blog:stats -- untensha-daichou-template` |
| 図 | `npm run blog:figures -- untensha-daichou-template` |
| ビルド | `npm run build` |
| スマホ表示 | `npm run blog:mobile -- untensha-daichou-template` |

## タスク

- [x] T1: ファクトチェック — 03-fact-check.md。裏が取れない主張は「削除」「書き換え」と判定
- [x] T2: プロダクト整合性 — 04-consistency.md
- [x] T3: 執筆 — content/blog/untensha-daichou-template.md・配布ファイル（PDF・Excel）と content/blog-short-ids.json の1行（daichou-tpl）。blog:stats が OK
- [x] T4: 図と OG — content/figures/untensha-daichou-template/。blog:figures が OK
- [x] T5: 最終レビュー — 06-review.md。5つの検証コマンドがすべて OK、スマホのスクショを目で確認
- [x] T6: 公開準備 — 相互リンク（既存2〜3本の「あわせて読みたい」）、blog/untensha-daichou-template を push、PR（publish:2026-11-20）、プレビュー URL を取得。BLOG_SCHEDULE・BLOG_BACKLOG は触らない

## 実行ログ

| タスク | コミット | メモ |
|---|---|---|
| T1 | (このコミット) | 採用9・書き換え5・削除1。M070〜M072 追加 |
| T2 | (このコミット) | 重大8件を構成書に反映 |
| T3 | (このコミット) | 本文 5,088字。短い ID daichou-tpl。配布ファイルは T4 のコミットに含める |
| T4 | (このコミット) | 図2枚＋OG。blog:figures OK。配布ファイル PDF（空欄＋記入例）・xlsx（2シート）と元の HTML（_daichou-template.htm） |
| T5 | (このコミット) | 5つの検証 OK。図 structure の文言を「台帳に欄が無いもの」に修正 |
| T6 | (このコミット) | 相互リンク2本（keikamotsu-kiroku-hozon-kikan の台帳の節・keikamotsu-anzentaisaku-2025 のシリーズ一覧）。表の「詳しい記事」列は 11/24 の指導・監督の記事の PR でまとめて直す（隣の行とぶつかるため） |

## 失敗カウンタ

| タスク | エラーの要旨 | 回数 | 試したこと |
|---|---|---|---|

## 最終報告に載せる項目

- ファクトチェック: 外した主張「1人親方は経営届出書で届け出た営業所に備える」。書き換え: 保存3年の根拠は第9条の6第2項（起算日は書かない）・特別な指導は台帳に記録、適性診断の結果は添付・経過措置は届出済み事業者の初任運転者のみ2028年3月まで・電磁的保存の根拠は解釈通達とFAQ・「免許証の欄」→「運転免許に関する事項」
- 新しい誤解: M070〜M072
- 公開後の作業（サイト側・予約公開では入れられない）: CLAUDE.md の QR 読み取り元の一覧に template_daichou / template_daichou_xlsx を足す
- 人の判断が要る点: アプリ（~/delilog）の運転者等台帳 PDF の見出しが「第9条の5」になっている。一次資料では軽貨物の台帳は第9条の6（第9条の5は一般貨物自動車運送事業者等の台帳）。アプリ側の修正を推奨
- ぶつかりうるファイル: なし
