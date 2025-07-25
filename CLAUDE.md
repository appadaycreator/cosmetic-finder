# CLAUDE.md - コスメファインダー開発ガイド

## プロジェクト概要

コスメファインダーは、肌質診断と成分解析機能を備えた化粧品検索・推奨Webアプリケーションです。

## 主要機能

1. **肌質診断機能** - 10問の質問による詳細な肌質診断
2. **成分解析機能** - 72種類以上の成分データベースによる安全性評価
3. **製品検索・フィルタリング** - 100種類の製品から最適なものを検索
4. **診断結果に基づく製品推奨** - AIスコアリングによる最適な製品の提案
5. **多言語対応** - 日本語、英語、中国語、韓国語に対応
6. **PWA対応** - オフライン利用可能

## 技術スタック

- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **データ管理**: LocalStorage, JSON
- **PWA**: Service Worker, Web App Manifest
- **パフォーマンス**: デバウンス検索、ページネーション、キャッシュ最適化

## 開発時の注意事項

### コマンド実行時の注意

開発時は以下のコマンドが利用可能です：

```bash
# ローカルサーバー起動
python3 -m http.server 8080

# lintチェック（プロジェクトに応じて設定）
# npm run lint

# typeチェック（プロジェクトに応じて設定）
# npm run typecheck
```

### ファイル構成

```
├── lp.html                      # ランディングページ
├── products.html                # 製品一覧ページ（NEW）
├── assets/
│   ├── js/
│   │   ├── products.js         # 製品検索・フィルタリング機能（NEW）
│   │   └── diagnosis.js        # 拡張された診断機能（UPDATED）
│   └── data/
│       ├── products.json       # 100製品データ（EXPANDED）
│       └── ingredients.json    # 72成分データ（EXPANDED）
```

### 最新の変更点

1. **製品データの拡張**: 10製品から100製品へ拡張
2. **成分データベースの拡充**: 30成分から72成分へ拡張
3. **製品一覧ページの追加**: 検索、フィルタリング、ページネーション機能付き
4. **診断機能の強化**: 10問の詳細な質問と診断結果に基づく製品推奨
5. **パフォーマンス最適化**: デバウンス検索、キャッシュ機能の実装

### 診断結果による製品推奨アルゴリズム

```javascript
// スコアリング要素
- 肌タイプマッチング: +30点
- 敏感肌対応: +20点
- アレルゲン不使用: +10点
- 肌悩み対応成分: +10点/成分
- テクスチャー好み: +15点
- 製品評価: +評価×5点
```

### データフォーマット

#### 製品データ (products.json)
```json
{
  "id": 1,
  "name": "製品名",
  "brand": "ブランド名",
  "category": "カテゴリー",
  "price": 2500,
  "skinTypes": ["dry", "normal"],
  "description": "製品説明",
  "ingredients": ["成分1", "成分2"],
  "rating": 4.5,
  "reviews": 234
}
```

#### 成分データ (ingredients.json)
```json
{
  "成分名": {
    "safety": 5,
    "category": "カテゴリー",
    "description": "説明",
    "allergen": false,
    "functions": ["機能1", "機能2"]
  }
}
```

### テスト実行

```bash
# ブラウザでテストスイートを実行
http://localhost:8080/tests/test-suite.html

# UIテスト（Puppeteerが必要）
npm install puppeteer
node tests/ui-test.js
```

### デプロイ時の確認事項

1. Service Workerのキャッシュバージョンを更新
2. manifest.jsonの内容を確認
3. すべてのリンクが正しく機能することを確認
4. オフライン動作を確認

### GitHub Pages固有の対応

#### Service Worker 404エラーの解決

GitHub Pagesでは、リポジトリ名がサブディレクトリ（例：`/cosmetic-finder/`）として扱われるため、絶対パス（`/sw.js`）では404エラーが発生します。以下の対応を実施済み：

1. **Service Worker登録パスの修正**
   ```javascript
   // 修正前
   navigator.serviceWorker.register('/sw.js')
   
   // 修正後（相対パス）
   navigator.serviceWorker.register('./sw.js')
   ```

2. **manifest.jsonのパス修正**
   ```json
   {
     "start_url": "./",
     "scope": "./",
     "icons": [
       {"src": "./assets/icons/icon-192.png"},
       {"src": "./assets/icons/icon-512.png"}
     ],
     "serviceworker": {
       "src": "./sw.js",
       "scope": "./"
     }
   }
   ```

3. **Service Workerキャッシュパスの修正**
   ```javascript
   const urlsToCache = [
     './',          // '/' から './'' に変更
     './lp.html',   // '/lp.html' から './lp.html' に変更
     // その他のパスも同様に相対パスに修正
   ];
   ```

