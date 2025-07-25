// メイン機能管理（リファクタリング版）
class CosmeticFinderApp {
    constructor() {
        this.diagnosisManager = null;
        this.ingredientAnalyzer = null;
        this.currentLanguage = localStorage.getItem('cosmefinder_language') || 'ja';
        this.init();
    }

    init() {
        this.setupGlobalEventListeners();
        this.initializeModules();
        this.loadUserSettings();
        console.log('CosmeticFinder App initialized');
    }

    setupGlobalEventListeners() {
        // 診断開始
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cta-button')) {
                this.startDiagnosis();
            }
        });

        // 成分解析
        const analyzeBtn = document.getElementById('analyzeIngredients');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.analyzeIngredients());
        }

        // お問い合わせフォーム
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }

        // キーボードショートカット
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    initializeModules() {
        // 診断マネージャーの初期化は必要時に行う
        this.loadHistoryData();
    }

    startDiagnosis() {
        if (!this.diagnosisManager) {
            this.diagnosisManager = new DiagnosisManager();
        }
        
        window.uiManager.showPage('diagnosis');
        this.diagnosisManager.startDiagnosis();
    }

    analyzeIngredients() {
        const input = document.getElementById('ingredientInput');
        const ingredientText = input.value.trim();
        
        if (!ingredientText) {
            alert(this.currentLanguage === 'ja' ? '成分を入力してください' : 'Please enter ingredients');
            return;
        }

        if (!this.ingredientAnalyzer) {
            this.ingredientAnalyzer = new IngredientAnalyzer();
        }

        this.ingredientAnalyzer.analyzeIngredients(ingredientText);
    }

    handleContactForm(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };

        // 実際の実装ではサーバーに送信
        console.log('Contact form submitted:', data);
        
        const message = this.currentLanguage === 'ja' 
            ? 'お問い合わせをありがとうございます。内容を確認の上、回答いたします。'
            : 'Thank you for your inquiry. We will review and respond to your message.';
            
        alert(message);
        e.target.reset();
    }

    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'h':
                    e.preventDefault();
                    window.uiManager.showPage('home');
                    break;
                case 'd':
                    e.preventDefault();
                    window.uiManager.showPage('diagnosis');
                    break;
                case 'i':
                    e.preventDefault();
                    window.uiManager.showPage('ingredient');
                    break;
                case 'r':
                    e.preventDefault();
                    window.uiManager.showPage('history');
                    break;
            }
        }
    }

    loadHistoryData() {
        // 診断履歴の表示
        const historyContainer = document.getElementById('historyContainer');
        if (!historyContainer) return;

        const history = this.getDiagnosisHistory();
        
        if (history.length === 0) {
            historyContainer.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <p data-ja="診断履歴がありません" data-en="No diagnosis history">診断履歴がありません</p>
                </div>
            `;
            return;
        }

        const historyHTML = history.map((item, index) => `
            <div class="bg-gray-50 p-4 rounded-lg mb-4">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-semibold">${item.result?.skinType || '未分類'}</h3>
                    <div class="flex space-x-2">
                        <span class="text-sm text-gray-500">${new Date(item.timestamp).toLocaleDateString()}</span>
                        <button onclick="app.deleteHistoryItem(${index})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash text-sm"></i>
                        </button>
                    </div>
                </div>
                <p class="text-sm text-gray-600">${item.result?.description || ''}</p>
            </div>
        `).join('');

        historyContainer.innerHTML = historyHTML;
    }

    getDiagnosisHistory() {
        try {
            return JSON.parse(localStorage.getItem('cosmefinder_history') || '[]');
        } catch (error) {
            console.error('Error loading history:', error);
            return [];
        }
    }

    deleteHistoryItem(index) {
        const confirmMessage = this.currentLanguage === 'ja' 
            ? 'この履歴を削除しますか？' 
            : 'Delete this history item?';
            
        if (confirm(confirmMessage)) {
            const history = this.getDiagnosisHistory();
            history.splice(index, 1);
            localStorage.setItem('cosmefinder_history', JSON.stringify(history));
            this.loadHistoryData();
        }
    }

    loadUserSettings() {
        // 保存された設定を復元（UI Managerで処理）
        const savedLanguage = localStorage.getItem('cosmefinder_language');
        if (savedLanguage) {
            this.currentLanguage = savedLanguage;
        }
    }

    // ユーティリティメソッド
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString(
            this.currentLanguage === 'ja' ? 'ja-JP' : 'en-US'
        );
    }

    showNotification(message, type = 'info') {
        // 将来的にはtoast通知システムを実装
        console.log(`[${type.toUpperCase()}]: ${message}`);
        
        if (type === 'error') {
            alert(message);
        }
    }

    // データエクスポート機能
    exportData() {
        const data = {
            history: this.getDiagnosisHistory(),
            settings: {
                language: this.currentLanguage,
                fontSize: localStorage.getItem('cosmefinder_fontsize'),
                highContrast: localStorage.getItem('cosmefinder_highcontrast')
            },
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cosmefinder-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // データインポート機能
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.history) {
                    localStorage.setItem('cosmefinder_history', JSON.stringify(data.history));
                }
                
                if (data.settings) {
                    if (data.settings.language) {
                        localStorage.setItem('cosmefinder_language', data.settings.language);
                    }
                    if (data.settings.fontSize) {
                        localStorage.setItem('cosmefinder_fontsize', data.settings.fontSize);
                    }
                    if (data.settings.highContrast) {
                        localStorage.setItem('cosmefinder_highcontrast', data.settings.highContrast);
                    }
                }
                
                alert(this.currentLanguage === 'ja' ? 'データを復元しました' : 'Data restored successfully');
                location.reload();
            } catch (error) {
                alert(this.currentLanguage === 'ja' ? 'ファイルの読み込みに失敗しました' : 'Failed to load file');
            }
        };
        reader.readAsText(file);
    }
}

// グローバルに公開
window.CosmeticFinderApp = CosmeticFinderApp;

// アプリケーションインスタンス
let app;

// DOM読み込み完了後の初期化
document.addEventListener('DOMContentLoaded', function() {
    app = new CosmeticFinderApp();
    window.app = app; // デバッグ用
});