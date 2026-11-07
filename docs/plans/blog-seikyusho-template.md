# ブログ記事: 軽貨物の請求書テンプレート｜インボイス対応PDF・Excel（無料DL）と記入例【2026年版】

作成: 2026-11-08
ブランチ: blog/seikyusho-template
WORKTREE: /Users/narajunichi/delilog-website/.claude/worktrees/blog-seikyusho-template
公開日: 2026-11-12（予約モード。種類: 新規）
状態: 実行中

## 検証コマンド

| 種類 | コマンド |
|---|---|
| test | `npm test` |
| 字数・構成 | `npm run blog:stats -- seikyusho-template` |
| 図 | `npm run blog:figures -- seikyusho-template` |
| ビルド | `npm run build` |
| スマホ表示 | `npm run blog:mobile -- seikyusho-template` |

## タスク

- [x] T1: ファクトチェック — 03-fact-check.md。裏が取れない主張は「削除」「書き換え」と判定
- [x] T2: プロダクト整合性 — 04-consistency.md
- [x] T3: 執筆 — content/blog/seikyusho-template.md。blog:stats が OK（テンプレ PDF・Excel の実物も作る）
- [x] T4: 図と OG — content/figures/seikyusho-template/。blog:figures が OK
- [x] T5: 最終レビュー — 06-review.md。5つの検証コマンドがすべて OK、スマホのスクショを目で確認
- [ ] T6: 公開準備 — 相互リンク（BACKLOG・SCHEDULE は触らない）、blog/seikyusho-template を push、PR＋ラベル publish:2026-11-12、プレビュー URL を取得

## 実行ログ

| タスク | コミット | メモ |
|---|---|---|
| T1 | (this) | 18件検証。VERIFIED 13・書き換え 3・削除 2。M061・M062 を追記 |
| T2 | (this) | 食い違いなし。CTA の文面を確認済み事実に限定 |
| T3 | (this) | 本文 4,567字（blog:stats の図NGは T4 で解消）。PDF（空欄＋記入例）・Excel（入力・記入例・使い方）を生成。生成スクリプトは .claude/work/ に置きコミットしない |
| T4 | (this) | 図2枚（items6・calc）＋OG。blog:figures OK・最小44px。check5 は作らずリストに |
| T5 | (this) | 5つの検証コマンド OK。Q2 の仕入明細書の記述を一次資料の範囲に絞った |

## 失敗カウンタ

| タスク | エラーの要旨 | 回数 | 試したこと |
|---|---|---|---|

## 最終報告に載せる項目

- 書き換え: インボイスで増える3つ →「登録番号・適用税率・税率ごとの消費税額」（構成書は「税率ごとの合計」）／請求書の発行義務 → 登録事業者が課税事業者から求められたときの交付義務に限定／立替金 → 「明らかに区分して請求すれば報酬に含めない扱い（司法書士の事例）」＋契約次第
- 削除: ガソリン代の扱いの断定／「差し戻されない」
- 新しく足した誤解: M061・M062
- 人の判断が要る点: QR 読み取り元 template_seikyusho / template_seikyusho_xlsx を CLAUDE.md の一覧に足す（この PR では CLAUDE.md を変えられない）
- Excel の数式は Excel / Numbers での再計算表示を未確認（手元に LibreOffice なし）。DL して記入例シートの合計が 267,280 になるか一度開いて確かめる
