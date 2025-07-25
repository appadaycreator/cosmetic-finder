// 設定管理クラス
class SettingsManager {
    constructor() {
        this.cryptoKey = null;
        this.isEncryptionEnabled = false;
        this.initializeSettings();
        this.attachEventListeners();
    }

    // 初期化
    initializeSettings() {
        // 保存された設定を読み込む
        this.loadSettings();
        
        // 暗号化キーの初期化
        this.initializeCrypto();
    }

    // 設定の読み込み
    loadSettings() {
        const settings = localStorage.getItem('appSettings');
        if (settings) {
            const parsed = JSON.parse(settings);
            
            // 高コントラストモード
            if (parsed.highContrast) {
                document.body.classList.add('high-contrast');
                document.getElementById('highContrastToggle').classList.add('bg-pink-500');
                document.getElementById('highContrastToggle').querySelector('span').classList.add('translate-x-6');
                document.getElementById('highContrastToggle').querySelector('span').classList.remove('translate-x-1');
            }
            
            // 文字サイズ
            if (parsed.fontSize) {
                this.applyFontSize(parsed.fontSize);
            }
            
            // 通知設定
            if (parsed.notifications) {
                this.updateNotificationToggle(true);
            }
            
            // 暗号化設定
            if (parsed.encryption) {
                this.isEncryptionEnabled = true;
                this.updateEncryptionToggle(true);
            }
        }
    }

    // 設定の保存
    saveSettings() {
        const settings = {
            highContrast: document.body.classList.contains('high-contrast'),
            fontSize: this.getCurrentFontSize(),
            notifications: this.isNotificationEnabled(),
            encryption: this.isEncryptionEnabled
        };
        localStorage.setItem('appSettings', JSON.stringify(settings));
    }

    // イベントリスナーの設定
    attachEventListeners() {
        // データエクスポート
        document.getElementById('exportDataBtn').addEventListener('click', () => this.exportData());
        
        // データインポート
        document.getElementById('importDataBtn').addEventListener('click', () => {
            document.getElementById('importFileInput').click();
        });
        document.getElementById('importFileInput').addEventListener('change', (e) => this.importData(e));
        
        // 通知設定
        document.getElementById('notificationToggle').addEventListener('click', () => this.toggleNotifications());
        document.getElementById('testNotificationBtn').addEventListener('click', () => this.sendTestNotification());
        document.getElementById('allowNotificationBtn').addEventListener('click', () => this.requestNotificationPermission());
        document.getElementById('cancelNotificationBtn').addEventListener('click', () => this.closeNotificationModal());
        
        // 高コントラストモード
        document.getElementById('highContrastToggle').addEventListener('click', () => this.toggleHighContrast());
        
        // 文字サイズ設定
        document.querySelectorAll('.font-size-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeFontSize(e.target.closest('button').dataset.size));
        });
        
