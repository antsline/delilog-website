# ブログの公開予定

2日に1本のペースで出すための予定表。`/blog-week` がこのファイルを読んで次の3〜4本を選び、承認後に公開日を書き込む。
ネタの中身（狙う検索語・構成メモ・重複回避）は `docs/BLOG_BACKLOG.md`、公開済みの一覧もそちらが正。

最終更新: 2026-11-06（予約公開の仕組みと一緒に新設）

## 仕組み（要点）

1. 週に1回 `/blog-week`。下の「次の候補」から上から順に3〜4本を選び、企画と構成をまとめて1回で承認する
2. 承認後、1本ずつ `/write-blog` の予約モードで作る → PR に `publish:YYYY-MM-DD` ラベル
3. オーナーはプレビューで**法令の記述だけ**確かめて「公開して」→ PR に `approved` ラベル
4. 毎朝 6:00（JST）に GitHub Actions（`scheduled-publish`）が、公開日が来た `approved` の PR を main に入れる → Vercel が本番に出す
5. 公開日までに `approved` が付かなかった PR は公開されず、その日以降の朝に `approved` が付いた時点で出る（公開日はずらさなくてよい）

確認の仕方: GitHub の Actions → scheduled-publish → Run workflow（dry_run にチェック）で、次の朝に入る PR が分かる。

## ルール

- **作り直しと新記事を交互に**並べる。作り直しは既に検索に出ている記事の改善なので効果が早い
- 中身は**テンプレ・書き方・手続き系**（アプリにつながる検索意図）。読み物系の新規は 2026-08-14 に止めた
- 時期もの: 確定申告ガイドは 11〜12月中、経費リストは 1月上旬まで
- 作り直しは「丸ごと」（tenko-kiroku-kakikata と同じ: 今のルールの字数・縦長の図・冒頭の結論）。slug と公開日（frontmatter の `date`）は変えない
- 経費の記事は、アプリの経費帳（1.4.14）が App Store に出てから。それまで CLAUDE.md の「プロダクト事実」は「経費帳は未実装」のまま
- 1本ずつ実物（テンプレの PDF・Excel、記入例）を付ける。AI で量産した薄い記事は検索で落とされ、既存のテンプレ記事まで巻き込む

## 予約済み・プレビュー中

| 公開日 | 種類 | slug | タイトル（短縮） | PR | 状態 |
|---|---|---|---|---|---|

（`/blog-week` が行を足す。公開されたら BLOG_BACKLOG の「公開済み記事」へ移し、ここからは消す）

## 次の候補（上から順に使う）

| 順 | 種類 | slug（案） | テーマ | メモ |
|---|---|---|---|---|
| 1 | 作り直し | `nichijou-tenken-kirokubo-template` | 日常点検記録簿テンプレ | 図3・20,186字。テンプレ3本の中で表示が最多クラス |
| 2 | 新規 | `seikyusho-template` | 軽貨物の請求書テンプレート（インボイス対応 PDF・Excel） | 2026-08-14 に「最優先の投資」と決めた。売上・請求書は記事ゼロで Premium 機能 |
| 3 | 作り直し | `tenko-kirokubo-template` | 点呼記録簿テンプレ | 図3・14,429字。Q4 の国交省アルコールのページを確かめ直す |
| 4 | 新規 | `kakutei-shinkoku-keikamotsu` | 軽貨物の確定申告ガイド（BACKLOG #19・候補2） | 11〜12月中に出す |
| 5 | 作り直し | `gyoumu-no-kiroku-template` | 業務の記録テンプレ | 図2・15,640字 |
| 6 | 新規 | `untensha-daichou-template` | 1人親方の運転者台帳テンプレ（BACKLOG #16） | アプリのドライバー手帳から PDF 出力できる |
| 7 | 作り直し | `gyoumu-no-kiroku-kakikata` | 業務の記録の書き方 | 勝ち記事 #2 |
| 8 | 新規 | `shidou-kantoku-kiroku-template` | 指導・監督の記録テンプレ | 2025年4月義務化。アプリで入力は無料 |
| 9 | 作り直し | `kaizen-kijun-kokuji-keikamotsu` | 改善基準告示（勤務時間ルール） | |
| 10 | 新規 | `keikamotsu-keihi-list` | 軽貨物の経費リスト（BACKLOG #20） | 1.4.14 公開後。1月上旬まで |
| 11 | 作り直し | `keikamotsu-anzentaisaku-2025` | 法令義務14項目 | |
| 12 | 新規 | `keikamotsu-kansa-mochimono` | 巡回指導・監査の持ち物（BACKLOG #17） | |
| 13 | 作り直し | `keikamotsu-kuro-number-shutoku` | 黒ナンバー取得の流れ | |
| 14 | 新規 | `alcohol-kenchiki-kojin` | 個人事業主のアルコール検知器（BACKLOG #14） | 機種比較と運用に振り切る（#3 と重ねない） |
| 15 | 作り直し | `keikamotsu-hatarakikata` | 業務形態3類型 | |
| 16 | 新規 | `juudai-jiko-sokuhou` | 重大事故の24時間速報（BACKLOG #18） | |
| 17 | 作り直し | `keikamotsu-jittai-toukei` | 実態統計 | 「売上ベースである可能性が高い」は裏が取れないので直す |
| 18 | 新規 | `keikamotsu-gyousei-shobun` | 行政処分の判断と実例（BACKLOG #21） | |
| 19 | 作り直し | `keikamotsu-konenashi-shigoto-routes` | コネなしで仕事を得る | 「2〜3割高め」に出典が無いので直す |
| 20 | 作り直し | `keikamotsu-yami-kouzou` | 業界の闇 | |
