# CLAUDE.md - コスメファインダー開発ガイド

## プロジェクト概要

コスメファインダーは、肌質診断と成分解析機能を備えた化粧品検索・推奨Webアプリケーションです。
**v4.0.0 - AI開発フレンドリー版**にて、AI開発に最適化されたアーキテクチャを実装しました。

## 主要機能

1. **肌質診断機能** - 10問の質問による詳細な肌質診断
2. **成分解析機能** - 72種類以上の成分データベースによる安全性評価
3. **製品検索・フィルタリング** - 100種類の製品から最適なものを検索
4. **診断結果に基づく製品推奨** - AIスコアリングによる最適な製品の提案
5. **多言語対応** - 日本語、英語、中国語、韓国語に対応
6. **PWA対応** - オフライン利用、プッシュ通知対応
7. **データ管理機能** - エクスポート/インポート、暗号化保存
8. **アクセシビリティ機能** - 高コントラストモード、文字サイズ調整

## 技術スタック

- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+), TailwindCSS
- **データ管理**: LocalStorage, JSON, Web Crypto API
- **PWA**: Service Worker, Web App Manifest, Web Push API
- **パフォーマンス**: デバウンス検索、ページネーション、キャッシュ最適化
- **アーキテクチャ**: AI開発フレンドリー設計、モジュール化、関数型プログラミング原則
- **型安全性**: JSDocによる型定義、Result型パターン
- **コード品質**: 小ファイル分割（200行以内）、単一責任原則、純粋関数

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
├── index.html                   # メインページ（SPA）
├── lp.html                      # ランディングページ
├── products.html                # 製品一覧ページ
├── settings.html                # 設定ページ（NEW）
├── sw.js                        # Service Worker（通知対応）
├── assets/
│   ├── js/
│   │   ├── products.js         # 製品検索・フィルタリング機能
│   │   ├── diagnosis.js        # 拡張された診断機能
│   │   └── settings.js         # 設定管理機能（NEW）
│   └── data/
│       ├── products.json       # 100製品データ
│       └── ingredients.json    # 72成分データ
```

### 最新の変更点（2025年1月25日）

1. **設定管理ページの追加**: 各種設定を一元管理
2. **データエクスポート/インポート機能**: JSON形式でのデータ保存・復元
3. **Web Push通知**: Service Workerを使用したプッシュ通知
4. **データ暗号化**: Web Crypto APIでローカルデータを保護
5. **高コントラストモード**: 視覚障害者向けのアクセシビリティ機能
6. **文字サイズ調整**: 3段階（小・中・大）のフォントサイズ設定

#### 既存機能の改善

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

## 化粧品リストページ（2025-01-26追加）

### 概要
実在する日本の化粧品100製品を一覧表示する専用ページを実装しました。

### アクセス方法
- SPAのサイドバーから「💄 化粧品リスト」をクリック
- 直接URL: `/products.html`

### デザイン改善
- TailwindCSSを使用したモダンなUI
- ピンクのグラデーションヘッダー
- レスポンシブ対応のグリッドレイアウト
- 検索・フィルター機能の視覚的改善

### 技術的な変更
```html
<!-- サイドバーへのリンク追加 -->
<a href="products.html" class="block w-full text-left px-4 py-2 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-colors" data-ja="💄 化粧品リスト" data-en="💄 Product List">💄 化粧品リスト</a>
```

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

### 新機能の実装詳細（2025年1月25日追加）

#### データエクスポート/インポート
```javascript
// エクスポート形式
{
  "version": "1.0",
  "exportDate": "2025-01-25T10:00:00.000Z",
  "diagnosisHistory": [...],
  "favorites": [...],
  "settings": {...},
  "userData": {...}
}
```

#### データ暗号化
- Web Crypto API使用
- AES-GCM 256bit暗号化
- 暗号化キーはLocalStorageに保存
- 既存データの自動マイグレーション対応

#### プッシュ通知
- Service Workerでの実装
- 通知権限の適切な管理
- オフライン時のキューイング

#### アクセシビリティ
- WCAG 2.1 AA準拠を目指した実装
- キーボードナビゲーション完全対応
- スクリーンリーダー対応（ARIA属性）

### セキュリティ考慮事項

1. **XSS対策**: 全ユーザー入力のサニタイズ
2. **データ暗号化**: センシティブ情報の暗号化保存
3. **HTTPS必須**: プッシュ通知等の機能はHTTPS環境でのみ動作

### パフォーマンス最適化

1. **遅延読み込み**: 必要なリソースのみを読み込み
2. **キャッシュ戦略**: Service Workerによる適切なキャッシュ
3. **デバウンス処理**: 検索・フィルタリング時の過剰なリクエスト防止

## 最近の更新履歴

### v4.1.1 (2025-01-26) - ページネーション表示改善版
- **ページネーション表示の改善**
  - 製品一覧ページに現在ページ/総ページ数表示を追加（例: 4/5ページ）
  - 検索結果表示エリアにページ情報をリアルタイム表示
  - 1ページのみの場合は非表示にして表示を最適化
  - ページ遷移時の自動更新機能実装
- **ユーザビリティ向上**
  - レスポンシブ対応でモバイル環境での視認性向上
  - HTMLに`pageInfo`要素追加、JavaScript連携強化
  - DOM要素の適切な初期化と管理

### v4.1.0 (2025-01-26) - Service Worker最適化版
- **Service Workerキャッシュエラー完全修正**
  - chrome-extension URLなど無効スキームのキャッシュ回避実装
  - 同一オリジンリクエスト限定によるセキュリティ強化
  - エラーハンドリング強化（catch句追加）
  - キャッシュバージョンをv4に統一更新
- **PWA安定性向上**
  - コンソールエラー完全解消
  - ネットワークエラー時の適切なレスポンス実装
  - GitHub Pages環境での動作確認完了
- **コードクリーンアップ**
  - 不要なテストファイルをgitignoreに追加
  - ドキュメント更新（README.md, SPEC.md, function.html）

### v4.0.0 (2025-01-26) - AI開発フレンドリー版
- 全面的なコードリファクタリング完了
- src/ディレクトリによるモジュール構造の実装
- 小さなファイル単位（200行以内）への分割
- JSDocによる型定義の統一
- 結果オブジェクトパターンの導入
- 設定の外部化とエラーハンドリング統一
- 退行テスト完了、全機能正常動作確認済み

### Service Worker最適化の詳細（v4.1.0追加内容）

#### 問題の特定と解決
報告されたコンソールエラー:
```
sw.js:48 Uncaught (in promise) TypeError: Failed to execute 'put' on 'Cache': Request scheme 'chrome-extension' is unsupported
```

#### 実装した修正内容

1. **無効スキームのフィルタリング**
```javascript
self.addEventListener('fetch', event => {
  // Skip non-http/https requests (chrome-extension, etc.)
  if (!event.request.url.startsWith('http')) {
    return;
  }
  // ... 後続処理
});
```

2. **同一オリジン限定キャッシュ**
```javascript
// Only cache requests from the same origin
const requestUrl = new URL(event.request.url);
const currentUrl = new URL(self.location.origin);

