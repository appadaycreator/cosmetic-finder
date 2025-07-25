/**
 * @fileoverview データ永続化管理
 * AI開発フレンドリーなストレージ抽象化
 */

import { CONFIG } from './config.js';
import { Result, logError } from './utils.js';

/**
 * ストレージサービスクラス
 * LocalStorageの操作を抽象化し、暗号化やエラーハンドリングを提供
 */
export class StorageService {
    constructor() {
        this.prefix = CONFIG.STORAGE.PREFIX;
        this.encryptionEnabled = CONFIG.STORAGE.ENCRYPTION_ENABLED;
    }

    /**
     * データを保存
     * @param {string} key - キー
     * @param {*} value - 値
     * @returns {Result} 結果
     */
    set(key, value) {
        try {
            const prefixedKey = this._getPrefixedKey(key);
            const serializedValue = this._serialize(value);
            const finalValue = this.encryptionEnabled 
                ? this._encrypt(serializedValue)
                : serializedValue;
            
            localStorage.setItem(prefixedKey, finalValue);
            return Result.success(true);
        } catch (error) {
            logError(error, { operation: 'storage.set', key });
            return Result.error('データの保存に失敗しました', 'STORAGE_SET_ERROR');
        }
    }

    /**
     * データを取得
     * @param {string} key - キー
     * @param {*} [defaultValue] - デフォルト値
     * @returns {Result} 結果
     */
    get(key, defaultValue = null) {
        try {
            const prefixedKey = this._getPrefixedKey(key);
            const storedValue = localStorage.getItem(prefixedKey);
            
            if (storedValue === null) {
                return Result.success(defaultValue);
            }

            const decryptedValue = this.encryptionEnabled
                ? this._decrypt(storedValue)
                : storedValue;
            
            const deserializedValue = this._deserialize(decryptedValue);
            return Result.success(deserializedValue);
        } catch (error) {
            logError(error, { operation: 'storage.get', key });
            return Result.success(defaultValue);
        }
    }

    /**
     * データを削除
     * @param {string} key - キー
     * @returns {Result} 結果
     */
    remove(key) {
        try {
            const prefixedKey = this._getPrefixedKey(key);
            localStorage.removeItem(prefixedKey);
            return Result.success(true);
        } catch (error) {
            logError(error, { operation: 'storage.remove', key });
            return Result.error('データの削除に失敗しました', 'STORAGE_REMOVE_ERROR');
        }
    }

    /**
     * すべてのアプリケーションデータをクリア
     * @returns {Result} 結果
     */
    clear() {
        try {
            const keys = Object.keys(localStorage);
            const appKeys = keys.filter(key => key.startsWith(this.prefix));
            
            appKeys.forEach(key => localStorage.removeItem(key));
            return Result.success(appKeys.length);
        } catch (error) {
            logError(error, { operation: 'storage.clear' });
            return Result.error('データのクリアに失敗しました', 'STORAGE_CLEAR_ERROR');
        }
    }

    /**
     * ストレージサイズを取得
     * @returns {number} サイズ（バイト）
     */
    getSize() {
        try {
            let total = 0;
            const keys = Object.keys(localStorage);
            const appKeys = keys.filter(key => key.startsWith(this.prefix));
            
            appKeys.forEach(key => {
                total += key.length + (localStorage.getItem(key) || '').length;
            });
            
            return total;
        } catch (error) {
            logError(error, { operation: 'storage.getSize' });
            return 0;
        }
    }

    /**
     * すべてのアプリケーションキーを取得
     * @returns {string[]} キー配列
     */
    getKeys() {
        try {
            const keys = Object.keys(localStorage);
            return keys
                .filter(key => key.startsWith(this.prefix))
                .map(key => key.replace(this.prefix, ''));
        } catch (error) {
            logError(error, { operation: 'storage.getKeys' });
            return [];
        }
    }

    /**
     * データをエクスポート
     * @returns {Result} エクスポートデータ
     */
    export() {
        try {
            const data = {};
            const keys = this.getKeys();
            
            keys.forEach(key => {
                const result = this.get(key);
                if (result.success) {
                    data[key] = result.data;
                }
            });

            return Result.success({
                version: '1.0',
                timestamp: new Date().toISOString(),
                data
            });
        } catch (error) {
            logError(error, { operation: 'storage.export' });
            return Result.error('データのエクスポートに失敗しました', 'STORAGE_EXPORT_ERROR');
        }
    }

