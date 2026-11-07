# ブログ記事: 軽貨物で残す記録・書類の保存期間一覧

作成: 2026-11-08
ブランチ: blog/keikamotsu-kiroku-hozon-kikan
WORKTREE: /Users/narajunichi/delilog-website/.claude/worktrees/blog-keikamotsu-kiroku-hozon-kikan
公開日: 2026-11-16（予約モード。種類: 新規）
状態: 実行中

## 検証コマンド

| 種類 | コマンド |
|---|---|
| test | `npm test` |
| 字数・構成 | `npm run blog:stats -- keikamotsu-kiroku-hozon-kikan` |
| 図 | `npm run blog:figures -- keikamotsu-kiroku-hozon-kikan` |
| ビルド | `npm run build` |
| スマホ表示 | `npm run blog:mobile -- keikamotsu-kiroku-hozon-kikan` |

## タスク

- [x] T1: ファクトチェック — 03-fact-check.md。裏が取れない主張は「削除」「書き換え」と判定
- [x] T2: プロダクト整合性 — 04-consistency.md
- [ ] T3: 執筆 — content/blog/keikamotsu-kiroku-hozon-kikan.md。blog:stats が OK
- [ ] T4: 図と OG — content/figures/keikamotsu-kiroku-hozon-kikan/。blog:figures が OK
- [ ] T5: 最終レビュー — 06-review.md。5つの検証コマンドがすべて OK、スマホのスクショを目で確認
- [ ] T6: 公開準備 — 相互リンクの更新（BACKLOG・SCHEDULE は触らない）、blog/keikamotsu-kiroku-hozon-kikan を push、PR とラベル、プレビュー URL を取得

## 実行ログ

| タスク | コミット | メモ |
|---|---|---|
| T1 | (このコミット) | 31件検証。書き換え7・削除3。M065・M066 追記 |
| T2 | (このコミット) | 不整合0（第4章で delilog に触れない注意1件） |

## 失敗カウンタ

| タスク | エラーの要旨 | 回数 | 試したこと |
|---|---|---|---|

## 最終報告に載せる項目

- 書き換え: 「3か月点検の点検整備記録簿・1年保存」→「1年ごとの定期点検の点検整備記録簿・記載の日から2年保存」（道路運送車両法第2条第7項・第48条第1項第3号、自動車点検基準第2条第5号・第4条第2項、FAQ p.32）。結論・一覧・図・OG を「1年・2年・3年」に変更
- 書き換え: 日常点検「一日一回・運行前が義務」→「適切な時期。業務前点呼で毎回確認して記録」（M061）
- 書き換え: M006「経過措置は安全管理者だけ」→ 特別な指導・適性診断も既存事業者は2028年3月まで（リーフレット p.2）
- 削除: 「整備工場が記録簿を書く」「営業所は自宅のことが多い」（一次資料なし）、アルコール数値・所見の話題（主題外）
- 新規の誤解: M065（軽の定期点検は3か月・記録簿1年 → 1年・2年）、M066（M006 の補足）
- 範囲外（既存記事）: gyoumu-no-kiroku-template の Q2 の表「日常点検記録 1年」と末尾「業務の記録・点呼記録・日常点検記録は、いずれも同じ1年間の保存期間を持つ法令義務」は、日常点検の記録に保存期間の条文が見当たらない（PR #12 と同じ結論）ことと食い違う。keikamotsu-anzentaisaku-2025 の FAQ「アルコールチェッカーは…数値を記録する必要」も M011 と食い違う（企画書で既出）
