# ブログ記事: 軽貨物「業務の記録（運行記録）」の書き方｜6項目の意味・保存1年【2026年版】

作成: 2026-11-16
ブランチ: blog/gyoumu-no-kiroku-kakikata
WORKTREE: /Users/narajunichi/delilog-website/.claude/worktrees/blog-gyoumu-no-kiroku-kakikata
公開日: 2026-11-22（種類: 作り直し）
状態: 完了

## 検証コマンド

| 種類 | コマンド |
|---|---|
| test | `npm test` |
| 字数・構成 | `npm run blog:stats -- gyoumu-no-kiroku-kakikata` |
| 図 | `npm run blog:figures -- gyoumu-no-kiroku-kakikata` |
| ビルド | `npm run build` |
| スマホ表示 | `npm run blog:mobile -- gyoumu-no-kiroku-kakikata` |

## タスク

- [x] T1: ファクトチェック — 03-fact-check.md。裏が取れない主張は「削除」「書き換え」と判定
- [x] T2: プロダクト整合性 — 04-consistency.md
- [x] T3: 執筆 — content/blog/gyoumu-no-kiroku-kakikata.md（短い ID gyomu-guide は登録済み）。blog:stats が OK（図以外）
- [x] T4: 図と OG — content/figures/gyoumu-no-kiroku-kakikata/。blog:figures が OK
- [x] T5: 最終レビュー — 06-review.md。5つの検証コマンドがすべて OK、スマホのスクショを目で確認
- [x] T6: 公開準備 — 作り直しなので相互リンクは足さない。BLOG_SCHEDULE・BLOG_BACKLOG は触らない。push、PR（publish:2026-11-22）、プレビュー URL

## 実行ログ

| タスク | コミット | メモ |
|---|---|---|
| T1 | (このコミット) | 採用8・書き換え5・削除7。M073〜M075 追加、M015・M016 に更新メモ |
| T2 | (このコミット) | 重大7件を構成書に反映（6項目の数え方・ctaTitle・カード文言ほか） |
| T3 | (このコミット) | 本文 4,223字・6章・FAQ 4問 |
| T4 | (このコミット) | 図2枚（縦長）＋OG。blog:figures OK。旧画像 chiten.png・timeline.png を削除 |
| T5 | (このコミット) | 5つの検証 OK。直した点なし |
| T6 | (このコミット) | 作り直しなので相互リンクは足さない。ぶつかりうるファイルなし |

## 失敗カウンタ

| タスク | エラーの要旨 | 回数 | 試したこと |
|---|---|---|---|

## 最終報告に載せる項目

- ファクトチェック: 外した主張 — 罰金（最大100万円）・事業停止／業務の記録の単位は1回／前日の記録のコピー可・正直なメモが評価される・監査で見られる範囲・年80〜120時間／配送アプリの履歴だけで足りる／ルート配送は省略可／記録を忘れた日の扱い／走行距離1km単位・個別住所の省略／地点は市区町村＋施設名で足りる
- 書き換え: 6項目は国交省リーフレットの6つ（氏名・車両番号・日時・地点・距離・主な経過地点）。事故・遅延・待機・荷役・交替は6項目の外の「起きたときの記録」／根拠は第8条柱書の括弧書き（準用ではない）／「14項目」は書かない／休憩は10分未満なら省略可／まとめ書きは FAQ の「努めてください」
- 新しい誤解: M073〜M075
- 人の判断が要る点: M075「国交省の安全対策の表は13行で、14項目は国交省の数字ではない」— 既存記事 keikamotsu-anzentaisaku-2025 のタイトル「14項目」と、他記事のリンク文言に影響。作り直し候補（BLOG_SCHEDULE の候補3）で扱う
- レビューの指摘: 第4章の表の「交替」行が「記録事項は FAQ で確認」と曖昧（FAQ p.17 を確かめて具体化すると親切）。本文 4,223字で下限に近い（水増しはしない）
- ぶつかりうるファイル: なし
