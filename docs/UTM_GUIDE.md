# UTM パラメータ運用ガイド

ブログ・SNS・メールなどで記事URLをシェアする際は、UTMパラメータを付けて**流入元を計測**する。Vercel AnalyticsやGoogle Analyticsがこの値を読み取り、流入チャネル別のパフォーマンスが見えるようになる。

## 基本のパラメータ

| パラメータ | 意味 | 例 |
|-----------|------|-----|
| `utm_source` | どこから来たか | `x`, `line`, `newsletter`, `google` |
| `utm_medium` | どんな媒体か | `social`, `email`, `referral` |
| `utm_campaign` | どのキャンペーンか（任意） | `blog_launch`, `winter_2026` |

## 投稿先別テンプレート

### X（Twitter）で投稿する時

```
https://delilog.app/blog/keikamotsu-anzentaisaku-2025?utm_source=x&utm_medium=social
```

- `?v=1` でキャッシュバスター済みのURLを使う場合はこう合体させる:
  ```
  https://delilog.app/blog/keikamotsu-anzentaisaku-2025?v=1&utm_source=x&utm_medium=social
  ```

### LINE（オープンチャット・公式アカウント）

```
https://delilog.app/blog/keikamotsu-anzentaisaku-2025?utm_source=line&utm_medium=social
```

### メールマガジン（将来）

```
https://delilog.app/blog/keikamotsu-anzentaisaku-2025?utm_source=newsletter&utm_medium=email&utm_campaign=YYYYMM
```

### 他サイトからのリンク依頼・パートナー紹介

```
https://delilog.app/blog/keikamotsu-anzentaisaku-2025?utm_source=<パートナー名>&utm_medium=referral
```

## ルール

1. **すべて小文字**で書く（`X` と `x` は別物として集計される）
2. `utm_source` と `utm_medium` の2つは必ずつける。`utm_campaign` は任意
3. 同じチャネルでも投稿が異なる場合は `utm_content` で区別（例: スレッド投稿なら `utm_content=thread`、短文なら `utm_content=short`）
4. 迷ったら一般的な組み合わせを使う:
   - SNS → `medium=social`
   - メール → `medium=email`
   - 他サイトからのリンク → `medium=referral`
   - 広告（将来使うなら） → `medium=cpc`

## canonical URL との関係

記事ページには `<link rel="canonical">` で UTMなしのクリーンURLを指定している。**Googleの検索順位にはUTM付与は影響しない**ので安心して使ってよい。

## ツール

URLを手でいじるのが面倒な場合、以下のツールでパラメータを組み立てられる:

- [Google Campaign URL Builder](https://ga-dev-tools.google/campaign-url-builder/)
- ブラウザのブックマークレット化も可能（必要なら相談）

## サイトからストアへのリンクの印（参考）

ここまでは「サイトに来る」リンクの UTM。サイトから App Store / Google Play へ出ていくリンクには、別の印が自動で付く（記事を書く人が付ける必要はない）。正は `CLAUDE.md` の「ストアリンクの入口の印」と `content/blog-short-ids.json`。

| 行き先 | 印 | 例（点呼記録簿テンプレの DL ボックス） |
|---|---|---|
| App Store | `ct=b_<短いID>_<配置>` | `ct=b_tenko-tpl_dlbox` |
| Google Play | `referrer` に `utm_source=b_<短いID>&utm_medium=blog&utm_content=<配置>` | `utm_source=b_tenko-tpl&utm_content=dlbox` |
| QR（`/download?from=blog_<短いID>`） | `ct` と `utm_source` に同じ `blog_<短いID>`、`utm_medium=qr` | `ct=blog_tenko-tpl` |

2026-11-15 より前の印は `ct=blog_<slug>`（記事）・`ct=qr_<from>`（QR）。
