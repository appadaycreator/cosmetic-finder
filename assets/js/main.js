// メイン機能
document.addEventListener('DOMContentLoaded', () => {
    // Service Worker登録
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => console.log('Service Worker registered:', registration))
            .catch(err => console.log('Service Worker registration failed:', err));
    }

    // ローカルストレージのユーティリティ
    const storage = {
        get: (key) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Storage get error:', e);
                return null;
            }
        },
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage set error:', e);
                return false;
            }
        },
        remove: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Storage remove error:', e);
                return false;
            }
        }
    };

    // グローバルユーティリティ
    window.cosmeticFinder = {
        storage,
        state: {
            currentLanguage: storage.get('language') || 'ja',
            diagnosisHistory: storage.get('diagnosisHistory') || [],
            favorites: storage.get('favorites') || [],
            userPreferences: storage.get('userPreferences') || {}
        }
    };

    // コンタクトフォームの処理
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // ページ遷移時のアニメーション
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            if (!e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                const href = link.getAttribute('href');
                animatePageTransition(href);
            }
        });
    });

    // スムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 診断履歴の保存
    window.saveDiagnosisResult = (result) => {
        const history = window.cosmeticFinder.state.diagnosisHistory;
        const newResult = {
            ...result,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        history.unshift(newResult);
        if (history.length > 10) history.pop(); // 最大10件まで保存
        window.cosmeticFinder.storage.set('diagnosisHistory', history);
        window.cosmeticFinder.state.diagnosisHistory = history;
        return newResult;
    };

    // お気に入りの管理
    window.toggleFavorite = (productId) => {
        const favorites = window.cosmeticFinder.state.favorites;
        const index = favorites.indexOf(productId);
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(productId);
        }
        window.cosmeticFinder.storage.set('favorites', favorites);
        window.cosmeticFinder.state.favorites = favorites;
        return favorites.includes(productId);
    };

    // ユーザー設定の更新
    window.updatePreferences = (preferences) => {
        const updated = { ...window.cosmeticFinder.state.userPreferences, ...preferences };
        window.cosmeticFinder.storage.set('userPreferences', updated);
        window.cosmeticFinder.state.userPreferences = updated;
        return updated;
    };
});

// コンタクトフォームの処理
function handleContactForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // フォームメッセージ要素
    const messageEl = document.getElementById('formMessage');
    
    // 実際の送信処理（ここではシミュレーション）
    messageEl.style.display = 'block';
    messageEl.className = 'form-message success';
    messageEl.textContent = 'お問い合わせを受け付けました。ありがとうございます。';
    
    // フォームをリセット
    e.target.reset();
    
    // 3秒後にメッセージを非表示
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 3000);
}

// ページ遷移アニメーション
function animatePageTransition(href) {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        window.location.href = href;
    }, 300);
}

// エラーハンドリング
window.addEventListener('error', (e) => {
    console.error('Global error:', e);
    // エラーログをローカルストレージに保存（デバッグ用）
    const errors = window.cosmeticFinder.storage.get('errorLog') || [];
    errors.push({
        message: e.message,
        timestamp: new Date().toISOString(),
        stack: e.error ? e.error.stack : 'No stack trace'
    });
    if (errors.length > 50) errors.shift(); // 最大50件
    window.cosmeticFinder.storage.set('errorLog', errors);
});

// オンライン/オフライン状態の監視
window.addEventListener('online', () => {
    console.log('オンラインに復帰しました');
    // 必要に応じてデータの同期処理
});

window.addEventListener('offline', () => {
    console.log('オフラインになりました');
    // オフラインモードの通知
});

// ビューポートサイズ変更の監視
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // レスポンシブ対応の調整
        adjustResponsiveElements();
    }, 250);
});

function adjustResponsiveElements() {
    const width = window.innerWidth;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;
    
    // 必要に応じてレイアウト調整
    document.body.classList.toggle('mobile', isMobile);
    document.body.classList.toggle('tablet', isTablet);
    document.body.classList.toggle('desktop', isDesktop);
}