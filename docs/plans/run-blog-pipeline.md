# ブログ作成ルールとパイプラインの作り直し

作成: 2026-11-02
ブランチ: feat/blog-pipeline（worktree `~/delilog-website-blog-pipeline`。本体の作業ツリーにある未公開の変更には触らない）
状態: 実行中

## 要件

ユーザー決定（2026-11-02）:

1. **図はスマホ前提**: 縦長 4:5（1080×1350）・1枚1メッセージ・要素6つまで・スマホ表示で文字14px以上。細かい表は画像にせず本文の表で書く
2. **記事は 4,000〜6,000字**（空白除外）。冒頭に結論の要約。1記事1テーマ。収まらない話題は別記事に分けてリンクでつなぐ
3. **`/write-blog` は承認1回**: 企画＋構成を承認したら、完成まで止まらない。ファクトチェックで裏が取れない主張は記事から外し、最終報告に載せる
4. **図と OG 画像は自動生成**: HTML → PNG（puppeteer-core＋手元の Chromium）。スマホ幅 390px で記事を表示して確かめる
5. **終わり方**: 記事用ブランチに push して Vercel のプレビュー URL を返す。main には入れない

非目標:

- 既存14記事の画像・長さの作り直し（ルールが固まった後に別計画）
- 事故記事（`jiko-houkokusho-template`）の仕上げ（このパイプラインの最初の利用として別に行う）
- サイトの見た目（記事ページのレイアウト・CSS）の変更

## 受け入れ条件

- `npm run blog:figures -- <slug>` で、作業フォルダの図の HTML から `public/blog/<slug>/*.png`（1080×1350）と OG（1200×630）ができる。スマホ表示で14px未満になる文字・枠からはみ出す要素があれば失敗する
- `npm run blog:stats -- <slug>` で、本文の字数（空白・記法を除く）・画像数・CTA 数・冒頭の要約の有無が出て、範囲外なら失敗する
- `npm run blog:mobile -- <slug>` で、390px 幅の記事のスクリーンショットと、各画像の表示幅・実効の最小文字サイズが出る
- CLAUDE.md・blog-* エージェント・`/write-blog` が上の要件に沿って書き換わっている
- 既存記事（点呼記録簿テンプレ）に `blog:mobile` を当てると、今の画像が「小さすぎる」と判定される（チェックが本当に効いている証拠）

## 検証コマンド（1タスクごとに全部通す）

| 種類 | コマンド |
|---|---|
| test | `npm test`（T1 で追加: `node --test scripts/blog`） |
| typecheck | `npm run build`（Next.js のビルドが型チェックを兼ねる。単独の tsc 設定は無い） |
| lint | なし（ESLint の設定ファイルが無く、`next lint` は対話で設定を始めてしまうため） |

## タスク

- [x] T1: 図と OG の書き出しスクリプト — `scripts/blog/render-figures.mjs`・共通 CSS（パレット・Noto Sans JP）・OG テンプレ・`npm run blog:figures`。文字サイズとはみ出しの判定は純関数にしてテスト先行。サンプル図で書き出せる
- [x] T2: 記事の字数・構成チェック — `scripts/blog/article-stats.mjs`・`npm run blog:stats`。字数の数え方（frontmatter・記法・URL・CTA の中身の扱い）をテスト先行で決める。既存14記事の字数一覧を出して実行ログに残す
- [x] T3: スマホ表示の確認スクリプト — `scripts/blog/mobile-check.mjs`・`npm run blog:mobile`。ビルド済みサイトを 390px で開き、全画面スクショと画像ごとの判定を出す。点呼記録簿テンプレで「小さすぎる」と出ることを確かめる
- [ ] T4: CLAUDE.md のルール改定 — 文字数・章構成（冒頭の要約・章の数・FAQ の数）・図の仕様・OG の作り方・パイプラインの説明を新しいルールに
- [ ] T5: エージェントの改定 — planner（字数に収まるテーマの切り方・分割案）、outliner（章ごとの字数の割り当て・図は1メッセージ）、fact-checker（承認を待たず、裏が取れない主張は「外す」と判定）、writer（字数の上限・表は本文で）、reviewer（3つのスクリプトの結果を使う）。image-prompter を廃止し、図の HTML を書く `blog-figure-maker` を新設
- [ ] T6: `/write-blog` の作り直し — 承認は企画＋構成の1回。承認後は記事用の計画ファイル（`- [ ] T` 形式）と `run-plan-state` で Stop フックの柵をかけ、ファクトチェック → 執筆 → 図 → 3つのチェック → ビルド → コミット → `blog/<slug>` ブランチに push → プレビュー URL まで止まらない。最終報告の型（外した主張・スマホのスクショ・プレビュー URL）

## リスクのあるタスク

- T6: external（GitHub への push で Vercel のプレビューが作られる）。push 先は `blog/<slug>` ブランチに限り、main への push・マージは手順に書かない。commit 前に敵対レビューを当てる

## 実行ログ

| タスク | コミット | メモ |
|---|---|---|
| T1 | 7e85a99 | 図は content/figures/<slug>/*.html（main.fig の中身だけ）。setContent では file:// を読めないので一時ファイルを開く方式に。見本 scripts/blog/examples は合格、examples/ng は不合格になることを確認。フォントは Google Fonts の Noto Sans JP（読めなければヒラギノ） |
| T2 | 90612a1 | 字数は空白・記法・URL・CTA/DLBOX・「あわせて読みたい」「参考資料」を除いて数える。既存13記事（公開済み）は 7,221〜25,181字で全件が目安超え・冒頭の要約なし・図は全て横長（下の表） |
| T3 | (このコミット) | 本文（.prose）内の表示中の画像だけを判定（PC 用 QR・CTA カードのアイコンは除外）。点呼記録簿テンプレで横長の3枚が「4.7倍に縮小」で NG になることを確認。スクショは .claude/work/<slug>/mobile/（2倍解像度） |

### T2 時点の既存記事（本文の字数・新しい数え方）

| 記事 | 本文の字数 | 図 | CTA |
|---|---:|---:|---:|
| keikamotsu-anzentaisaku-2025 | 7,221 | 3 | 2 |
| gyoumu-no-kiroku-kakikata | 7,983 | 4 | 2 |
| tenko-kiroku-kakikata | 9,093 | 4 | 2 |
| keikamotsu-hatarakikata | 9,309 | 3 | 1 |
| keikamotsu-jittai-toukei | 10,345 | 4 | 1 |
| kaizen-kijun-kokuji-keikamotsu | 10,525 | 5 | 2 |
| keikamotsu-konenashi-shigoto-routes | 13,666 | 5 | 1 |
| tenko-kirokubo-template | 14,498 | 4 | 2 |
| gyoumu-no-kiroku-template | 15,640 | 3 | 2 |
| keikamotsu-kuro-number-shutoku | 16,420 | 6 | 3 |
| nichijou-tenken-kirokubo-template | 20,220 | 4 | 2 |
| keikamotsu-tanka-soba-2026 | 21,091 | 9 | 2 |
| keikamotsu-yami-kouzou | 25,181 | 5 | 2 |

## 失敗カウンタ

| タスク | エラーの要旨 | 回数 | 試したこと |
|---|---|---|---|

## 未解決の点

（実行中に見つけた計画外の作業を積む）
