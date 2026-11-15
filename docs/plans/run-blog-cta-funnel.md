# ブログ→アプリ導線の改善

作成: 2026-11-15
ブランチ: feat/blog-cta-funnel（worktree `.claude/worktrees/blog-cta`。main のチェックアウトにあるオーナーの未コミット変更に触れないため）
状態: 完了

元の指示: `~/Downloads/delilog-blog-cta-claude-code.md`（2026-11-15 版）。方針は会話で提示し、指示書の再送で了承。

## 要件

- テンプレ5記事の DL ボックスに、本文 CTA と同じストアボタンと記事別の文言を置く（「（無料）」とプレミアムの矛盾も直す）
- 記事末尾のカード（article-end）の見出しと本文を、記事の frontmatter で上書きできるようにする（請求書・事故2本・6種類）
- 解説3記事（点呼の書き方・業務の記録ガイド・6種類）のリード直後に CTA を1つ置く
- モバイル固定バーを 768px 未満・本文 CTA が見えている間は隠す・新しい文言・`data-cta="sticky"` にする
- /blog 一覧の見出しの下に CTA を1つ
- ヘッダー／モバイルメニューの「ダウンロード」→「無料で始める」
- 計測: 記事ごとの短い ID（`content/blog-short-ids.json` が正）で、App Store `ct=b_<ID>_<配置>`、Google Play `utm_source=b_<ID>&utm_medium=blog&utm_content=<配置>`。QR は記事別に `/download?from=blog_<ID>`、リダイレクトでは `ct` と `utm_source` を同じ値にする
- 非目標: トップページ（LP）の計測命名の変更、テンプレ PDF に印刷済みの QR の作り直し、記事本文の書き直し（指定の文言以外）

## 受け入れ条件

- test / typecheck / build が通る
- 全記事・全配置で `ct` が40文字以内（テストで確かめる）
- 対象9記事と /blog を 375px と PC 幅で開き、各 CTA が出てリンクの印が想定どおり

## 検証コマンド（1タスクごとに全部通す）

| 種類 | コマンド |
|---|---|
| test | `npm test` |
| typecheck | `npx tsc --noEmit` |
| lint | なし（ESLint 未設定。`next lint` は対話式の初期設定を求めてくる） |
| build | `npm run build` |

## タスク

- [x] T1: 計測の命名を短い ID に切り替える — 対応表 JSON・命名の純関数とテスト・本文リンク／記事末尾／記事下リンク／ヘッダー／固定バーに配置別の印・/download の ct と utm_source を揃える・予約公開の許可リストと blog:stats の登録漏れチェック
- [x] T2: PC 表示の QR を記事別にする — `from=blog_<ID>` の QR をビルド時に SVG で作り、本文 CTA と記事末尾カードに出す
- [x] T3: DL ボックスにストアボタンと記事別の文言（指示書タスク1・2）
- [x] T4: 記事末尾カードの見出し・本文を frontmatter で上書き（タスク3）
- [x] T5: 解説記事の冒頭 CTA（`<!--CTA:top-->`、タスク5。6種類の記事は CTA 上限3枚を守るため第3章末のカードと入れ替え）
- [x] T6: モバイル固定バーの手直し（タスク6）
- [x] T7: /blog 一覧の CTA（タスク7）
- [x] T8: ヘッダー／モバイルメニューの文言（タスク8）
- [x] T9: CLAUDE.md・UTM ガイド・執筆パイプラインの説明を新しい書き方と命名に合わせる
- [x] T10: ローカルで 375px と PC 幅の表示とリンクの印を確かめる（直しがあれば同じコミットで）

## リスクのあるタスク

- T1・T2（external）: ストアの計測の名前が変わる。間違えると App Store Connect / Play Console の流入が数えられなくなる

## 実行ログ

| タスク | コミット | メモ |
|---|---|---|
| T1 | (このコミット) | code-reviewer: CRITICAL/HIGH なし。MEDIUM の配置名の型・URL の回帰テスト・JSON 読み込みエラーを直した。union は publish-due が git CLI の merge --squash で取り込むので効く |
| T2 | (このコミット) | qrcode 1.5.4 を追加（worktree は node_modules を main と共有せず npm ci）。QR は1枚約2.8KB。code-reviewer はコミット後に結果を受けて追加コミットで対応 |
| T3 | (このコミット) | 文言の頭に「delilog アプリ」を補った（指示書の文言だけだとアプリ名が出ないため）。gyoumu-no-kiroku-template の blog:stats NG は既存の横長図（作り直し待ち）で今回と無関係 |
| T2 追補 | (このコミット) | T2 レビュー MEDIUM: data URI がページに何度も入る → /blog-qr/<ID>.svg の静的ルートに変更。QR の行き先と画像名のテストを追加 |
| T4 | (このコミット) | frontmatter の ctaTitle / ctaBody。文字列以外はビルドで止める。BlogCtaCard は一覧でも使えるよう slug 省略・配置名・data-cta を受け取る |
| T5 | (このコミット) | <!--CTA:top--> は inline-N の番号に数えず data-cta="top"。blog:stats も CTA として数える。6種類の記事は第3章末のカードを外して3枚に。gyoumu-no-kiroku-kakikata の blog:stats NG（字数・図・結論）は旧ルールの記事の既存問題 |
| T6 | (このコミット) | md 未満（768px 未満）で表示・1px でもスクロールしたら出す・本文の CTA（dlbox / top / inline-N / article-end）が画面にある間は IntersectionObserver で隠す。sessionStorage は try/catch |
| T7 | (このコミット) | 記事末尾と同じ BlogCtaCard を見出しの下に。一覧にはクリック計測が無かったので BlogClickTracker（slug="index"）も足した |
| T8 | (このコミット) | ブログのヘッダー（PC のナビ・モバイルメニュー）だけ。トップページのヘッダーは非目標なので触らない |
| T9 | (このコミット) | CLAUDE.md（CTA の冒頭枠・DLBOX の型・frontmatter・印の命名・QR・固定バー）、blog-writer、write-blog（短い ID の登録）、UTM_GUIDE |
| T10 | (このコミット) | 対象9記事＋/blog を 1280 / 375 / 375（Android の UA）で puppeteer 確認。全リンクの ct は最大23文字。Android では header / footer / sticky が Google Play に切り替わる。固定バーは CTA の上で隠れる。冒頭カードの内部リンクに色が無かったので globals.css で付けた |
| 最終レビュー | (このコミット) | code-reviewer: CRITICAL/HIGH なし。MEDIUM の「DL ボックスの型を検査していない」→ blog:stats で最後の段落がストアボタンの行かを確かめる。「固定バーで同じリンクが2回読まれる」→ 文言側を aria-hidden。計測名の変更と保存期間の記事のカード入れ替えは意図どおり（最終報告に記載） |

## 失敗カウンタ

| タスク | エラーの要旨 | 回数 | 試したこと |
|---|---|---|---|

## 未解決の点

- seikyusho-template は 375px で本文の7列の表が 0.7px はみ出す（記事の既存の表。今回の変更とは無関係）
- gyoumu-no-kiroku-kakikata にはカードの外の素のストアリンクがある（印は body。CLAUDE.md の「単発リンク禁止」に反する既存の記述）。字数・横長の図と合わせて作り直しのときに直す
- 一覧（/blog）には固定バーを出していない（固定バーは記事だけ。指示書の対象も記事）

- `public/qr/blog.svg`（from=blog_qr）はサイトから参照されなくなった。印刷物などで使っていなければ消してよい
