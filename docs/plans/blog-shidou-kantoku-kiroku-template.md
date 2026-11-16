# ブログ記事: 軽貨物「指導・監督の記録」の書き方｜1人親方の記入例とテンプレ（PDF・Excel無料DL）【2026年版】

作成: 2026-11-16
ブランチ: blog/shidou-kantoku-kiroku-template
WORKTREE: /Users/narajunichi/delilog-website/.claude/worktrees/blog-shidou-kantoku-kiroku-template
公開日: 2026-11-24（種類: 新規）
状態: 実行中

## 検証コマンド

| 種類 | コマンド |
|---|---|
| test | `npm test` |
| 字数・構成 | `npm run blog:stats -- shidou-kantoku-kiroku-template` |
| 図 | `npm run blog:figures -- shidou-kantoku-kiroku-template` |
| ビルド | `npm run build` |
| スマホ表示 | `npm run blog:mobile -- shidou-kantoku-kiroku-template` |

## タスク

- [x] T1: ファクトチェック — 03-fact-check.md。裏が取れない主張は「削除」「書き換え」と判定
- [x] T2: プロダクト整合性 — 04-consistency.md
- [x] T3: 執筆 — content/blog/shidou-kantoku-kiroku-template.md・配布ファイル（PDF・Excel）と content/blog-short-ids.json の1行（shidou-tpl）。blog:stats が OK（図以外）
- [x] T4: 図と OG — content/figures/shidou-kantoku-kiroku-template/。blog:figures が OK
- [ ] T5: 最終レビュー — 06-review.md。5つの検証コマンドがすべて OK、スマホのスクショを目で確認
- [ ] T6: 公開準備 — 相互リンク: keikamotsu-kiroku-hozon-kikan（指導・監督の節の本文にリンク＋同記事の誤り3点の修正＋保存期間の表の「詳しい記事」列の指導・監督と台帳の2行＋台帳の行の「運転者でなくなってから3年」を起算日を断定しない書き方に）。ほか1本。BLOG_SCHEDULE・BLOG_BACKLOG は触らない。push、PR（publish:2026-11-24）、プレビュー URL

## 実行ログ

| タスク | コミット | メモ |
|---|---|---|
| T1 | (このコミット) | 採用9・書き換え5・削除2。M080〜M084 追加。根拠は第10条第1項 |
| T2 | (このコミット) | 重大2件を構成書に反映（T1 の処置・モデル様式準拠と書かない） |
| T3 | (このコミット) | 本文 5,028字。配布ファイル PDF（空欄＋記入例・QR）・xlsx（2シート）、元 HTML は _shidou-template.htm |
| T4 | (このコミット) | 図2枚＋OG。blog:figures OK |

## 失敗カウンタ

| タスク | エラーの要旨 | 回数 | 試したこと |
|---|---|---|---|

## 最終報告に載せる項目

- ファクトチェック: 外した主張 — 1人親方の営業所は経営届出書の営業所／過去分を後から作る扱い・巡回指導で見せる話／マニュアル本編146ページ／1回15分などの所要時間。書き換え — 2025年4月新設ではない（M080。新設は初任運転者等への特別な指導）／1人二役は編集部の整理／毎年の単位は書かない（少なくとも年1回・分割可）／資料の写しは国交省が添付を示している／「習得する」
- 新しい誤解: M080〜M084
- 人の判断が要る点: アプリ（~/delilog）の指導監督記録簿 PDF の見出しが「第10条第2項に基づく法定記録」になっている。一般的な指導・監督の根拠は第10条第1項（第2項は特別な指導）。アプリ側の修正を推奨
- 公開後の作業: CLAUDE.md の QR 読み取り元の一覧に template_shidou / template_shidou_xlsx を足す
