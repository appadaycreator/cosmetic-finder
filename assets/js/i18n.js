// 多言語対応
const translations = {
    ja: {
        // ナビゲーション
        'nav.home': 'ホーム',
        'nav.howto': '使い方',
        'nav.contact': 'お問い合わせ',
        
        // ヒーローセクション
        'hero.title': 'あなたに最適な化粧品を見つけよう',
        'hero.subtitle': '肌質診断と成分解析で、安全で効果的な製品選びをサポート',
        'hero.cta': '肌診断を始める',
        
        // 機能
        'features.title': '主な機能',
        'features.diagnosis.title': '肌質診断',
        'features.diagnosis.desc': '簡単な質問に答えるだけで、あなたの肌タイプを診断',
        'features.analysis.title': '成分解析',
        'features.analysis.desc': '化粧品の成分を詳しく解析し、安全性をチェック',
        'features.recommend.title': '製品レコメンド',
        'features.recommend.desc': 'あなたの肌質に合った最適な製品を提案',
        'features.multilang.title': '多言語対応',
        'features.multilang.desc': '日本語、英語、中国語、韓国語に対応',
        
        // 成分チェッカー
        'ingredients.title': '成分チェッカー',
        'ingredients.placeholder': '化粧品の成分リストを入力してください...',
        'ingredients.analyze': '成分を解析',
        
        // 診断
        'diagnosis.title': '肌質診断',
        'diagnosis.question': '質問',
        'diagnosis.back': '戻る',
        'diagnosis.result.title': '診断結果',
        'diagnosis.result.skintype': 'あなたの肌タイプ',
        'diagnosis.result.recommendations': 'おすすめのスキンケア',
        'diagnosis.result.products': 'おすすめ製品カテゴリー',
        'diagnosis.result.view': 'おすすめ製品を見る',
        'diagnosis.result.restart': 'もう一度診断する',
        'diagnosis.result.share': '結果をシェアする',
        
        // フッター
        'footer.copyright': '© 2025 コスメファインダー. All rights reserved.',
        'footer.terms': '利用規約',
        'footer.privacy': 'プライバシーポリシー'
    },
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.howto': 'How to Use',
        'nav.contact': 'Contact',
        
        // Hero Section
        'hero.title': 'Find Your Perfect Cosmetics',
        'hero.subtitle': 'Support safe and effective product selection with skin diagnosis and ingredient analysis',
        'hero.cta': 'Start Skin Diagnosis',
        
        // Features
        'features.title': 'Main Features',
        'features.diagnosis.title': 'Skin Diagnosis',
        'features.diagnosis.desc': 'Diagnose your skin type by answering simple questions',
        'features.analysis.title': 'Ingredient Analysis',
        'features.analysis.desc': 'Analyze cosmetic ingredients in detail and check safety',
        'features.recommend.title': 'Product Recommendations',
        'features.recommend.desc': 'Suggest optimal products for your skin type',
        'features.multilang.title': 'Multi-language Support',
        'features.multilang.desc': 'Available in Japanese, English, Chinese, and Korean',
        
        // Ingredient Checker
        'ingredients.title': 'Ingredient Checker',
        'ingredients.placeholder': 'Enter cosmetic ingredient list...',
        'ingredients.analyze': 'Analyze Ingredients',
        
        // Diagnosis
        'diagnosis.title': 'Skin Diagnosis',
        'diagnosis.question': 'Question',
        'diagnosis.back': 'Back',
        'diagnosis.result.title': 'Diagnosis Results',
        'diagnosis.result.skintype': 'Your Skin Type',
        'diagnosis.result.recommendations': 'Recommended Skincare',
        'diagnosis.result.products': 'Recommended Product Categories',
        'diagnosis.result.view': 'View Recommended Products',
        'diagnosis.result.restart': 'Diagnose Again',
        'diagnosis.result.share': 'Share Results',
        
        // Footer
        'footer.copyright': '© 2025 Cosmetic Finder. All rights reserved.',
        'footer.terms': 'Terms of Service',
        'footer.privacy': 'Privacy Policy'
    },
    zh: {
        // 导航
        'nav.home': '首页',
        'nav.howto': '使用方法',
        'nav.contact': '联系我们',
        
        // 主页横幅
        'hero.title': '找到最适合您的化妆品',
        'hero.subtitle': '通过肤质诊断和成分分析，支持安全有效的产品选择',
        'hero.cta': '开始肌肤诊断',
        
        // 功能
        'features.title': '主要功能',
        'features.diagnosis.title': '肤质诊断',
        'features.diagnosis.desc': '通过回答简单问题诊断您的肤质',
        'features.analysis.title': '成分分析',
        'features.analysis.desc': '详细分析化妆品成分并检查安全性',
        'features.recommend.title': '产品推荐',
        'features.recommend.desc': '为您的肤质推荐最佳产品',
        'features.multilang.title': '多语言支持',
        'features.multilang.desc': '支持日语、英语、中文、韩语',
        
        // 成分检查器
        'ingredients.title': '成分检查器',
        'ingredients.placeholder': '请输入化妆品成分列表...',
        'ingredients.analyze': '分析成分',
        
        // 诊断
        'diagnosis.title': '肤质诊断',
        'diagnosis.question': '问题',
        'diagnosis.back': '返回',
        'diagnosis.result.title': '诊断结果',
        'diagnosis.result.skintype': '您的肤质',
        'diagnosis.result.recommendations': '推荐护肤',
        'diagnosis.result.products': '推荐产品类别',
        'diagnosis.result.view': '查看推荐产品',
        'diagnosis.result.restart': '重新诊断',
        'diagnosis.result.share': '分享结果',
        
        // 页脚
        'footer.copyright': '© 2025 化妆品查找器。保留所有权利。',
        'footer.terms': '服务条款',
        'footer.privacy': '隐私政策'
    },
    ko: {
        // 네비게이션
        'nav.home': '홈',
        'nav.howto': '사용 방법',
        'nav.contact': '문의하기',
        
        // 히어로 섹션
        'hero.title': '당신에게 최적의 화장품을 찾아보세요',
        'hero.subtitle': '피부 진단과 성분 분석으로 안전하고 효과적인 제품 선택을 지원',
        'hero.cta': '피부 진단 시작',
        
        // 기능
        'features.title': '주요 기능',
        'features.diagnosis.title': '피부 진단',
        'features.diagnosis.desc': '간단한 질문에 답하여 피부 타입 진단',
        'features.analysis.title': '성분 분석',
        'features.analysis.desc': '화장품 성분을 자세히 분석하고 안전성 확인',
        'features.recommend.title': '제품 추천',
        'features.recommend.desc': '피부 타입에 맞는 최적의 제품 제안',
        'features.multilang.title': '다국어 지원',
        'features.multilang.desc': '일본어, 영어, 중국어, 한국어 지원',
        
        // 성분 체커
        'ingredients.title': '성분 체커',
        'ingredients.placeholder': '화장품 성분 목록을 입력하세요...',
        'ingredients.analyze': '성분 분석',
        
        // 진단
        'diagnosis.title': '피부 진단',
        'diagnosis.question': '질문',
        'diagnosis.back': '뒤로',
        'diagnosis.result.title': '진단 결과',
        'diagnosis.result.skintype': '당신의 피부 타입',
        'diagnosis.result.recommendations': '추천 스킨케어',
        'diagnosis.result.products': '추천 제품 카테고리',
        'diagnosis.result.view': '추천 제품 보기',
        'diagnosis.result.restart': '다시 진단하기',
        'diagnosis.result.share': '결과 공유하기',
        
        // 푸터
        'footer.copyright': '© 2025 코스메틱 파인더. All rights reserved.',
        'footer.terms': '이용약관',
        'footer.privacy': '개인정보처리방침'
    }
};

