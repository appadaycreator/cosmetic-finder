/**
 * @fileoverview アプリケーション設定
 * AI開発フレンドリーな一元設定管理
 */

/**
 * アプリケーション設定オブジェクト
 * @type {Object}
 */
export const CONFIG = {
    // API設定
    API: {
        DEBOUNCE_DELAY: 300,
        MAX_RESULTS: 12,
        CACHE_DURATION: 300000, // 5分
        TIMEOUT: 10000 // 10秒
    },

    // ストレージ設定
    STORAGE: {
        PREFIX: 'cosmefinder_',
        MAX_HISTORY: 10,
        MAX_ANALYSIS_HISTORY: 20,
        ENCRYPTION_ENABLED: true,
        COMPRESSION_ENABLED: false
    },

    // UI設定
    UI: {
        ANIMATION_DURATION: 300,
        MOBILE_BREAKPOINT: 768,
        SIDEBAR_WIDTH: 256,
        HEADER_HEIGHT: 64,
        NOTIFICATION_DURATION: 5000
    },

    // 診断設定
    DIAGNOSIS: {
        TOTAL_QUESTIONS: 10,
        MIN_CONFIDENCE: 0.6,
        SCORE_THRESHOLDS: {
            DRY: { min: 0, max: 0.3 },
            NORMAL: { min: 0.3, max: 0.7 },
            OILY: { min: 0.7, max: 1.0 }
        }
    },

    // 成分解析設定
    INGREDIENTS: {
        SAFETY_LEVELS: {
            VERY_SAFE: 5,
            SAFE: 4,
            MODERATE: 3,
            CAUTION: 2,
            AVOID: 1
        },
        MAX_INGREDIENTS: 50,
        SIMILARITY_THRESHOLD: 0.8
    },

    // 製品検索設定
    PRODUCTS: {
        ITEMS_PER_PAGE: 12,
        MAX_SEARCH_RESULTS: 100,
        SORT_OPTIONS: [
            'rating-desc',
            'rating-asc', 
            'price-asc',
            'price-desc',
            'reviews-desc'
        ]
    },

    // 国際化設定
    I18N: {
        DEFAULT_LANGUAGE: 'ja',
        SUPPORTED_LANGUAGES: ['ja', 'en'],
        FALLBACK_LANGUAGE: 'ja'
    },

    // PWA設定
    PWA: {
        CACHE_NAME: 'cosmetic-finder-v4',
        CACHE_URLS: [
            '/',
            '/assets/css/style.css',
            '/assets/js/main.js',
            '/assets/data/products.json',
            '/assets/data/ingredients.json'
        ],
        NOTIFICATION_OPTIONS: {
            icon: '/assets/icons/icon-192.png',
            badge: '/assets/icons/icon-192.png',
            vibrate: [200, 100, 200]
        }
    },

    // 開発設定
    DEVELOPMENT: {
        DEBUG_MODE: false,
        MOCK_DATA: false,
        LOG_LEVEL: 'info', // debug, info, warn, error
        PERFORMANCE_MONITORING: true
    },

    // エラー設定
    ERRORS: {
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000,
        TIMEOUT_MESSAGE: 'タイムアウトが発生しました',
        NETWORK_ERROR_MESSAGE: 'ネットワークエラーが発生しました'
    }
};

/**
 * 設定値を取得（ドット記法サポート）
 * @param {string} path - 設定パス（例: 'API.DEBOUNCE_DELAY'）
 * @param {*} defaultValue - デフォルト値
 * @returns {*} 設定値
 */
export function getConfig(path, defaultValue = undefined) {
    const keys = path.split('.');
    let value = CONFIG;
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return defaultValue;
        }
    }
    
    return value;
}

/**
 * 開発モードかどうかを判定
 * @returns {boolean} 開発モードの場合true
 */
export function isDevelopment() {
    return getConfig('DEVELOPMENT.DEBUG_MODE', false) || 
           (typeof window !== 'undefined' && window.location.hostname === 'localhost');
}

/**
 * ログレベルを取得
 * @returns {string} ログレベル
 */
export function getLogLevel() {
    return getConfig('DEVELOPMENT.LOG_LEVEL', 'info');
}

/**
 * 環境固有の設定を適用
 * @param {Object} envConfig - 環境設定
 */
export function applyEnvironmentConfig(envConfig) {
    if (typeof envConfig === 'object') {
        Object.assign(CONFIG, envConfig);
    }
}

// ブラウザ環境でのグローバル公開
if (typeof window !== 'undefined') {
    window.COSMEFINDER_CONFIG = CONFIG;
    window.getConfig = getConfig;
}