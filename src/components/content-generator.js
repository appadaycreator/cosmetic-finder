/**
 * @fileoverview 動的コンテンツ生成
 * AI開発フレンドリーな構造化コンテンツ
 */

/**
 * ページコンテンツを生成するクラス
 */
export class ContentGenerator {
    constructor() {
        this.templates = new Map();
        this._initializeTemplates();
    }

    /**
     * テンプレートを初期化
     * @private
     */
    _initializeTemplates() {
        // ホームページテンプレート
        this.templates.set('home', () => `
            <div class="space-y-8">
                <section class="hero text-center bg-gradient-to-r from-pink-400 to-pink-600 text-white p-12 rounded-2xl">
                    <h2 class="text-4xl font-bold mb-4" data-ja="あなたにぴったりの化粧品を見つけよう" data-en="Find Your Perfect Cosmetics">
                        あなたにぴったりの化粧品を見つけよう
                    </h2>
                    <p class="text-xl mb-8" data-ja="肌質診断と成分解析で、あなたの肌に最適な化粧品を推奨します" data-en="Personalized cosmetic recommendations through skin analysis and ingredient analysis">
                        肌質診断と成分解析で、あなたの肌に最適な化粧品を推奨します
                    </p>
                    <button class="cta-button bg-white text-pink-600 px-8 py-4 rounded-full text-lg font-bold hover:shadow-lg transition-all" data-page="diagnosis">
                        <span data-ja="今すぐ診断開始" data-en="Start Analysis Now">今すぐ診断開始</span>
                    </button>
                </section>

                <div class="grid md:grid-cols-3 gap-6">
                    <div class="feature-card bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div class="text-4xl mb-4">🔍</div>
                        <h3 class="text-xl font-semibold mb-2" data-ja="肌質診断" data-en="Skin Analysis">肌質診断</h3>
                        <p data-ja="10項目の質問であなたの肌質を詳しく分析" data-en="Analyze your skin type with 10 detailed questions">
                            10項目の質問であなたの肌質を詳しく分析
                        </p>
                    </div>
                    <div class="feature-card bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div class="text-4xl mb-4">🧪</div>
                        <h3 class="text-xl font-semibold mb-2" data-ja="成分解析" data-en="Ingredient Analysis">成分解析</h3>
                        <p data-ja="化粧品の成分を解析して安全性をチェック" data-en="Analyze cosmetic ingredients for safety">
                            化粧品の成分を解析して安全性をチェック
                        </p>
                    </div>
                    <div class="feature-card bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div class="text-4xl mb-4">🛍️</div>
                        <h3 class="text-xl font-semibold mb-2" data-ja="製品推奨" data-en="Product Recommendation">製品推奨</h3>
                        <p data-ja="100種類以上の製品からあなたに最適なものを推奨" data-en="Recommend the best products from 100+ options">
                            100種類以上の製品からあなたに最適なものを推奨
                        </p>
                    </div>
                </div>
            </div>
        `);

        // 診断ページテンプレート
        this.templates.set('diagnosis', () => `
            <div id="diagnosisContainer" class="max-w-4xl mx-auto">
                <div class="bg-white rounded-xl shadow-sm p-8">
                    <h2 class="text-3xl font-bold text-center mb-8" data-ja="肌質診断" data-en="Skin Analysis">肌質診断</h2>
                    <div id="diagnosisForm">
                        <div class="text-center py-8">
                            <p class="text-gray-600 mb-4">診断を開始してください</p>
                            <button class="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors" onclick="startDiagnosis()">
                                診断開始
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `);

        // 成分解析ページテンプレート
        this.templates.set('ingredient', () => `
            <div class="max-w-4xl mx-auto">
                <div class="bg-white rounded-xl shadow-sm p-8">
                    <h2 class="text-3xl font-bold text-center mb-8" data-ja="成分解析" data-en="Ingredient Analysis">成分解析</h2>
                    <div class="mb-6">
                        <label class="block text-sm font-medium mb-2" data-ja="成分リストを入力してください" data-en="Enter ingredient list">
                            成分リストを入力してください
                        </label>
                        <textarea id="ingredientInput" class="w-full h-32 p-4 border border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none" 
                            placeholder="例: Water, Glycerin, Hyaluronic Acid, Ceramide"></textarea>
                    </div>
                    <button id="analyzeIngredients" class="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors">
                        <span data-ja="成分を解析する" data-en="Analyze Ingredients">成分を解析する</span>
                    </button>
                    <div id="ingredientResults" class="mt-8"></div>
                </div>
            </div>
        `);

        // 履歴ページテンプレート
        this.templates.set('history', () => `
            <div class="max-w-4xl mx-auto">
                <div class="bg-white rounded-xl shadow-sm p-8">
                    <h2 class="text-3xl font-bold text-center mb-8" data-ja="診断履歴" data-en="History">診断履歴</h2>
                    <div id="historyContainer">
                        <div class="text-center py-8 text-gray-500">
                            <p data-ja="診断履歴がありません" data-en="No diagnosis history">診断履歴がありません</p>
                        </div>
                    </div>
                </div>
            </div>
        `);

        // お問い合わせページテンプレート
        this.templates.set('contact', () => `
            <div class="max-w-2xl mx-auto">
                <div class="bg-white rounded-xl shadow-sm p-8">
                    <h2 class="text-3xl font-bold text-center mb-8" data-ja="お問い合わせ" data-en="Contact">お問い合わせ</h2>
                    <form id="contactForm" class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium mb-2" data-ja="お名前" data-en="Name">お名前</label>
                            <input type="text" name="name" required class="w-full p-3 border border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2" data-ja="メールアドレス" data-en="Email">メールアドレス</label>
                            <input type="email" name="email" required class="w-full p-3 border border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2" data-ja="お問い合わせ内容" data-en="Message">お問い合わせ内容</label>
                            <textarea name="message" rows="6" required class="w-full p-3 border border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"></textarea>
                        </div>
                        <button type="submit" class="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors">
                            <span data-ja="送信する" data-en="Send">送信する</span>
                        </button>
                    </form>
                </div>
            </div>
        `);
    }

