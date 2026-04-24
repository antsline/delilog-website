---
description: delilog ブログの新記事を企画から執筆・画像配置・コミットまで一連で進めるパイプライン。テーマを引数に取り、6体のエージェント（planner, outliner, fact-checker, consistency-guard, writer, reviewer, image-prompter）を順次起動する。重要な節目でユーザー承認を求める Human-in-the-Loop 方式。
---

ブログ記事執筆パイプラインを開始します。

ユーザーから渡されたテーマ: $ARGUMENTS

## パイプライン手順

以下のフローで進行する。**各 ⏸ ポイントでは必ずユーザーに承認を求めること**。スキップしないこと。

---

### Phase 1: 企画立案

**Agent**: `blog-planner`

テーマを `blog-planner` に渡し、企画書を作成させる。

```
Agent({
  description: "Plan blog article",
  subagent_type: "blog-planner",
  prompt: "テーマ: $ARGUMENTS\n\n企画書を作成してください。CLAUDE.md のプロダクト事実とシリーズ構造を踏まえること。"
})
```

⏸ **ユーザー承認**: 企画書の表示後、「この方向で進めてよろしいですか？ 修正があれば指示してください」と確認。

---

### Phase 2: 構成設計

**Agent**: `blog-outliner`

承認された企画書を元に、章立てと事実主張リストを生成。

```
Agent({
  description: "Outline blog article",
  subagent_type: "blog-outliner",
  prompt: "企画書:\n<企画書本文>\n\n詳細構成と要検証主張リストを作成してください。"
})
```

構成書はそのまま次のフェーズへ。承認は不要（fact-checker の検証結果と合わせて確認する）。

---

### Phase 3: エビデンス検証

**Agent**: `blog-fact-checker`

構成書の `[要検証]` 主張を全件、一次資料で検証。

```
Agent({
  description: "Fact-check article claims",
  subagent_type: "blog-fact-checker",
  prompt: "構成書の要検証主張リスト:\n<主張リスト>\n\nすべての主張について、e-Gov / 国交省 / 警察庁 / 全ト協公式の一次資料で検証してください。"
})
```

⏸ **ユーザー承認**: 検証レポート（[VERIFIED] / [DISPUTED] / [NOT FOUND] 一覧）を表示し、「この検証結果で記事を執筆します。修正方針があれば指示してください」と確認。

特に過去の誤解パターン（数値必須・所見必須・休業理由メモなど）に該当する DISPUTED があれば、目立つように強調表示すること。

---

### Phase 4: プロダクト整合性チェック

**Agent**: `consistency-guard`

承認された構成 + 検証結果を delilog の機能・既存記事と照合。

```
Agent({
  description: "Check product consistency",
  subagent_type: "consistency-guard",
  prompt: "構成書と検証結果:\n<内容>\n\ndelilog の機能・既存記事との整合性を確認してください。"
})
```

不整合があれば修正方針を確定してから次へ。重大な不整合がなければそのまま執筆フェーズへ。

---

### Phase 5: 執筆

**Agent**: `blog-writer`

すべての検証・整合チェックが完了した状態で、記事ドラフトを作成。

```
Agent({
  description: "Write blog article",
  subagent_type: "blog-writer",
  prompt: "構成書、エビデンス検証レポート、整合性レポートを使って記事を執筆してください。\n<3つのレポート全文>"
})
```

`content/blog/<slug>.md` が作成される。既存記事の相互リンクも更新される。

---

### Phase 6: レビュー＆画像プロンプト生成

**Agent**: `blog-reviewer` と `blog-image-prompter` を**並行実行**

```
[同一メッセージで2つのAgentコールを並行]

Agent({
  description: "Review final article",
  subagent_type: "blog-reviewer",
  prompt: "content/blog/<slug>.md をレビューし、誤字・事実・整合性・SEO・ビルドを検証してください。"
})

Agent({
  description: "Generate image prompts",
  subagent_type: "blog-image-prompter",
  prompt: "content/blog/<slug>.md の画像プレースホルダ位置を確認し、各画像のプロンプトを生成してください。"
})
```

レビューで重大な問題があれば修正してから次へ。

---

### Phase 7: 画像生成（ユーザー作業）

⏸ **ユーザー作業**:

1. OG画像: Canva で既存テンプレート複製＋テキスト差し替え → ダウンロード
2. 記事内画像3〜4枚: ChatGPT Image でプロンプト実行 → ダウンロード
3. ダウンロードしたファイル名を Claude に伝える

伝達例: 「`/Users/narajunichi/Downloads/<file>.png` に置いた」

---

### Phase 8: 画像配置

ユーザーから配置指示を受けたら、Bash で `cp` または `mv` を使って:

1. `public/blog/<slug>/` に画像を所定のファイル名で配置
2. ファイル名: `og.png`, `structure.png`, その他は記事内のプレースホルダに合わせる
3. `npm run build` で最終ビルド確認

---

### Phase 9: コミット＆プッシュ

⏸ **ユーザー承認**: 「コミットしてプッシュしてよろしいですか？」と確認。

承認後:

```bash
git add content/blog/<slug>.md content/blog/<既存記事の編集分>.md public/blog/<slug>/
git commit -m "feat: N本目のブログ記事「<記事タイトル抜粋>」を追加

- content/blog/<slug>.md を新規追加（約X,XXX字）
- OG画像とインフォグラフィック<N>点を同梱
- <既存記事>からのシリーズリンクを実リンク化
- <法令解釈や独自視点のハイライト>"

git push origin main
```

---

### Phase 10: 公開後の案内

コミット＆プッシュ後、ユーザーに次のアクションを案内:

1. **Vercel自動デプロイ**: 2〜3分で公開
2. **Search Console**: 新URLをインデックス登録リクエスト
3. **X投稿**: 案A（共感）/ 案B（誤解訂正）/ 案C（シンプル）から選んで投稿
4. **段階拡散**: 2〜3日後にスレッド、1週間後に短文Tips

---

## 全体ルール

- ⏸ ポイントは絶対にスキップしない
- 各エージェントの出力は次のエージェントの入力として正しく引き継ぐ
- エラー発生時は該当フェーズのエージェントにリトライ依頼か、ユーザーに状況報告
- 最終的に `content/blog/<slug>.md` + `public/blog/<slug>/*.png` + 既存記事の相互リンク更新がアトミックにコミットされる状態を目指す
