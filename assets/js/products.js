// 製品一覧機能
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;

// パフォーマンス最適化用のキャッシュ
const productCache = new Map();
const searchCache = new Map();

// DOM要素
const elements = {
    productSearch: null,
    searchButton: null,
    categoryFilter: null,
    skinTypeFilter: null,
    priceFilter: null,
    sortBy: null,
    clearFilters: null,
    productsContainer: null,
    pagination: null,
    resultsCount: null,
    pageInfo: null,
    loadingIndicator: null
};

// 初期化
document.addEventListener('DOMContentLoaded', async () => {
    initializeElements();
    attachEventListeners();
    await loadProducts();
    
    // URLパラメータをチェックして診断結果を適用
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('diagnosis') === 'true') {
        applyDiagnosisFilters();
    } else {
        applyFiltersAndDisplay();
    }
});

function initializeElements() {
    elements.productSearch = document.getElementById('productSearch');
    elements.searchButton = document.getElementById('searchButton');
    elements.categoryFilter = document.getElementById('categoryFilter');
    elements.skinTypeFilter = document.getElementById('skinTypeFilter');
    elements.priceFilter = document.getElementById('priceFilter');
    elements.sortBy = document.getElementById('sortBy');
    elements.clearFilters = document.getElementById('clearFilters');
    elements.productsContainer = document.getElementById('productsContainer');
    elements.pagination = document.getElementById('pagination');
    elements.resultsCount = document.getElementById('resultsCount');
    elements.pageInfo = document.getElementById('pageInfo');
    elements.loadingIndicator = document.getElementById('loadingIndicator');
}

function attachEventListeners() {
    elements.searchButton.addEventListener('click', applyFiltersAndDisplay);
    
    // 検索入力にデバウンスを適用
    let searchTimeout;
    elements.productSearch.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            applyFiltersAndDisplay();
        }, 300);
    });
    
    elements.productSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            clearTimeout(searchTimeout);
            applyFiltersAndDisplay();
        }
    });
    
    elements.categoryFilter.addEventListener('change', applyFiltersAndDisplay);
    elements.skinTypeFilter.addEventListener('change', applyFiltersAndDisplay);
    elements.priceFilter.addEventListener('change', applyFiltersAndDisplay);
    elements.sortBy.addEventListener('change', applyFiltersAndDisplay);
    elements.clearFilters.addEventListener('click', clearAllFilters);
}

async function loadProducts() {
    elements.loadingIndicator.style.display = 'block';
    
    try {
        const response = await fetch('./assets/data/products.json');
        if (!response.ok) throw new Error('Failed to load products');
        
        allProducts = await response.json();
    } catch (error) {
        console.error('Error loading products:', error);
        elements.productsContainer.innerHTML = '<p class="error">製品データの読み込みに失敗しました。</p>';
    } finally {
        elements.loadingIndicator.style.display = 'none';
    }
}

function applyFiltersAndDisplay() {
    const searchTerm = elements.productSearch.value.toLowerCase();
    const category = elements.categoryFilter.value;
    const skinType = elements.skinTypeFilter.value;
    const priceRange = elements.priceFilter.value;
    
    // フィルタリング
    filteredProducts = allProducts.filter(product => {
        // 検索語によるフィルタリング
        if (searchTerm && !product.name.toLowerCase().includes(searchTerm) && 
            !product.brand.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // カテゴリーフィルター
        if (category && product.category !== category) {
            return false;
        }
        
        // 肌タイプフィルター
        if (skinType && !product.skinTypes.includes(skinType)) {
            return false;
        }
        
        // 価格フィルター
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(p => parseInt(p) || 0);
            if (max) {
                if (product.price < min || product.price > max) return false;
            } else {
                if (product.price < min) return false;
            }
        }
        
        return true;
    });
    
    // ソート
    sortProducts();
    
    // 結果を表示
    currentPage = 1;
    displayProducts();
    updatePagination();
}

function sortProducts() {
    const sortBy = elements.sortBy.value;
    
    switch(sortBy) {
        case 'rating-desc':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'rating-asc':
            filteredProducts.sort((a, b) => a.rating - b.rating);
            break;
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'reviews-desc':
            filteredProducts.sort((a, b) => b.reviews - a.reviews);
            break;
    }
}