    /**
     * データをインポート
     * @param {Object} exportData - エクスポートデータ
     * @returns {Result} 結果
     */
    import(exportData) {
        try {
            if (!exportData || !exportData.data) {
                return Result.error('無効なエクスポートデータです', 'INVALID_EXPORT_DATA');
            }

            let successCount = 0;
            let errorCount = 0;

            Object.entries(exportData.data).forEach(([key, value]) => {
                const result = this.set(key, value);
                if (result.success) {
                    successCount++;
                } else {
                    errorCount++;
                }
            });

            return Result.success({ successCount, errorCount });
        } catch (error) {
            logError(error, { operation: 'storage.import' });
            return Result.error('データのインポートに失敗しました', 'STORAGE_IMPORT_ERROR');
        }
    }

    /**
     * プレフィックス付きキーを取得
     * @private
     * @param {string} key - キー
     * @returns {string} プレフィックス付きキー
     */
    _getPrefixedKey(key) {
        return `${this.prefix}${key}`;
    }

    /**
     * データをシリアライズ
     * @private
     * @param {*} value - 値
     * @returns {string} シリアライズされた値
     */
    _serialize(value) {
        return JSON.stringify(value);
    }

    /**
     * データをデシリアライズ
     * @private
     * @param {string} value - シリアライズされた値
     * @returns {*} デシリアライズされた値
     */
    _deserialize(value) {
        return JSON.parse(value);
    }

    /**
     * データを暗号化（簡易実装）
     * @private
     * @param {string} data - データ
     * @returns {string} 暗号化されたデータ
     */
    _encrypt(data) {
        // 実際のプロダクションでは適切な暗号化ライブラリを使用
        return btoa(unescape(encodeURIComponent(data)));
    }

    /**
     * データを復号化（簡易実装）
     * @private
     * @param {string} encryptedData - 暗号化されたデータ
     * @returns {string} 復号化されたデータ
     */
    _decrypt(encryptedData) {
        // 実際のプロダクションでは適切な暗号化ライブラリを使用
        return decodeURIComponent(escape(atob(encryptedData)));
    }
}

/**
 * 履歴管理クラス
 * 診断履歴や解析履歴を管理
 */
export class HistoryManager {
    constructor(storageService, historyKey, maxItems = 10) {
        this.storage = storageService;
        this.historyKey = historyKey;
        this.maxItems = maxItems;
    }

    /**
     * 履歴を追加
     * @param {*} item - 追加するアイテム
     * @returns {Result} 結果
     */
    add(item) {
        try {
            const historyResult = this.storage.get(this.historyKey, []);
            if (!historyResult.success) {
                return historyResult;
            }

            const history = historyResult.data;
            const newItem = {
                ...item,
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date().toISOString()
            };

            history.unshift(newItem);
            
            // 最大件数を超えた場合は古いものを削除
            if (history.length > this.maxItems) {
                history.splice(this.maxItems);
            }

            return this.storage.set(this.historyKey, history);
        } catch (error) {
            logError(error, { operation: 'history.add', historyKey: this.historyKey });
            return Result.error('履歴の追加に失敗しました', 'HISTORY_ADD_ERROR');
        }
    }

    /**
     * 履歴を取得
     * @returns {Result} 履歴配列
     */
    get() {
        return this.storage.get(this.historyKey, []);
    }

    /**
     * 履歴アイテムを削除
     * @param {string} itemId - アイテムID
     * @returns {Result} 結果
     */
    remove(itemId) {
        try {
            const historyResult = this.get();
            if (!historyResult.success) {
                return historyResult;
            }

            const history = historyResult.data;
            const filteredHistory = history.filter(item => item.id !== itemId);
            
            return this.storage.set(this.historyKey, filteredHistory);
        } catch (error) {
            logError(error, { operation: 'history.remove', itemId });
            return Result.error('履歴の削除に失敗しました', 'HISTORY_REMOVE_ERROR');
        }
    }

    /**
     * 履歴をクリア
     * @returns {Result} 結果
     */
    clear() {
        return this.storage.set(this.historyKey, []);
    }
}

// シングルトンインスタンス
export const storageService = new StorageService();
export const diagnosisHistory = new HistoryManager(storageService, 'diagnosis_history', CONFIG.STORAGE.MAX_HISTORY);
export const analysisHistory = new HistoryManager(storageService, 'analysis_history', CONFIG.STORAGE.MAX_ANALYSIS_HISTORY);

// ブラウザ環境でのグローバル公開
if (typeof window !== 'undefined') {
    window.CosmeFinderStorage = {
        StorageService,
        HistoryManager,
        storageService,
        diagnosisHistory,
        analysisHistory
    };
}