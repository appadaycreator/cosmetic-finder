# Cosmetic Finder (コスメファインダー)

肌質診断と成分解析であなたに最適な化粧品を見つけるPWA（Progressive Web App）です。

## 概要

コスメファインダーは、ユーザーの肌質を診断し、化粧品の成分を解析することで、安全で効果的な製品選びをサポートするWebアプリケーションです。

## 主な機能

- **肌質診断**: 簡単な質問に答えるだけで、あなたの肌タイプを診断
- **成分解析**: 化粧品の成分リストを入力すると、各成分の安全性と効果を詳しく解析
- **製品レコメンド**: 診断結果に基づいて最適な製品を提案
- **多言語対応**: 日本語、英語、中国語、韓国語に対応
- **PWA対応**: オフラインでも利用可能、ホーム画面への追加が可能

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
├── how-to-use.html              # 使い方ページ
├── terms.html                   # 利用規約・免責事項
├── privacy.html                 # プライバシーポリシー
├── contact.html                 # 問い合わせフォーム
├── function.html                # 機能要件書
├── manifest.json                # PWA設定
├── sw.js                        # Service Worker
├── assets/
│   ├── css/
│   │   └── style.css           # メインスタイルシート
│   ├── js/
│   │   ├── main.js             # メイン機能
│   │   ├── diagnosis.js        # 診断ロジック
│   │   ├── ingredients.js      # 成分解析
│   │   └── i18n.js            # 多言語対応
│   ├── data/
│   │   ├── products.json       # 商品データ
│   │   └── ingredients.json    # 成分データ
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