        // 暗号化設定
        document.getElementById('encryptionToggle').addEventListener('click', () => this.toggleEncryption());
    }

    // データエクスポート機能
    async exportData() {
        try {
            const data = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                diagnosisHistory: JSON.parse(localStorage.getItem('diagnosisHistory') || '[]'),
                favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
                settings: JSON.parse(localStorage.getItem('appSettings') || '{}'),
                userData: JSON.parse(localStorage.getItem('userData') || '{}')
            };

            // 暗号化が有効な場合は復号化
            if (this.isEncryptionEnabled && this.cryptoKey) {
                for (const key in data) {
                    if (key !== 'version' && key !== 'exportDate' && data[key]) {
                        try {
                            const decrypted = await this.decryptData(data[key]);
                            data[key] = decrypted;
                        } catch (e) {
                            console.log(`Skipping decryption for ${key}`);
                        }
                    }
                }
            }

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cosmefinder_data_${new Date().getTime()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            this.showMessage('データのエクスポートが完了しました', 'success');
        } catch (error) {
            console.error('Export error:', error);
            this.showMessage('エクスポートに失敗しました', 'error');
        }
    }

    // データインポート機能
    async importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            // バージョンチェック
            if (!data.version) {
                throw new Error('Invalid data format');
            }
            
            // データの復元
            if (data.diagnosisHistory) {
                const toStore = this.isEncryptionEnabled ? await this.encryptData(data.diagnosisHistory) : data.diagnosisHistory;
                localStorage.setItem('diagnosisHistory', JSON.stringify(toStore));
            }
            if (data.favorites) {
                const toStore = this.isEncryptionEnabled ? await this.encryptData(data.favorites) : data.favorites;
                localStorage.setItem('favorites', JSON.stringify(toStore));
            }
            if (data.settings) {
                localStorage.setItem('appSettings', JSON.stringify(data.settings));
            }
            if (data.userData) {
                const toStore = this.isEncryptionEnabled ? await this.encryptData(data.userData) : data.userData;
                localStorage.setItem('userData', JSON.stringify(toStore));
            }
            
            this.showMessage('データのインポートが完了しました。ページを再読み込みします...', 'success');
            setTimeout(() => location.reload(), 2000);
        } catch (error) {
            console.error('Import error:', error);
            this.showMessage('インポートに失敗しました。ファイル形式を確認してください', 'error');
        }
        
        // ファイル入力をリセット
        event.target.value = '';
    }

    // 通知設定
    toggleNotifications() {
        const toggle = document.getElementById('notificationToggle');
        const isEnabled = !toggle.classList.contains('bg-pink-500');
        
        if (isEnabled) {
            // 通知権限の確認
            if ('Notification' in window) {
                if (Notification.permission === 'granted') {
                    this.updateNotificationToggle(true);
                    this.registerServiceWorker();
                } else if (Notification.permission !== 'denied') {
                    document.getElementById('notificationModal').classList.remove('hidden');
                } else {
                    this.showMessage('通知がブラウザでブロックされています。ブラウザの設定から許可してください', 'error');
                }
            } else {
                this.showMessage('このブラウザは通知をサポートしていません', 'error');
            }
        } else {
            this.updateNotificationToggle(false);
        }
        
        this.saveSettings();
    }

    // 通知トグルの更新
    updateNotificationToggle(enabled) {
        const toggle = document.getElementById('notificationToggle');
        const span = toggle.querySelector('span');
        
        if (enabled) {
            toggle.classList.add('bg-pink-500');
            span.classList.add('translate-x-6');
            span.classList.remove('translate-x-1');
        } else {
            toggle.classList.remove('bg-pink-500');
            span.classList.remove('translate-x-6');
            span.classList.add('translate-x-1');
        }
    }

    // 通知権限のリクエスト
    async requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                this.updateNotificationToggle(true);
                this.registerServiceWorker();
                this.showMessage('通知が有効になりました', 'success');
            } else {
                this.showMessage('通知の許可が拒否されました', 'error');
            }
        } catch (error) {
            console.error('Notification permission error:', error);
            this.showMessage('通知の設定に失敗しました', 'error');
        }
        
        this.closeNotificationModal();
        this.saveSettings();
    }

    // 通知モーダルを閉じる
    closeNotificationModal() {
        document.getElementById('notificationModal').classList.add('hidden');
    }

    // Service Workerの登録
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered:', registration);
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    // テスト通知の送信
    async sendTestNotification() {
        if (!this.isNotificationEnabled()) {
            this.showMessage('通知を有効にしてください', 'error');
            return;
        }

        try {
            const notification = new Notification('CosmeFinder', {
                body: 'テスト通知です。通知が正しく動作しています！',
                icon: '/assets/icons/icon-192.png',
                badge: '/assets/icons/icon-192.png',
                vibrate: [200, 100, 200],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: 1
                }
            });

            notification.onclick = function() {
                window.focus();
                notification.close();
            };

            this.showMessage('テスト通知を送信しました', 'success');
        } catch (error) {
            console.error('Notification error:', error);
            this.showMessage('通知の送信に失敗しました', 'error');
        }
    }

    // 通知が有効か確認
    isNotificationEnabled() {
        const toggle = document.getElementById('notificationToggle');
        return toggle.classList.contains('bg-pink-500') && Notification.permission === 'granted';
    }

    // 高コントラストモード
    toggleHighContrast() {
        const toggle = document.getElementById('highContrastToggle');
        const span = toggle.querySelector('span');
        const isEnabled = !toggle.classList.contains('bg-pink-500');
        
        if (isEnabled) {
            document.body.classList.add('high-contrast');
            toggle.classList.add('bg-pink-500');
            span.classList.add('translate-x-6');
            span.classList.remove('translate-x-1');
        } else {
            document.body.classList.remove('high-contrast');
            toggle.classList.remove('bg-pink-500');
            span.classList.remove('translate-x-6');
            span.classList.add('translate-x-1');
        }
        
        this.saveSettings();
    }

    // 文字サイズ変更
    changeFontSize(size) {
        // 全てのボタンのアクティブ状態をリセット
        document.querySelectorAll('.font-size-btn').forEach(btn => {
            btn.classList.remove('bg-pink-100', 'border-pink-300');
        });
        
        // 選択されたボタンをアクティブに
        const activeBtn = document.querySelector(`[data-size="${size}"]`);
        activeBtn.classList.add('bg-pink-100', 'border-pink-300');
        
        // サイズを適用
        this.applyFontSize(size);
        this.saveSettings();
    }

    // 文字サイズの適用
    applyFontSize(size) {
        const sizes = {
            'small': '0.875rem',
            'medium': '1rem',
            'large': '1.125rem'
        };
        
        document.documentElement.style.setProperty('--base-font-size', sizes[size] || sizes.medium);
        document.body.style.fontSize = sizes[size] || sizes.medium;
        
        // ボタンの状態を更新
        document.querySelectorAll('.font-size-btn').forEach(btn => {
            if (btn.dataset.size === size) {
                btn.classList.add('bg-pink-100', 'border-pink-300');
            } else {
                btn.classList.remove('bg-pink-100', 'border-pink-300');
            }
        });
    }

    // 現在の文字サイズを取得
    getCurrentFontSize() {
        const activeBtn = document.querySelector('.font-size-btn.bg-pink-100');
        return activeBtn ? activeBtn.dataset.size : 'medium';
    }

    // 暗号化の初期化
    async initializeCrypto() {
        try {
            // 既存のキーを確認
            const storedKey = localStorage.getItem('encryptionKey');
            if (storedKey) {
                // Base64からArrayBufferに変換
                const keyData = Uint8Array.from(atob(storedKey), c => c.charCodeAt(0));
                this.cryptoKey = await crypto.subtle.importKey(
                    'raw',
                    keyData,
                    { name: 'AES-GCM', length: 256 },
                    true,
                    ['encrypt', 'decrypt']
                );
            } else {
                // 新しいキーを生成
                this.cryptoKey = await crypto.subtle.generateKey(
                    { name: 'AES-GCM', length: 256 },
                    true,
                    ['encrypt', 'decrypt']
                );
                
                // キーをエクスポートして保存
                const exportedKey = await crypto.subtle.exportKey('raw', this.cryptoKey);
                const keyString = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
                localStorage.setItem('encryptionKey', keyString);
            }
        } catch (error) {
            console.error('Crypto initialization error:', error);
            this.showMessage('暗号化の初期化に失敗しました', 'error');
        }
    }

    // 暗号化トグル
    async toggleEncryption() {
        const toggle = document.getElementById('encryptionToggle');
        const span = toggle.querySelector('span');
        const statusDiv = document.getElementById('encryptionStatus');
        const statusText = document.getElementById('encryptionStatusText');
        
        this.isEncryptionEnabled = !this.isEncryptionEnabled;
        
        if (this.isEncryptionEnabled) {
            toggle.classList.add('bg-pink-500');
            span.classList.add('translate-x-6');
            span.classList.remove('translate-x-1');
            statusDiv.classList.remove('hidden');
            statusText.textContent = '暗号化が有効です。新しいデータは暗号化されて保存されます。';
            
            // 既存データの暗号化
            await this.migrateDataEncryption(true);
        } else {
            toggle.classList.remove('bg-pink-500');
            span.classList.remove('translate-x-6');
            span.classList.add('translate-x-1');
            statusDiv.classList.remove('hidden');
            statusText.textContent = '暗号化が無効です。データは平文で保存されます。';
            
            // データの復号化
            await this.migrateDataEncryption(false);
        }
        
        this.saveSettings();
    }

    // 暗号化トグルの更新
    updateEncryptionToggle(enabled) {
        const toggle = document.getElementById('encryptionToggle');
        const span = toggle.querySelector('span');
        const statusDiv = document.getElementById('encryptionStatus');
        const statusText = document.getElementById('encryptionStatusText');
        
        if (enabled) {
            toggle.classList.add('bg-pink-500');
            span.classList.add('translate-x-6');
            span.classList.remove('translate-x-1');
            statusDiv.classList.remove('hidden');
            statusText.textContent = '暗号化が有効です。新しいデータは暗号化されて保存されます。';
        } else {
            toggle.classList.remove('bg-pink-500');
            span.classList.remove('translate-x-6');
            span.classList.add('translate-x-1');
            statusDiv.classList.add('hidden');
        }
    }

    // データの暗号化/復号化マイグレーション
    async migrateDataEncryption(encrypt) {
        try {
            const keys = ['diagnosisHistory', 'favorites', 'userData'];
            
            for (const key of keys) {
                const data = localStorage.getItem(key);
                if (data) {
                    try {
                        const parsed = JSON.parse(data);
                        if (encrypt) {
                            const encrypted = await this.encryptData(parsed);
                            localStorage.setItem(key, JSON.stringify(encrypted));
                        } else {
                            const decrypted = await this.decryptData(parsed);
                            localStorage.setItem(key, JSON.stringify(decrypted));
                        }
                    } catch (e) {
                        console.log(`Skipping migration for ${key}:`, e.message);
                    }
                }
            }
            
            this.showMessage(encrypt ? 'データの暗号化が完了しました' : 'データの復号化が完了しました', 'success');
        } catch (error) {
            console.error('Migration error:', error);
            this.showMessage('データの移行に失敗しました', 'error');
        }
    }

    // データの暗号化
    async encryptData(data) {
        if (!this.cryptoKey) return data;
        
        try {
            const encoder = new TextEncoder();
            const dataString = JSON.stringify(data);
            const iv = crypto.getRandomValues(new Uint8Array(12));
            
            const encrypted = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                this.cryptoKey,
                encoder.encode(dataString)
            );
            
            return {
                encrypted: true,
                iv: btoa(String.fromCharCode(...iv)),
                data: btoa(String.fromCharCode(...new Uint8Array(encrypted)))
            };
        } catch (error) {
            console.error('Encryption error:', error);
            return data;
        }
    }

    // データの復号化
    async decryptData(encryptedData) {
        if (!encryptedData.encrypted || !this.cryptoKey) return encryptedData;
        
        try {
            const iv = Uint8Array.from(atob(encryptedData.iv), c => c.charCodeAt(0));
            const data = Uint8Array.from(atob(encryptedData.data), c => c.charCodeAt(0));
            
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                this.cryptoKey,
                data
            );
            
            const decoder = new TextDecoder();
            return JSON.parse(decoder.decode(decrypted));
        } catch (error) {
            console.error('Decryption error:', error);
            throw error;
        }
    }

    // メッセージ表示
    showMessage(message, type = 'info') {
        const div = document.createElement('div');
        div.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        div.textContent = message;
        document.body.appendChild(div);
        
        setTimeout(() => {
            div.remove();
        }, 3000);
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    new SettingsManager();
});