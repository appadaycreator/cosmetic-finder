# Cosmetic Finder (コスメファインダー)

肌質診断と成分解析であなたに最適な化粧品を見つけるPWA（Progressive Web App）です。

## 概要

コスメファインダーは、ユーザーの肌質を診断し、化粧品の成分を解析することで、安全で効果的な製品選びをサポートするWebアプリケーションです。

## 主な機能

- **肌質診断**: 10項目の詳細な質問による精密な肌タイプ診断（肌質、年齢、悩み、予算、好みなど）
- **成分解析**: 72種類の成分データベースによる詳細な安全性評価とアレルギー警告
- **製品データベース**: 100種類の化粧品から最適な製品を検索・フィルタリング
- **高度な検索機能**: テキスト検索、カテゴリー・肌タイプ・価格帯でのフィルタリング、並び替え
- **診断連携レコメンド**: AIスコアリングによる個別最適化された製品推奨
- **多言語対応**: 日本語、英語、中国語、韓国語に対応
- **PWA対応**: オフラインでも利用可能、ホーム画面への追加が可能
- **パフォーマンス最適化**: 検索デバウンス、ページネーション、キャッシュ機能

## 技術スタック

- HTML5
- CSS3 (レスポンシブデザイン)
- JavaScript (ES6+)
- Service Worker (オフライン対応)
- LocalStorage (データ永続化)

## セットアップ

1. リポジトリをクローン
```bash
git clone https://github.com/yourusername/cosmetic-finder.git
cd cosmetic-finder
```

2. ローカルサーバーを起動
```bash
# Python 3の場合
python3 -m http.server 8080

# Node.jsの場合
npx http-server -p 8080
```

3. ブラウザでアクセス
```
http://localhost:8080/lp.html
```

## ファイル構成

```
├── lp.html                      # ランディングページ
├── products.html                # 製品一覧ページ（新規）
├── how-to-use.html              # 使い方ページ
├── terms.html                   # 利用規約・免責事項
├── privacy.html                 # プライバシーポリシー
├── contact.html                 # 問い合わせフォーム
├── function.html                # 機能要件書
├── manifest.json                # PWA設定
├── sw.js                        # Service Worker
├── CLAUDE.md                    # 開発ガイド（新規）
├── assets/
│   ├── css/
│   │   └── style.css           # メインスタイルシート
│   ├── js/
│   │   ├── main.js             # メイン機能
│   │   ├── diagnosis.js        # 診断ロジック（拡張版）
│   │   ├── ingredients.js      # 成分解析
│   │   ├── products.js         # 製品一覧機能（新規）
│   │   └── i18n.js            # 多言語対応
│   ├── data/
│   │   ├── products.json       # 商品データ（100製品）
│   │   └── ingredients.json    # 成分データ（72成分）
│   └── icons/
│       ├── icon-192.png        # PWAアイコン
│       └── icon-512.png        # PWAアイコン
```

## 開発

### テスト実行

1. 機能テスト
```bash
# ブラウザでtest-suite.htmlを開く
http://localhost:8080/tests/test-suite.html
```

2. UIテスト (Puppeteerが必要)
```bash
npm install puppeteer
node tests/ui-test.js
```

## ライセンス

MIT License

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを作成して変更内容について議論してください。

## 作者

Cosmetic Finder Team