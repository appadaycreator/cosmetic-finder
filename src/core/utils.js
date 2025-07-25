/**
 * @fileoverview 汎用ユーティリティ関数
 * AI開発で理解しやすい純粋関数集
 */

/**
 * 結果オブジェクトを作成するヘルパー
 */
export const Result = {
    /**
     * 成功結果を作成
     * @param {*} data - データ
     * @returns {Result} 成功結果
     */
    success: (data) => ({ success: true, data }),
    
    /**
     * エラー結果を作成
     * @param {string} message - エラーメッセージ
     * @param {string} [code] - エラーコード
     * @returns {Result} エラー結果
     */
    error: (message, code = null) => ({ 
        success: false, 
        error: { message, code } 
    })
};

/**
 * デバウンス関数
 * @param {Function} func - 実行する関数
 * @param {number} wait - 待機時間（ミリ秒）
 * @returns {Function} デバウンスされた関数
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * スロットル関数
 * @param {Function} func - 実行する関数
 * @param {number} limit - 実行間隔（ミリ秒）
 * @returns {Function} スロットルされた関数
 */
export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 深いオブジェクトのクローンを作成
 * @param {*} obj - クローンするオブジェクト
 * @returns {*} クローンされたオブジェクト
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}

/**
 * オブジェクトのマージ（深いマージ）
 * @param {Object} target - ターゲットオブジェクト
 * @param {...Object} sources - ソースオブジェクト
 * @returns {Object} マージされたオブジェクト
 */
export function deepMerge(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                deepMerge(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return deepMerge(target, ...sources);
}

/**
 * オブジェクトかどうかを判定
 * @param {*} item - 判定するアイテム
 * @returns {boolean} オブジェクトの場合true
 */
function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * 配列をページネーション
 * @param {Array} array - 配列
 * @param {number} page - ページ番号（1ベース）
 * @param {number} itemsPerPage - 1ページあたりのアイテム数
 * @returns {Object} ページネーション結果
 */
export function paginate(array, page, itemsPerPage) {
    const totalItems = array.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const items = array.slice(startIndex, endIndex);

    return {
        items,
        pagination: {
            currentPage: page,
            totalPages,
            itemsPerPage,
            totalItems,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
}

/**
 * 文字列をケバブケースに変換
 * @param {string} str - 変換する文字列
 * @returns {string} ケバブケースの文字列
 */
export function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}

/**
 * 文字列をキャメルケースに変換
 * @param {string} str - 変換する文字列
 * @returns {string} キャメルケースの文字列
 */
export function toCamelCase(str) {
    return str
        .toLowerCase()
        .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}

/**
 * ユニークIDを生成
 * @param {string} [prefix] - プレフィックス
 * @returns {string} ユニークID
 */
export function generateId(prefix = '') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/**
 * ランダムな配列要素を取得
 * @param {Array} array - 配列
 * @returns {*} ランダムな要素
 */
export function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * 配列をシャッフル
 * @param {Array} array - シャッフルする配列
 * @returns {Array} シャッフルされた配列
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * 日付をフォーマット
 * @param {Date|string} date - 日付
 * @param {string} [locale] - ロケール
 * @returns {string} フォーマットされた日付
 */
export function formatDate(date, locale = 'ja-JP') {
    return new Date(date).toLocaleDateString(locale);
}

/**
 * 数値を通貨形式でフォーマット
 * @param {number} amount - 金額
 * @param {string} [currency] - 通貨コード
 * @param {string} [locale] - ロケール
 * @returns {string} フォーマットされた金額
 */
export function formatCurrency(amount, currency = 'JPY', locale = 'ja-JP') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * 文字列をサニタイズ（XSS対策）
 * @param {string} str - サニタイズする文字列
 * @returns {string} サニタイズされた文字列
 */
export function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * URLパラメータを解析
 * @param {string} [url] - URL（省略時は現在のURL）
 * @returns {Object} パラメータオブジェクト
 */
export function parseURLParams(url = window.location.search) {
    const params = new URLSearchParams(url);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
}

/**
 * Promiseベースのsleep関数
 * @param {number} ms - 待機時間（ミリ秒）
 * @returns {Promise} Promise
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * エラーを安全にログ出力
 * @param {Error|string} error - エラー
 * @param {Object} [context] - コンテキスト情報
 */
export function logError(error, context = {}) {
    const errorInfo = {
        message: error.message || error,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        context
    };
    
    console.error('🚨 Error:', errorInfo);
    
    // 本番環境では外部ログサービスに送信することも可能
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'exception', {
            description: errorInfo.message,
            fatal: false
        });
    }
}

// ブラウザ環境でのグローバル公開
if (typeof window !== 'undefined') {
    window.CosmeFinderUtils = {
        Result,
        debounce,
        throttle,
        deepClone,
        deepMerge,
        paginate,
        toKebabCase,
        toCamelCase,
        generateId,
        getRandomElement,
        shuffleArray,
        formatDate,
        formatCurrency,
        sanitizeHTML,
        parseURLParams,
        sleep,
        logError
    };
}