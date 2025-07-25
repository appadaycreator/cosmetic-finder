/**
 * AI開発向けリファクタリング退行テスト
 * リファクタリング前後で全機能が正常動作することを確認
 */

class AIRefactorRegressionTest {
    constructor() {
        this.testResults = [];
        this.errors = [];
        this.baseline = null;
        this.startTime = Date.now();
    }

    /**
     * 全テストスイートを実行
     */
    async runFullSuite() {
        console.log('🚀 AI Refactor Regression Test Started');
        
        try {
            // ベースライン作成
            await this.createBaseline();
            
            // 基本機能テスト
            await this.testBasicFunctionality();
            
            // UI機能テスト
            await this.testUIFunctionality();
            
            // データ機能テスト
            await this.testDataFunctionality();
            
            // パフォーマンステスト
            await this.testPerformance();
            
            // 結果レポート生成
            this.generateReport();
            
        } catch (error) {
            console.error('❌ Test Suite Failed:', error);
            this.errors.push(error);
        }
    }

    /**
     * ベースライン（期待される動作）を作成
     */
    async createBaseline() {
        console.log('📋 Creating Baseline...');
        
        this.baseline = {
            requiredElements: [
                '#homeContent',
                '#diagnosisContent', 
                '#ingredientContent',
                '#historyContent',
                '#contactContent',
                '#sidebar',
                'header',
                '.cta-button',
                '#ingredientInput',
                '#analyzeIngredients'
            ],
            requiredFunctions: [
                'showPage',
                'startDiagnosis',
                'analyzeIngredients',
                'changeLanguage',
                'changeFontSize',
                'toggleHighContrast'
            ],
            requiredData: [
                'diagnosisQuestions',
                'ingredientsDatabase',
                'allProducts'
            ],
            localStorage: [
                'cosmefinder_language',
                'cosmefinder_fontsize',
                'cosmefinder_highcontrast',
                'cosmefinder_history'
            ]
        };

        console.log('✅ Baseline Created');
    }

    /**
     * 基本機能をテスト
     */
    async testBasicFunctionality() {
        console.log('🔍 Testing Basic Functionality...');
        
        // DOM要素存在確認
        for (const selector of this.baseline.requiredElements) {
            const element = document.querySelector(selector);
            this.addTestResult('DOM Element', selector, !!element);
        }

        // 必須関数存在確認
        for (const funcName of this.baseline.requiredFunctions) {
            const exists = typeof window[funcName] === 'function';
            this.addTestResult('Global Function', funcName, exists);
        }

        // データ存在確認
        for (const dataName of this.baseline.requiredData) {
            const exists = window[dataName] !== undefined;
            this.addTestResult('Global Data', dataName, exists);
        }

        console.log('✅ Basic Functionality Tests Complete');
    }

    /**
     * UI機能をテスト
     */
    async testUIFunctionality() {
        console.log('🎨 Testing UI Functionality...');
        
        // ページ遷移テスト
        const pages = ['home', 'diagnosis', 'ingredient', 'history', 'contact'];
        for (const page of pages) {
            try {
                if (typeof window.showPage === 'function') {
                    window.showPage(page);
                    const activeElement = document.getElementById(page + 'Content');
                    const isVisible = activeElement && !activeElement.classList.contains('hidden');
                    this.addTestResult('Page Navigation', page, isVisible);
                } else {
                    this.addTestResult('Page Navigation', page, false);
                }
            } catch (error) {
                this.addTestResult('Page Navigation', page, false);
                this.errors.push(`Page navigation error for ${page}: ${error.message}`);
            }
        }

        // 言語切り替えテスト
        try {
            const langSelect = document.getElementById('languageSelect');
            if (langSelect && typeof window.changeLanguage === 'function') {
                const originalLang = langSelect.value;
                langSelect.value = 'en';
                window.changeLanguage();
                const langChanged = window.currentLanguage === 'en';
                langSelect.value = originalLang;
                window.changeLanguage();
                this.addTestResult('Language Switch', 'changeLanguage', langChanged);
            } else {
                this.addTestResult('Language Switch', 'changeLanguage', false);
            }
        } catch (error) {
            this.addTestResult('Language Switch', 'changeLanguage', false);
            this.errors.push(`Language switch error: ${error.message}`);
        }

        // モバイルサイドバーテスト
        try {
            const sidebar = document.getElementById('mobileSidebar');
            const overlay = document.getElementById('sidebarOverlay');
            const hasRequiredElements = sidebar && overlay;
            this.addTestResult('Mobile Sidebar', 'elements exist', hasRequiredElements);
        } catch (error) {
            this.addTestResult('Mobile Sidebar', 'elements exist', false);
            this.errors.push(`Mobile sidebar test error: ${error.message}`);
        }

        console.log('✅ UI Functionality Tests Complete');
    }