if (requestUrl.origin === currentUrl.origin) {
  const responseToCache = response.clone();
  caches.open(CACHE_NAME)
    .then(cache => {
      cache.put(event.request, responseToCache);
    })
    .catch(err => {
      console.warn('Cache put failed:', err);
    });
}
```

3. **エラーハンドリング強化**
```javascript
.catch(err => {
  console.warn('Fetch failed:', err);
  return new Response('Network error', {
    status: 408,
    headers: { 'Content-Type': 'text/plain' }
  });
});
```

#### 検証結果
- ✅ ローカル環境での動作テスト完了
- ✅ GitHub Pages環境での動作確認完了  
- ✅ コンソールエラー完全解消
- ✅ PWA機能正常動作確認

### ページネーション表示改善の詳細（v4.1.1追加内容）

#### 実装した改善点

1. **HTMLテンプレートの修正**
```html
<div class="results-summary text-sm text-gray-600">
    <span id="resultsCount">0</span>件の製品
    <span id="pageInfo" class="ml-4"></span>
</div>
```

2. **JavaScript機能の追加**
```javascript
// DOM要素にpageInfo追加
const elements = {
    // ... 既存要素
    pageInfo: null,
    // ...
};

// ページ情報更新ロジック
const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
if (totalPages > 1 && elements.pageInfo) {
    elements.pageInfo.textContent = `(${currentPage}/${totalPages}ページ)`;
} else if (elements.pageInfo) {
    elements.pageInfo.textContent = '';
}
```

3. **表示条件の最適化**
- 総ページ数が1ページの場合：ページ情報を非表示
- 複数ページの場合：「(現在ページ/総ページ数ページ)」形式で表示
- ページ遷移時のリアルタイム更新

#### 技術的な特徴
- **レスポンシブ対応**: TailwindCSSの`ml-4`クラスでスペーシング調整
- **動的更新**: ページ遷移、フィルタリング、検索時に自動更新
- **DOM管理**: 適切な要素参照と初期化処理

#### 検証結果
- ✅ HTML要素の追加完了
- ✅ JavaScript機能実装完了
- ✅ ページ遷移時の動的更新確認
- ✅ レスポンシブ表示対応確認

### 診断結果画面進行状況表示修正（v4.1.1追加内容）

#### 修正した問題
診断結果画面で進行状況バー（4/5など）が表示されたままになっていた問題を修正しました。

#### 実装した修正内容

1. **index.html の displayResult 関数**
```javascript
function displayResult(result) {
    // 進行状況表示を非表示にする
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    if (progressBar && progressBar.parentElement && progressBar.parentElement.parentElement) {
        progressBar.parentElement.parentElement.style.display = 'none';
    }
    // ... 結果表示処理
}
```

2. **assets/js/diagnosis.js の showResults 関数**
```javascript
function showResults() {
    // 進行状況表示を非表示にする
    const progressContainer = document.querySelector('.progress-container, .mb-8:has(.progress-bar)');
    if (progressContainer) {
        progressContainer.style.display = 'none';
    }
    // ... 結果表示処理
}
```

3. **診断再開時の進行状況復元**
```javascript
function restartDiagnosis() {
    // 進行状況表示を再表示
    const progressContainer = document.querySelector('.progress-container, .mb-8:has(.progress-bar)');
    if (progressContainer) {
        progressContainer.style.display = 'block';
    }
    // ... 診断リスタート処理
}
```

#### 修正結果
- ✅ 診断結果画面での進行状況バー非表示
- ✅ 「もう一度診断」時の進行状況表示復元
- ✅ クリーンな結果画面UI実現
- ✅ 診断フロー状態管理の改善

最終更新: 2025年1月26日