この修正により、GitHub Pagesのサブディレクトリ環境でもService Workerが正常に動作するようになります。

## キーボードナビゲーション機能（2025-01-25追加）

### 概要
診断画面でのキーボード操作による快適なユーザビリティを実現しました。

### 実装内容

1. **Enterキーでの次の質問への進行**
   ```javascript
   if (e.key === 'Enter') {
     const selectedOption = diagnosisContent.querySelector('.option.selected');
     if (selectedOption) {
       proceedToNext();
     } else {
       // 未選択の場合は最初のオプションを選択
       const firstOption = diagnosisContent.querySelector('.option');
       if (firstOption) {
         selectOption(firstOption);
       }
     }
   }
   ```

2. **矢印キーナビゲーション**
   ```javascript
   else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
     e.preventDefault();
     navigateOptions(e.key === 'ArrowDown' ? 1 : -1);
   }
   ```

3. **数字キーによる直接選択**
   ```javascript
   else if (e.key >= '1' && e.key <= '9') {
     const optionIndex = parseInt(e.key) - 1;
     const targetOption = options[optionIndex];
     if (targetOption) {
       selectOption(targetOption);
     }
   }
   ```

4. **アクセシビリティ対応**
   ```html
   <div class="option" data-value="${option.value}" tabindex="0" 
        role="button" aria-label="${option.label}">
     <span class="option-number">${index + 1}.</span> ${option.label}
   </div>
   ```

5. **視覚的なフィードバック**
   ```css
   .option:hover,
   .option:focus {
     border-color: var(--primary-color);
     box-shadow: 0 2px 8px rgba(255, 107, 107, 0.2);
   }
   ```

6. **操作ヒントの表示**
   - 画面下部にキーボード操作のガイドを表示
   - 数字キー、矢印キー、Enterキーの説明

## 診断結果画面の改善（2025-01-25追加）

### 概要
診断結果画面を大幅に改善し、ユーザーにとってより分かりやすく価値のある情報を提供できるようになりました。

### 実装内容

1. **回答内容の一覧表示**
   - 全10問の質問と選択した回答を明確に表示
   - 質問番号を円形バッジで視覚的に強調
   ```javascript
   const answerHistory = diagnosisQuestions.map(question => {
     const answer = answers[question.id];
     const selectedOption = question.options.find(opt => opt.value === answer);
     return {
       question: question.question,
       answer: selectedOption ? selectedOption.label : '未回答'
     };
   });
   ```

2. **推奨理由の具体的な説明**
   - 肌質、年齢、肌悩み、敏感度に基づいた詳細な理由を表示
   - なぜその製品がおすすめなのかを論理的に説明
   ```javascript
   function generateRecommendationReason(answers, result) {
     // 肌質、年齢、悩み、敏感度別の理由を生成
   }
   ```

3. **診断スコアの内訳表示**
   - 4つのカテゴリー（保湿必要度、皮脂コントロール、エイジングケア、低刺激性）でスコアを可視化
   - プログレスバーで直感的に理解できるデザイン
   ```javascript
   function generateScoreBreakdown(answers) {
     // 各カテゴリーのスコアを計算し、視覚的に表示
   }
   ```

4. **視覚的なデザイン改善**
   - グラデーション背景の肌タイプバッジ
   - セクション別の背景色分け
   - アイコンを使った視覚的強調
   - レスポンシブ対応の強化

5. **進行状況表示の適切な管理**
   - 診断中は「質問 4/10」のような進行状況を表示
   - 結果画面では進行状況表示を削除し、結果に集中できるUI

### 今後の拡張予定

1. **バックエンドAPI統合**: 製品データの動的取得
2. **ユーザーアカウント機能**: お気に入り・履歴の同期
3. **レビュー機能**: ユーザーレビューの投稿・閲覧
4. **音声読み上げ対応**: スクリーンリーダーとの完全互換
4. **AI画像診断**: 写真による肌質診断
5. **EC連携**: 製品購入リンクの追加

### トラブルシューティング

- **製品が表示されない**: ブラウザのキャッシュをクリアしてService Workerを更新
- **診断結果が反映されない**: LocalStorageの診断データを確認
- **スタイルが崩れる**: CSSファイルの読み込みとレスポンシブ設定を確認

### 開発者向けTips

1. 新しい成分を追加する場合は、`ingredients.json`に適切な安全性評価を設定
2. 製品カテゴリーを追加する場合は、フィルター選択肢も更新
3. 診断質問を追加する場合は、スコアリングアルゴリズムも調整
4. パフォーマンスが気になる場合は、製品表示数を調整（現在12件/ページ）

最終更新: 2025年7月25日