let currentLanguage = 'ja';

// 言語初期化
document.addEventListener('DOMContentLoaded', () => {
    initializeLanguage();
    createLanguageSelector();
});

function initializeLanguage() {
    // ローカルストレージから言語設定を取得
    const savedLanguage = window.cosmeticFinder?.storage?.get('language');
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
    } else {
        // ブラウザの言語設定から自動検出
        const browserLang = navigator.language.split('-')[0];
        if (translations[browserLang]) {
            currentLanguage = browserLang;
        }
    }
    
    applyTranslations();
}

function createLanguageSelector() {
    const selector = document.createElement('select');
    selector.id = 'language-selector';
    selector.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 10000;
        padding: 5px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: white;
    `;
    
    const languages = [
        { code: 'ja', name: '日本語' },
        { code: 'en', name: 'English' },
        { code: 'zh', name: '中文' },
        { code: 'ko', name: '한국어' }
    ];
    
    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.name;
        if (lang.code === currentLanguage) {
            option.selected = true;
        }
        selector.appendChild(option);
    });
    
    selector.addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });
    
    document.body.appendChild(selector);
}

function changeLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        window.cosmeticFinder?.storage?.set('language', lang);
        applyTranslations();
    }
}

function applyTranslations() {
    // data-i18n属性を持つ要素を翻訳
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key);
        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
    
    // 特定の要素を手動で翻訳（既存のHTMLに対応）
    translateExistingElements();
}

function getTranslation(key) {
    return translations[currentLanguage][key] || translations['ja'][key] || key;
}

function translateExistingElements() {
    // ナビゲーション
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        const text = link.textContent.trim();
        if (text === 'ホーム' || text === 'Home') {
            link.textContent = getTranslation('nav.home');
        } else if (text === '使い方' || text === 'How to Use') {
            link.textContent = getTranslation('nav.howto');
        } else if (text === 'お問い合わせ' || text === 'Contact') {
            link.textContent = getTranslation('nav.contact');
        }
    });
    
    // ヒーローセクション
    const heroTitle = document.querySelector('.hero h2');
    if (heroTitle) {
        heroTitle.textContent = getTranslation('hero.title');
    }
    
    const heroSubtitle = document.querySelector('.hero p');
    if (heroSubtitle) {
        heroSubtitle.textContent = getTranslation('hero.subtitle');
    }
    
    const ctaButton = document.getElementById('startDiagnosis');
    if (ctaButton) {
        ctaButton.textContent = getTranslation('hero.cta');
    }
    
    // 機能セクション
    const featuresTitle = document.querySelector('.features h3');
    if (featuresTitle) {
        featuresTitle.textContent = getTranslation('features.title');
    }
    
    // 成分チェッカー
    const ingredientTitle = document.querySelector('.ingredient-checker h3');
    if (ingredientTitle) {
        ingredientTitle.textContent = getTranslation('ingredients.title');
    }
    
    const ingredientInput = document.getElementById('ingredientInput');
    if (ingredientInput) {
        ingredientInput.placeholder = getTranslation('ingredients.placeholder');
    }
    
    const analyzeButton = document.getElementById('analyzeIngredients');
    if (analyzeButton) {
        analyzeButton.textContent = getTranslation('ingredients.analyze');
    }
}

// グローバル関数として公開
window.i18n = {
    getTranslation,
    changeLanguage,
    getCurrentLanguage: () => currentLanguage
};