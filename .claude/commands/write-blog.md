---
description: delilog ブログの新記事を企画から執筆・画像配置・コミットまで一連で進めるパイプライン。テーマを引数に取り、6体のエージェントを順次起動。タイムアウト対策として writer は3モード分割、中間成果物は `.claude/work/<slug>/` に永続化。Human-in-the-Loop方式で重要な節目に承認ポイント。
---

ブログ記事執筆パイプラインを開始します。

ユーザーから渡されたテーマ: $ARGUMENTS

## ⚠️ 起動前確認

- このコマンドは新しい Claude Code セッションで実行することを強く推奨。`.claude/agents/` のカスタムエージェントは新セッションでのみ自動認識される
- もしセッション中に作成・更新されたエージェントを使う場合は、`general-purpose` を `subagent_type` に指定し、各エージェントの `.md` ファイル内容を prompt に埋め込む

## 全体フロー

```
[1] planner (5分)
    ↓
⏸ ユーザー承認: 企画書
    ↓
[2] outliner (5分)
    ↓
[3] fact-checker (10〜30分、件数次第)
    ↓
⏸ ユーザー承認: ファクトチェック結果
    ↓
[4] consistency-guard (5分)  ← 並行可
    ↓
[5a] writer mode=skeleton (5分)
    ↓
[5b/c/d] writer mode=sections × 3並行 (各10〜15分、合計15分弱)
    ↓
[5e] writer mode=merge (5分)
    ↓
[6] reviewer + image-prompter 並行 (5〜10分)
    ↓
⏸ ユーザー承認: 最終ドラフト
    ↓
[7] 画像生成 (ユーザー手作業 30分前後)
    ↓
[8] 画像配置 + ビルド確認 (5分)
    ↓
⏸ ユーザー承認: コミット可否
    ↓
[9] コミット & プッシュ
    ↓
[10] 公開後アナウンス
```

合計エージェント時間: **45〜60分**（うち並行で短縮可）
ユーザー手作業: **画像生成 30分前後**
End-to-end: **1.5〜2時間**

---

## Phase 1: 企画立案

**Agent**: `blog-planner`

```
Agent({
  description: "Plan blog article",
  subagent_type: "blog-planner",
  prompt: "テーマ: $ARGUMENTS\n\n企画書を作成し、`.claude/work/<slug>/01-plan.md` に保存してください。"
})
```

slug は planner が決定（`/^[a-z0-9-]+$/` 形式）。

⏸ **ユーザー承認**: 企画書を表示し、「この方向で進めてよろしいですか？」と確認。

---

## Phase 2: 構成設計

**Agent**: `blog-outliner`

```
Agent({
  description: "Outline article",
  subagent_type: "blog-outliner",
  prompt: ".claude/work/<slug>/01-plan.md の企画書から詳細構成を作成し、.claude/work/<slug>/02-outline.md に保存してください。"
})
```

構成書はそのまま次のフェーズへ（承認は fact-checker 完了後にまとめて取る）。

---

## Phase 3: エビデンス検証

**Agent**: `blog-fact-checker`

```
Agent({
  description: "Fact-check claims",
  subagent_type: "blog-fact-checker",
  prompt: ".claude/work/<slug>/02-outline.md の要検証主張を全件、一次資料で検証してください。.claude/knowledge/misconceptions.md も必ず参照。結果は .claude/work/<slug>/03-fact-check.md に保存。"
})
```

⏸ **ユーザー承認**: ファクトチェックレポートを表示。特に過去の誤解パターン（M0XX）に該当する主張があれば**強調表示**。

「この検証結果で記事を執筆します。修正方針があれば指示してください。」と確認。

---

## Phase 4: プロダクト整合性チェック

**Agent**: `consistency-guard`

構成書（執筆前）または writer-skeleton（執筆中）を対象に整合性を確認。

```
Agent({
  description: "Check product consistency",
  subagent_type: "consistency-guard",
  prompt: ".claude/work/<slug>/02-outline.md と 03-fact-check.md を対象に、delilogプロダクト事実との整合性をチェック。.claude/work/<slug>/04-consistency.md に結果を保存。"
})
```

5分以内で完了。重大な不整合があれば修正方針を確定してから次へ。

---

## Phase 5: 執筆（3モード分割実行）

タイムアウト対策のため、writer を**4回呼び出す**。

### Phase 5a: スケルトン生成

```
Agent({
  description: "Write skeleton",
  subagent_type: "blog-writer",
  prompt: "mode: skeleton, slug: <slug>\n\nfrontmatter・章タイトル・画像プレースホルダ・シリーズ相互リンクボックスのみ生成。本文は空欄。出力先: .claude/work/<slug>/05a-skeleton.md"
})
```

### Phase 5b/c/d: 章単位で本文執筆（並行実行）

**1メッセージで3つのAgentコールを並行起動する**:

```
[同一メッセージで3つ並行]

Agent({ description: "Write sections 1-4", subagent_type: "blog-writer",
  prompt: "mode: sections, slug: <slug>, section_range: 1-4" })

Agent({ description: "Write sections 5-8", subagent_type: "blog-writer",
  prompt: "mode: sections, slug: <slug>, section_range: 5-8" })

Agent({ description: "Write sections 9-12", subagent_type: "blog-writer",
  prompt: "mode: sections, slug: <slug>, section_range: 9-12" })
```

各 section は2,000〜3,500字程度。1エージェントあたり10〜15分以内に完了する設計。並行実行で実時間15分弱。

### Phase 5e: 結合 + 既存記事の相互リンク更新

```
Agent({
  description: "Merge sections",
  subagent_type: "blog-writer",
  prompt: "mode: merge, slug: <slug>\n\nskeleton と全セクションを結合し、content/blog/<slug>.md に最終ファイルを生成。既存3〜4記事の「あわせて読みたい」も更新。npm run build 確認まで実施。"
})
```

---

## Phase 6: 最終レビュー + 画像プロンプト生成（並行）

**1メッセージで2つのAgentコールを並行起動**:

```
Agent({ description: "Review article", subagent_type: "blog-reviewer",
  prompt: "content/blog/<slug>.md を最終レビュー" })

Agent({ description: "Generate image prompts", subagent_type: "blog-image-prompter",
  prompt: "content/blog/<slug>.md の画像プレースホルダから生成プロンプトを作成、.claude/work/<slug>/07-image-prompts.md に保存" })
```

reviewer で重大な問題があれば修正してから次へ。

⏸ **ユーザー承認**: 最終ドラフトとレビュー結果を表示し、「画像生成に進んでよろしいですか？」

---

## Phase 7: 画像生成（ユーザー手作業）

ユーザーへ:

1. `.claude/work/<slug>/07-image-prompts.md` の OG画像（Canva）と記事内画像（ChatGPT Image）プロンプトを使って画像を生成
2. ダウンロード後、ファイル名を伝える

伝達例: 「`/Users/narajunichi/Downloads/<file>.png` に置いた」

---

## Phase 8: 画像配置 + ビルド確認

ユーザーから配置指示を受けたら:

1. `public/blog/<slug>/` フォルダを作成
2. 画像を所定のファイル名でコピー（og.png / structure.png 等）
3. `npm run build` で最終ビルド確認

---

## Phase 9: コミット & プッシュ

⏸ **ユーザー承認**: 「コミットしてプッシュしてよろしいですか？」

承認後:

```bash
git add content/blog/<slug>.md content/blog/<既存記事の編集分>.md public/blog/<slug>/
git commit -m "feat: N本目のブログ記事「<タイトル抜粋>」を追加

- content/blog/<slug>.md を新規追加（約X,XXX字）
- OG画像とインフォグラフィック<N>点を同梱
- 既存記事からのシリーズリンクを実リンク化
- <ファクトチェックで発見した誤解パターン回避のハイライト>"

git push origin main
```

---

## Phase 10: 公開後の案内

1. **Vercel 自動デプロイ**: 2〜3分で公開
2. **Search Console**: 新URLをインデックス登録リクエスト
3. **X投稿**: 案A/B/C から選んで投稿
4. **段階拡散**: 2〜3日後にスレッド、1週間後に短文Tips

---

## 中間成果物の永続化

各 Phase の出力は `.claude/work/<slug>/` に保存される:

```
.claude/work/<slug>/
├── 01-plan.md           # planner
├── 02-outline.md        # outliner
├── 03-fact-check.md     # fact-checker
├── 04-consistency.md    # consistency-guard
├── 05a-skeleton.md      # writer (skeleton)
├── 05b-section-1-4.md   # writer (sections, 並行1)
├── 05c-section-5-8.md   # writer (sections, 並行2)
├── 05d-section-9-12.md  # writer (sections, 並行3)
├── 06-review.md         # reviewer
└── 07-image-prompts.md  # image-prompter
```

**メリット**:

- writer がタイムアウトしても**他Phaseの再実行は不要**。失敗したsectionだけ再実行できる
- 過去の記事の検証結果を**再利用可能**
- デバッグ・振り返りが容易
- `.claude/work/` は git ignore してもよい（成果物だけリポジトリに残す運用）

---

## 新たに発見された誤解パターンの蓄積

fact-checker の出力に「**新規誤解パターン候補**」セクションが含まれていたら、ユーザーに承認を取った上で `.claude/knowledge/misconceptions.md` に追記。

これによりシステムは**記事を書くたびに賢くなる**。

---

## 全体ルール

- ⏸ ポイントは絶対にスキップしない
- 各エージェントの出力は中間成果物ファイルに保存し、次のエージェントはファイルを Read して入力にする
- writer のタイムアウト時は失敗した section のみ再実行
- エラー発生時は該当フェーズのエージェントにリトライ依頼か、ユーザーに状況報告
- 最終的に `content/blog/<slug>.md` + `public/blog/<slug>/*.png` + 既存記事の相互リンク更新がアトミックにコミットされる状態を目指す