    /**
     * データ機能をテスト
     */
    async testDataFunctionality() {
        console.log('💾 Testing Data Functionality...');
        
        // LocalStorage読み書きテスト
        try {
            const testKey = 'test_ai_refactor';
            const testData = { test: 'data', timestamp: Date.now() };
            
            localStorage.setItem(testKey, JSON.stringify(testData));
            const retrieved = JSON.parse(localStorage.getItem(testKey));
            const storageWorks = retrieved && retrieved.test === 'data';
            
            localStorage.removeItem(testKey);
            this.addTestResult('LocalStorage', 'read/write', storageWorks);
        } catch (error) {
            this.addTestResult('LocalStorage', 'read/write', false);
            this.errors.push(`LocalStorage test error: ${error.message}`);
        }

        // 診断データ構造テスト
        try {
            if (window.diagnosisQuestions) {
                const isValidStructure = Array.isArray(window.diagnosisQuestions) &&
                                       window.diagnosisQuestions.length === 10 &&
                                       window.diagnosisQuestions[0].hasOwnProperty('id') &&
                                       window.diagnosisQuestions[0].hasOwnProperty('question') &&
                                       window.diagnosisQuestions[0].hasOwnProperty('options');
                this.addTestResult('Diagnosis Data', 'structure', isValidStructure);
            } else {
                this.addTestResult('Diagnosis Data', 'structure', false);
            }
        } catch (error) {
            this.addTestResult('Diagnosis Data', 'structure', false);
            this.errors.push(`Diagnosis data test error: ${error.message}`);
        }

        // 製品データ構造テスト
        try {
            if (window.allProducts) {
                const isValidStructure = Array.isArray(window.allProducts) &&
                                       window.allProducts.length > 0 &&
                                       window.allProducts[0].hasOwnProperty('id') &&
                                       window.allProducts[0].hasOwnProperty('name') &&
                                       window.allProducts[0].hasOwnProperty('brand');
                this.addTestResult('Product Data', 'structure', isValidStructure);
            } else {
                this.addTestResult('Product Data', 'structure', false);
            }
        } catch (error) {
            this.addTestResult('Product Data', 'structure', false);
            this.errors.push(`Product data test error: ${error.message}`);
        }

        console.log('✅ Data Functionality Tests Complete');
    }

    /**
     * パフォーマンステスト
     */
    async testPerformance() {
        console.log('⚡ Testing Performance...');
        
        // DOM要素数チェック
        const totalElements = document.querySelectorAll('*').length;
        const reasonableElementCount = totalElements < 1000;
        this.addTestResult('Performance', 'DOM element count', reasonableElementCount);

        // メモリ使用量チェック（概算）
        if (performance.memory) {
            const memoryUsage = performance.memory.usedJSHeapSize;
            const reasonableMemoryUsage = memoryUsage < 50000000; // 50MB以下
            this.addTestResult('Performance', 'memory usage', reasonableMemoryUsage);
        }

        // スクリプトロード時間チェック
        if (performance.timing) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            const reasonableLoadTime = loadTime < 3000; // 3秒以下
            this.addTestResult('Performance', 'load time', reasonableLoadTime);
        }

        console.log('✅ Performance Tests Complete');
    }

    /**
     * テスト結果を追加
     */
    addTestResult(category, test, passed) {
        this.testResults.push({
            category,
            test,
            passed,
            timestamp: new Date().toISOString()
        });

        const status = passed ? '✅' : '❌';
        console.log(`${status} ${category}: ${test} - ${passed ? 'PASS' : 'FAIL'}`);
    }

    /**
     * テストレポートを生成
     */
    generateReport() {
        const endTime = Date.now();
        const duration = endTime - this.startTime;
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;
        const successRate = Math.round((passedTests / totalTests) * 100);

        console.log('\n📊 AI Refactor Regression Test Report');
        console.log('='.repeat(50));
        console.log(`⏱️  Duration: ${duration}ms`);
        console.log(`📝 Total Tests: ${totalTests}`);
        console.log(`✅ Passed: ${passedTests}`);
        console.log(`❌ Failed: ${failedTests}`);
        console.log(`📈 Success Rate: ${successRate}%`);
        console.log(`🚨 Errors: ${this.errors.length}`);

        if (this.errors.length > 0) {
            console.log('\n🚨 Error Details:');
            this.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }

        // カテゴリー別統計
        const categories = [...new Set(this.testResults.map(r => r.category))];
        console.log('\n📊 Results by Category:');
        categories.forEach(category => {
            const categoryTests = this.testResults.filter(r => r.category === category);
            const categoryPassed = categoryTests.filter(r => r.passed).length;
            const categoryRate = Math.round((categoryPassed / categoryTests.length) * 100);
            console.log(`  ${category}: ${categoryPassed}/${categoryTests.length} (${categoryRate}%)`);
        });

        // 結果判定
        const testPassed = failedTests === 0 && this.errors.length === 0;
        console.log(`\n🎯 Overall Result: ${testPassed ? '✅ PASSED' : '❌ FAILED'}`);
        
        if (!testPassed) {
            console.log('⚠️  リファクタリングを中止し、元のコードに戻してください');
        }

        return {
            passed: testPassed,
            totalTests,
            passedTests,
            failedTests,
            successRate,
            errors: this.errors,
            duration
        };
    }
}

// グローバルに公開
window.AIRefactorRegressionTest = AIRefactorRegressionTest;

// 実行関数
window.runAIRefactorTest = async function() {
    const tester = new AIRefactorRegressionTest();
    return await tester.runFullSuite();
};