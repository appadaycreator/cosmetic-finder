// UI管理モジュール
class UIManager {
    constructor() {
        this.currentPage = 'home';
        this.mobileSidebarOpen = false;
        this.currentLanguage = localStorage.getItem('cosmefinder_language') || 'ja';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeSettings();
        this.showPage('home');
    }

    setupEventListeners() {
        // ページ遷移
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-page')) {
                e.preventDefault();
                this.showPage(e.target.getAttribute('data-page'));
            }
        });

        // モバイルサイドバー
        const mobileSidebarToggle = document.querySelector('[onclick="toggleMobileSidebar()"]');
        if (mobileSidebarToggle) {
            mobileSidebarToggle.addEventListener('click', () => this.toggleMobileSidebar());
        }

        // サイドバーオーバーレイ
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeMobileSidebar());
        }

        // 設定変更
        this.setupSettingsListeners();
    }

    setupSettingsListeners() {
        // 言語切り替え
        const langSelect = document.getElementById('languageSelect');
        const langSelectMobile = document.getElementById('languageSelectMobile');
        
        if (langSelect) {
            langSelect.addEventListener('change', () => this.changeLanguage());
        }
        if (langSelectMobile) {
            langSelectMobile.addEventListener('change', () => this.changeLanguageMobile());
        }

        // フォントサイズ
        const fontSelect = document.getElementById('fontSizeSelect');
        const fontSelectMobile = document.getElementById('fontSizeSelectMobile');
        
        if (fontSelect) {
            fontSelect.addEventListener('change', () => this.changeFontSize());
        }
        if (fontSelectMobile) {
            fontSelectMobile.addEventListener('change', () => this.changeFontSizeMobile());
        }

        // 高コントラスト
        const contrastBtn = document.getElementById('highContrastBtn');
        if (contrastBtn) {
            contrastBtn.addEventListener('click', () => this.toggleHighContrast());
        }
    }

    showPage(pageId) {
        // 全ページを非表示
        const pages = ['homeContent', 'diagnosisContent', 'ingredientContent', 
                      'historyContent', 'contactContent'];
        
        pages.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('hidden');
            }
        });

        // 診断ページの特別処理
        const diagnosisPage = document.getElementById('diagnosisPage');
        if (diagnosisPage) {
            diagnosisPage.classList.add('hidden');
        }

        // 指定ページを表示
        const targetPage = document.getElementById(pageId + 'Content');
        if (targetPage) {
            targetPage.classList.remove('hidden');
            this.currentPage = pageId;
        }

        // サイドバーのアクティブ状態更新
        this.updateSidebarActive(pageId);

        // モバイルサイドバーを閉じる
        this.closeMobileSidebar();

        console.log(`Page switched to: ${pageId}`);
    }

    updateSidebarActive(pageId) {
        // サイドバーのアクティブクラス更新
        document.querySelectorAll('#sidebar a, #sidebar button').forEach(link => {
            link.classList.remove('bg-pink-100', 'text-pink-700');
            
            if (link.getAttribute('data-page') === pageId || 
                link.getAttribute('onclick')?.includes(pageId)) {
                link.classList.add('bg-pink-100', 'text-pink-700');
            }
        });
    }

    toggleMobileSidebar() {
        const sidebar = document.getElementById('mobileSidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            this.mobileSidebarOpen = !this.mobileSidebarOpen;
            
            if (this.mobileSidebarOpen) {
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            } else {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
                document.body.style.overflow = '';
            }
        }
    }

    closeMobileSidebar() {
        if (this.mobileSidebarOpen) {
            this.toggleMobileSidebar();
        }
    }

    changeLanguage() {
        const select = document.getElementById('languageSelect');
        this.currentLanguage = select.value;
        localStorage.setItem('cosmefinder_language', this.currentLanguage);
        this.applyLanguage();
        
        // モバイル版も同期
        const mobileSelect = document.getElementById('languageSelectMobile');
        if (mobileSelect) {
            mobileSelect.value = this.currentLanguage;
        }
        
        console.log('Language changed:', this.currentLanguage);
    }

    changeLanguageMobile() {
        const select = document.getElementById('languageSelectMobile');
        this.currentLanguage = select.value;
        localStorage.setItem('cosmefinder_language', this.currentLanguage);
        this.applyLanguage();
        
        // PC版も同期
        const pcSelect = document.getElementById('languageSelect');
        if (pcSelect) {
            pcSelect.value = this.currentLanguage;
        }
        
        console.log('Language changed (mobile):', this.currentLanguage);
    }

    applyLanguage() {
        const elements = document.querySelectorAll('[data-ja][data-en]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${this.currentLanguage}`);
            if (text) {
                if (element.tagName === 'INPUT' && element.type === 'submit') {
                    element.value = text;
                } else if (element.tagName === 'INPUT' && element.placeholder) {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        });
    }

    changeFontSize() {
        const select = document.getElementById('fontSizeSelect');
        const scale = parseFloat(select.value);
        document.documentElement.style.setProperty('--font-scale', scale);
        localStorage.setItem('cosmefinder_fontsize', scale);
        
        // モバイル版も同期
        const mobileSelect = document.getElementById('fontSizeSelectMobile');
        if (mobileSelect) {
            mobileSelect.value = scale;
        }
        
        console.log('Font size changed:', scale);
    }

    changeFontSizeMobile() {
        const select = document.getElementById('fontSizeSelectMobile');
        const scale = parseFloat(select.value);
        document.documentElement.style.setProperty('--font-scale', scale);
        localStorage.setItem('cosmefinder_fontsize', scale);
        
        // PC版も同期
        const pcSelect = document.getElementById('fontSizeSelect');
        if (pcSelect) {
            pcSelect.value = scale;
        }
        
        console.log('Font size changed (mobile):', scale);
    }

    toggleHighContrast() {
        const body = document.body;
        const btn = document.getElementById('highContrastBtn');
        const isEnabled = body.classList.toggle('high-contrast');
        
        localStorage.setItem('cosmefinder_highcontrast', isEnabled);
        
        if (btn) {
            if (isEnabled) {
                btn.classList.add('bg-gray-800', 'text-white');
                btn.classList.remove('hover:bg-gray-100');
            } else {
                btn.classList.remove('bg-gray-800', 'text-white');
                btn.classList.add('hover:bg-gray-100');
            }
        }
        
        console.log('High contrast mode:', isEnabled ? 'enabled' : 'disabled');
    }

    initializeSettings() {
        // 保存された設定を復元
        const savedLanguage = localStorage.getItem('cosmefinder_language');
        const savedFontSize = localStorage.getItem('cosmefinder_fontsize');
        const savedHighContrast = localStorage.getItem('cosmefinder_highcontrast') === 'true';

        if (savedLanguage) {
            this.currentLanguage = savedLanguage;
            const langSelect = document.getElementById('languageSelect');
            const langSelectMobile = document.getElementById('languageSelectMobile');
            if (langSelect) langSelect.value = savedLanguage;
            if (langSelectMobile) langSelectMobile.value = savedLanguage;
            this.applyLanguage();
        }

        if (savedFontSize) {
            const scale = parseFloat(savedFontSize);
            document.documentElement.style.setProperty('--font-scale', scale);
            const fontSelect = document.getElementById('fontSizeSelect');
            const fontSelectMobile = document.getElementById('fontSizeSelectMobile');
            if (fontSelect) fontSelect.value = scale;
            if (fontSelectMobile) fontSelectMobile.value = scale;
        }

        if (savedHighContrast) {
            document.body.classList.add('high-contrast');
            const btn = document.getElementById('highContrastBtn');
            if (btn) {
                btn.classList.add('bg-gray-800', 'text-white');
                btn.classList.remove('hover:bg-gray-100');
            }
        }
    }

    showMessage(message, type = 'info') {
        // メッセージ表示の共通関数
        console.log(`[${type.toUpperCase()}]: ${message}`);
        
        // 実際の表示はtoast通知やモーダルで実装可能
        if (type === 'error') {
            alert(`エラー: ${message}`);
        }
    }
}

// グローバルに公開
window.UIManager = UIManager;