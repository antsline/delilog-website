# delilog Website

delilogアプリの公式ウェブサイト

## 概要

このサイトは、配送・運送業向けの業務記録管理アプリ「delilog」の公式ウェブサイトです。

## 構成

- **トップページ**: アプリの紹介とApp Storeへのリンク
- **プライバシーポリシー**: `/privacy-policy`
- **利用規約**: `/terms-of-service`

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **デプロイ**: Vercel
- **ドメイン**: delilog.app

## 開発

### 前提条件

- Node.js 18以上
- npm

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで http://localhost:3000 を開く

### ビルド

```bash
# 本番ビルド
npm run build

# 本番サーバーの起動
npm start
```

## デプロイ

Vercelに自動デプロイされます。

1. GitHubにプッシュ
2. Vercelが自動的にビルドとデプロイを実行
3. delilog.appで公開

## ライセンス

All rights reserved.

## お問い合わせ

support@delilog.app
