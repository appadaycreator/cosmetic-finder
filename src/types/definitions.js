/**
 * @fileoverview AI開発フレンドリーな型定義
 * 全システムで使用される型を一箇所で管理
 */

/**
 * @typedef {Object} Result
 * @property {boolean} success - 操作の成功/失敗
 * @property {*} [data] - 成功時のデータ
 * @property {Error} [error] - 失敗時のエラー情報
 */

/**
 * @typedef {Object} Error
 * @property {string} message - エラーメッセージ
 * @property {string} [code] - エラーコード
 * @property {*} [details] - 詳細情報
 */

/**
 * @typedef {Object} DiagnosisQuestion
 * @property {string} id - 質問ID
 * @property {string} question - 質問文
 * @property {QuestionOption[]} options - 選択肢
 */

/**
 * @typedef {Object} QuestionOption
 * @property {string} value - 選択肢の値
 * @property {string} label - 表示テキスト
 * @property {number} [score] - スコア値
 */

/**
 * @typedef {Object} DiagnosisAnswers
 * @property {string} skinType - 肌タイプ
 * @property {string} ageRange - 年齢層
 * @property {string} skinConcerns - 肌の悩み
 * @property {string} sensitivity - 敏感度
 * @property {string} environment - 生活環境
 * @property {string} routineTime - スキンケア時間
 * @property {string} budget - 予算
 * @property {string} ingredientPreference - 成分へのこだわり
 * @property {string} texturePreference - テクスチャー好み
 * @property {string} fragrance - 香りの好み
 */

/**
 * @typedef {Object} DiagnosisResult
 * @property {string} skinType - 診断された肌タイプ
 * @property {number} confidence - 信頼度 (0-1)
 * @property {string[]} recommendations - 推奨事項
 * @property {DiagnosisScores} scores - 各カテゴリーのスコア
 * @property {string} description - 結果の説明
 * @property {Product[]} suggestedProducts - 推奨製品
 */

/**
 * @typedef {Object} DiagnosisScores
 * @property {number} moistureScore - 保湿スコア
 * @property {number} oilScore - 皮脂スコア
 * @property {number} sensitivityScore - 敏感度スコア
 * @property {number} ageScore - 年齢関連スコア
 */

/**
 * @typedef {Object} Product
 * @property {string} id - 製品ID
 * @property {string} name - 製品名
 * @property {string} brand - ブランド名
 * @property {string} category - カテゴリー
 * @property {number} price - 価格
 * @property {string[]} skinTypes - 適合肌タイプ
 * @property {Ingredient[]} ingredients - 成分リスト
 * @property {number} rating - 評価 (1-5)
 * @property {number} reviewCount - レビュー数
 * @property {string} description - 製品説明
 * @property {string} [imageUrl] - 画像URL
 */

/**
 * @typedef {Object} Ingredient
 * @property {string} name - 成分名
 * @property {number} safety - 安全性 (1-5)
 * @property {string} category - カテゴリー
 * @property {string} description - 説明
 * @property {boolean} allergen - アレルゲンフラグ
 * @property {string[]} functions - 機能リスト
 */

/**
 * @typedef {Object} AnalysisResult
 * @property {Ingredient[]} ingredients - 解析された成分
 * @property {number} overallSafety - 総合安全性
 * @property {number} allergenCount - アレルゲン数
 * @property {string[]} warnings - 警告メッセージ
 * @property {string[]} recommendations - 推奨事項
 */

/**
 * @typedef {Object} UserPreferences
 * @property {string} language - 言語設定
 * @property {number} fontSize - フォントサイズ
 * @property {boolean} highContrast - 高コントラストモード
 * @property {boolean} notifications - 通知設定
 * @property {boolean} encryption - 暗号化設定
 */

/**
 * @typedef {Object} AppState
 * @property {string} currentPage - 現在のページ
 * @property {DiagnosisResult} [lastDiagnosis] - 最後の診断結果
 * @property {UserPreferences} preferences - ユーザー設定
 * @property {boolean} initialized - 初期化状態
 * @property {boolean} loading - ローディング状態
 */

/**
 * @typedef {Object} SearchFilters
 * @property {string} [category] - カテゴリーフィルター
 * @property {string} [skinType] - 肌タイプフィルター
 * @property {string} [priceRange] - 価格帯フィルター
 * @property {string} [sortBy] - ソート条件
 * @property {string} [query] - 検索クエリ
 */

/**
 * @typedef {Object} PaginationData
 * @property {number} currentPage - 現在のページ
 * @property {number} totalPages - 総ページ数
 * @property {number} itemsPerPage - 1ページあたりのアイテム数
 * @property {number} totalItems - 総アイテム数
 */

// Export for ES6 modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {};
}