    /**
     * サイドバーナビゲーションを生成
     * @returns {string} HTML文字列
     */
    generateSidebarNav() {
        const navItems = [
            { id: 'home', icon: 'fas fa-home', labelJa: '🏠 ホーム', labelEn: '🏠 Home', active: true },
            { id: 'diagnosis', icon: 'fas fa-user-md', labelJa: '🔍 肌質診断', labelEn: '🔍 Skin Analysis' },
            { id: 'ingredient', icon: 'fas fa-flask', labelJa: '🧪 成分解析', labelEn: '🧪 Ingredient Analysis' },
            { id: 'history', icon: 'fas fa-history', labelJa: '📊 履歴', labelEn: '📊 History' },
            { id: 'contact', icon: 'fas fa-envelope', labelJa: '✉️ お問い合わせ', labelEn: '✉️ Contact' }
        ];

        return navItems.map(item => `
            <button data-page="${item.id}" class="w-full text-left px-4 py-2 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-colors ${item.active ? 'bg-pink-100 text-pink-700' : ''}">
                <i class="${item.icon} mr-3"></i>
                <span data-ja="${item.labelJa}" data-en="${item.labelEn}">${item.labelJa}</span>
            </button>
        `).join('');
    }

    /**
     * モバイルサイドバーコンテンツを生成
     * @returns {string} HTML文字列
     */
    generateMobileSidebarContent() {
        return `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-900" data-ja="メニュー" data-en="Menu">メニュー</h2>
                <button id="closeSidebarBtn" class="p-2 hover:bg-gray-100 rounded">
                    <i class="fas fa-times text-gray-600"></i>
                </button>
            </div>
            
            <nav class="space-y-2">
                ${this.generateSidebarNav().replace(/bg-pink-100 text-pink-700/g, '')}
            </nav>
            
            <!-- モバイル用設定オプション -->
            <div class="mt-6 pt-6 border-t border-gray-200 space-y-4 md:hidden">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">言語 / Language</label>
                    <select id="languageSelectMobile" class="w-full text-sm border rounded px-3 py-2">
                        <option value="ja">日本語</option>
                        <option value="en">English</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">文字サイズ</label>
                    <select id="fontSizeSelectMobile" class="w-full text-sm border rounded px-3 py-2">
                        <option value="0.75">極小</option>
                        <option value="0.875">小</option>
                        <option value="1" selected>標準</option>
                        <option value="1.25">大</option>
                        <option value="1.5">特大</option>
                    </select>
                </div>
            </div>
        `;
    }

    /**
     * ページコンテンツを生成
     * @param {string} pageId - ページID
     * @returns {string} HTML文字列
     */
    generatePageContent(pageId) {
        const template = this.templates.get(pageId);
        if (!template) {
            return `
                <div class="text-center py-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">ページが見つかりません</h2>
                    <p class="text-gray-600">指定されたページ "${pageId}" は存在しません。</p>
                </div>
            `;
        }
        return template();
    }

    /**
     * すべてのコンテンツを初期化
     */
    initializeAllContent() {
        // サイドバーナビゲーション
        const sidebarNav = document.getElementById('sidebarNav');
        if (sidebarNav) {
            sidebarNav.innerHTML = this.generateSidebarNav();
        }

        // モバイルサイドバー
        const mobileSidebarContent = document.getElementById('mobileSidebarContent');
        if (mobileSidebarContent) {
            mobileSidebarContent.innerHTML = this.generateMobileSidebarContent();
        }

        // メインコンテンツ（ホームページを表示）
        this.renderPage('home');

        console.log('📄 Content generated');
    }

    /**
     * ページをレンダリング
     * @param {string} pageId - ページID
     */
    renderPage(pageId) {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = this.generatePageContent(pageId);
            this._updateActiveNavItem(pageId);
        }
    }

    /**
     * アクティブなナビゲーション項目を更新
     * @private
     * @param {string} pageId - ページID
     */
    _updateActiveNavItem(pageId) {
        // すべてのナビゲーション項目からアクティブクラスを削除
        document.querySelectorAll('[data-page]').forEach(item => {
            item.classList.remove('bg-pink-100', 'text-pink-700');
        });

        // 対象項目にアクティブクラスを追加
        document.querySelectorAll(`[data-page="${pageId}"]`).forEach(item => {
            item.classList.add('bg-pink-100', 'text-pink-700');
        });
    }
}

// シングルトンインスタンス
export const contentGenerator = new ContentGenerator();

// ブラウザ環境でのグローバル公開
if (typeof window !== 'undefined') {
    window.ContentGenerator = ContentGenerator;
    window.contentGenerator = contentGenerator;
}