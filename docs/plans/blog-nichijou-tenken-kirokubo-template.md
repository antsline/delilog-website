# ブログ記事: 軽貨物の日常点検記録簿テンプレ｜15項目PDF（無料DL）と記入例【2026年版】

作成: 2026-11-08
ブランチ: blog/nichijou-tenken-kirokubo-template
WORKTREE: /Users/narajunichi/delilog-website/.claude/worktrees/blog-nichijou-tenken-kirokubo-template
公開日: 2026-11-10（予約モード。種類: 作り直し）
状態: 完了

## 検証コマンド

| 種類 | コマンド |
|---|---|
| test | `npm test` |
| 字数・構成 | `npm run blog:stats -- nichijou-tenken-kirokubo-template` |
| 図 | `npm run blog:figures -- nichijou-tenken-kirokubo-template` |
| ビルド | `npm run build` |
| スマホ表示 | `npm run blog:mobile -- nichijou-tenken-kirokubo-template` |

## タスク

- [x] T1: ファクトチェック — 03-fact-check.md。裏が取れない主張は「削除」「書き換え」と判定
- [x] T2: プロダクト整合性 — 04-consistency.md
- [x] T3: 執筆 — content/blog/nichijou-tenken-kirokubo-template.md。blog:stats が OK
- [x] T4: 図と OG — content/figures/nichijou-tenken-kirokubo-template/。blog:figures が OK
- [x] T5: 最終レビュー — 06-review.md。5つの検証コマンドがすべて OK、スマホのスクショを目で確認
- [x] T6: 公開準備 — 相互リンクと BLOG_BACKLOG の更新、blog/nichijou-tenken-kirokubo-template を push、プレビュー URL を取得

## 実行ログ

| タスク | コミット | メモ |
|---|---|---|
| T1 | (このコミット) | 15件中 採用7・書き換え5・削除3。M038 が誤りと判明し M061 を追記 |
| T2 | (このコミット) | 食い違いなし。表Dの「点呼との連動」は同じアプリで残せる、に限定 |
| T3 | (このコミット) | 本文 4,298字・5章＋FAQ4問・CTA2枚。skeleton/sections を分けず1回で執筆 |
| T4 | (このコミット) | 図3枚＋OG。blog:figures OK。旧横長画像3枚を削除 |
| T5 | (このコミット) | npm test 43 pass / blog:stats OK 4,298字 / blog:figures OK / build OK / blog:mobile OK（最小14.6px）。CTA に透かしを追記 |
| T6 | (このコミット) | 作り直しのため相互リンクは追加しない。BACKLOG #11 の字数メモを更新。ぶつかりうるファイル: なし |

## 失敗カウンタ

| タスク | エラーの要旨 | 回数 | 試したこと |
|---|---|---|---|

## 最終報告に載せる項目

- 書き換え: 「黒ナンバーは道路運送車両法第47条の2第2項で一日一回・運行開始前の点検が義務」→ 法律上の時期は第1項「適切な時期」（同法第2条第7項で貨物軽自動車運送事業は「自動車運送事業」から除かれる。国交省FAQ p.32も「自家用乗用車などと同様に、適切な時期」）。ただし業務前点呼で毎回「点検の実施又はその確認」を確かめて記録（輸送安全規則第7条第1項第3号）
- 書き換え: 「15項目の網羅が法令上必要」→ 基準は自動車点検基準 別表第二。15項目に加えタイヤの異状な摩耗・前回の運行で異状があった箇所も確かめる
- 削除: 「日常点検の記録は輸送安全規則で1年保存」（条文なし。点呼記録の1年に合わせる目安として書く）／「国交省に Excel 様式は無い」（未確認）／ディスク・ホイール（軽に無関係）／「2025年4月から点呼で日常点検を確認」（M048）
- 新しい誤解: M061（M038 を訂正。M038 に訂正注記）
- 人の判断: 他記事（keikamotsu-anzentaisaku-2025・keikamotsu-kuro-number-shutoku）の「日常点検（毎日）」表記と、アプリ内ヘルプ daily-inspection.ts の「運行前に…法令義務」は M061 と食い違う。作り直し・アプリ更新時に見直し