function displayProducts() {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToDisplay = filteredProducts.slice(startIndex, endIndex);
    
    // 結果数を更新
    elements.resultsCount.textContent = filteredProducts.length;
    
    // ページ情報を更新
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (totalPages > 1 && elements.pageInfo) {
        elements.pageInfo.textContent = `(${currentPage}/${totalPages}ページ)`;
    } else if (elements.pageInfo) {
        elements.pageInfo.textContent = '';
    }
    
    // 製品カードを生成
    if (productsToDisplay.length === 0) {
        elements.productsContainer.innerHTML = '<p class="no-results">該当する製品が見つかりませんでした。</p>';
        return;
    }
    
    elements.productsContainer.innerHTML = productsToDisplay.map(product => createProductCard(product)).join('');
    
    // お気に入りボタンのイベントを設定
    attachProductCardEvents();
}

function createProductCard(product) {
    const isFavorite = window.cosmeticFinder?.state?.favorites?.includes(product.id) || false;
    const skinTypeLabels = product.skinTypes.map(type => getSkinTypeLabel(type)).join('、');
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-header">
                <h3>${product.name}</h3>
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-product-id="${product.id}">
                    ${isFavorite ? '❤️' : '🤍'}
                </button>
            </div>
            <div class="product-info">
                <p class="brand">${product.brand}</p>
                <p class="category">${product.category}</p>
                <p class="price">¥${product.price.toLocaleString()}</p>
                <p class="skin-types">${skinTypeLabels}</p>
            </div>
            <div class="product-description">
                <p>${product.description}</p>
            </div>
            <div class="product-ingredients">
                <p class="ingredients-label">主な成分:</p>
                <p class="ingredients">${product.ingredients.slice(0, 3).join('、')}...</p>
            </div>
            <div class="product-rating">
                <span class="stars">${getStarRating(product.rating)}</span>
                <span class="rating-number">${product.rating}</span>
                <span class="reviews">(${product.reviews}件)</span>
            </div>
            <button class="view-details-btn" onclick="viewProductDetails(${product.id})">詳細を見る</button>
        </div>
    `;
}

function getSkinTypeLabel(type) {
    const labels = {
        'dry': '乾燥肌',
        'oily': '脂性肌',
        'combination': '混合肌',
        'sensitive': '敏感肌',
        'normal': '普通肌',
        'mature': '年齢肌',
        'all': '全肌質'
    };
    return labels[type] || type;
}

function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? '⭐️' : '';
    const emptyStars = '☆'.repeat(5 - Math.ceil(rating));
    return '⭐️'.repeat(fullStars) + halfStar + emptyStars;
}

function attachProductCardEvents() {
    // お気に入りボタン
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            const isFavorite = window.toggleFavorite(productId);
            e.target.classList.toggle('active', isFavorite);
            e.target.textContent = isFavorite ? '❤️' : '🤍';
        });
    });
}

function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        elements.pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // 前へボタン
    if (currentPage > 1) {
        paginationHTML += `<button onclick="goToPage(${currentPage - 1})">前へ</button>`;
    }
    
    // ページ番号
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `<button onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span>...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button onclick="goToPage(${i})" ${i === currentPage ? 'class="active"' : ''}>${i}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span>...</span>`;
        }
        paginationHTML += `<button onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    // 次へボタン
    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="goToPage(${currentPage + 1})">次へ</button>`;
    }
    
    elements.pagination.innerHTML = paginationHTML;
}

function goToPage(page) {
    currentPage = page;
    displayProducts();
    updatePagination();
    
    // ページトップへスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clearAllFilters() {
    elements.productSearch.value = '';
    elements.categoryFilter.value = '';
    elements.skinTypeFilter.value = '';
    elements.priceFilter.value = '';
    elements.sortBy.value = 'rating-desc';
    
    applyFiltersAndDisplay();
}

// 製品詳細を表示
window.viewProductDetails = function(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // 製品詳細モーダルを表示（簡易版）
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>${product.name}</h2>
            <p class="brand">${product.brand}</p>
            <p class="category">${product.category}</p>
            <p class="price">¥${product.price.toLocaleString()}</p>
            <p class="description">${product.description}</p>
            <h4>成分:</h4>
            <ul class="ingredients-list">
                ${product.ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
            <div class="product-rating">
                <span class="stars">${getStarRating(product.rating)}</span>
                <span class="rating-number">${product.rating}</span>
                <span class="reviews">(${product.reviews}件のレビュー)</span>
            </div>
            <div class="modal-actions">
                <button onclick="addToFavorites(${product.id})">お気に入りに追加</button>
                <button onclick="analyzeProductIngredients(${product.id})">成分を解析</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

// お気に入りに追加
window.addToFavorites = function(productId) {
    const isFavorite = window.toggleFavorite(productId);
    alert(isFavorite ? 'お気に入りに追加しました' : 'お気に入りから削除しました');
};

// 製品の成分を解析
window.analyzeProductIngredients = function(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // 成分解析ページへリダイレクト（成分を自動入力）
    localStorage.setItem('analyzeIngredients', JSON.stringify(product.ingredients));
    window.location.href = './index.html#ingredient-checker';
};

// 診断結果を使用してフィルタリング
function applyDiagnosisFilters() {
    const diagnosisData = JSON.parse(localStorage.getItem('currentDiagnosis') || '{}');
    if (!diagnosisData.answers) {
        applyFiltersAndDisplay();
        return;
    }
    
    const answers = diagnosisData.answers;
    
    // 肌タイプでフィルタリング
    if (answers['skin-type']) {
        elements.skinTypeFilter.value = answers['skin-type'];
    }
    
    // 予算でフィルタリング
    if (answers['budget']) {
        switch(answers['budget']) {
            case 'low':
                elements.priceFilter.value = '0-3000';
                break;
            case 'medium':
                elements.priceFilter.value = '3000-10000';
                break;
            case 'high':
                elements.priceFilter.value = '10000-20000';
                break;
            case 'premium':
                elements.priceFilter.value = '20000-';
                break;
        }
    }
    
    // 診断結果に基づいてスコアリング
    filteredProducts = allProducts.map(product => {
        let score = 0;
        
        // 肌タイプマッチング
        if (product.skinTypes.includes(answers['skin-type'])) {
            score += 30;
        }
        
        // 敏感度考慮
        if (answers['sensitivity'] === 'very-sensitive' || answers['sensitivity'] === 'sensitive') {
            // 低刺激製品を優先
            if (product.skinTypes.includes('sensitive')) {
                score += 20;
            }
            // アレルゲン成分をチェック（仮の実装）
            const hasAllergens = product.ingredients.some(ing => 
                ['香料', 'パラベン', 'エタノール'].includes(ing)
            );
            if (!hasAllergens) {
                score += 10;
            }
        }
        
        // 肌の悩みに対応
        if (answers['skin-concerns']) {
            const concernMapping = {
                'acne': ['サリチル酸', 'ティーツリーオイル', 'ナイアシンアミド'],
                'wrinkles': ['レチノール', 'ペプチド', 'コラーゲン'],
                'spots': ['ビタミンC', 'アルブチン', 'ナイアシンアミド'],
                'pores': ['ナイアシンアミド', 'サリチル酸', 'BHA']
            };
            
            const targetIngredients = concernMapping[answers['skin-concerns']] || [];
            const matchingIngredients = product.ingredients.filter(ing => 
                targetIngredients.some(target => ing.includes(target))
            );
            score += matchingIngredients.length * 10;
        }
        
        // テクスチャー好み
        if (answers['texture-preference'] && answers['texture-preference'] !== 'no-preference') {
            const textureMapping = {
                'light': ['ローション', 'ミスト', 'ジェル'],
                'rich': ['クリーム', 'バーム', 'オイル'],
                'gel': ['ジェル', 'アクアジェル']
            };
            
            const preferredTextures = textureMapping[answers['texture-preference']] || [];
            if (preferredTextures.some(texture => product.name.includes(texture))) {
                score += 15;
            }
        }
        
        // 評価を考慮
        score += product.rating * 5;
        
        return { ...product, diagnosisScore: score };
    });
    
    // スコアでソート
    filteredProducts.sort((a, b) => b.diagnosisScore - a.diagnosisScore);
    
    // 診断メッセージを表示
    showDiagnosisMessage(diagnosisData);
    
    // 結果を表示
    currentPage = 1;
    displayProducts();
    updatePagination();
}

// 診断メッセージを表示
function showDiagnosisMessage(diagnosisData) {
    const resultsContainer = document.querySelector('.results-summary');
    if (!resultsContainer) return;
    
    const skinTypeLabels = {
        'dry': '乾燥肌',
        'oily': '脂性肌',
        'combination': '混合肌',
        'sensitive': '敏感肌',
        'normal': '普通肌'
    };
    
    const skinType = skinTypeLabels[diagnosisData.answers['skin-type']] || '';
    
    const message = document.createElement('div');
    message.className = 'diagnosis-message';
    message.innerHTML = `
        <p><strong>診断結果に基づくおすすめ製品</strong></p>
        <p>あなたの肌タイプ：${skinType}</p>
        <p>以下の製品があなたに最適です。</p>
    `;
    
    resultsContainer.insertBefore(message, resultsContainer.firstChild);
}