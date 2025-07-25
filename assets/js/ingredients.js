// 成分解析ロジック
let ingredientsDatabase = {};

// 成分データベースの読み込み
document.addEventListener('DOMContentLoaded', async () => {
    await loadIngredientsDatabase();
    
    const analyzeButton = document.getElementById('analyzeIngredients');
    if (analyzeButton) {
        analyzeButton.addEventListener('click', analyzeIngredients);
    }
});

async function loadIngredientsDatabase() {
    try {
        const response = await fetch('./assets/data/ingredients.json');
        if (response.ok) {
            ingredientsDatabase = await response.json();
        }
    } catch (error) {
        console.error('Failed to load ingredients database:', error);
        // フォールバックデータ
        ingredientsDatabase = getDefaultIngredientsDatabase();
    }
}

function getDefaultIngredientsDatabase() {
    return {
        "水": { safety: 5, category: "溶剤", description: "最も一般的な溶剤", allergen: false },
        "グリセリン": { safety: 5, category: "保湿剤", description: "肌に潤いを与える保湿成分", allergen: false },
        "ヒアルロン酸": { safety: 5, category: "保湿剤", description: "高い保水力を持つ保湿成分", allergen: false },
        "セラミド": { safety: 5, category: "保湿剤", description: "肌のバリア機能をサポート", allergen: false },
        "コラーゲン": { safety: 4, category: "保湿剤", description: "肌にハリを与える成分", allergen: false },
        "ビタミンC": { safety: 4, category: "抗酸化剤", description: "美白効果のある成分", allergen: false },
        "レチノール": { safety: 3, category: "抗老化", description: "シワ改善に効果的だが刺激性あり", allergen: false },
        "エタノール": { safety: 3, category: "溶剤", description: "清涼感を与えるが乾燥を招く可能性", allergen: false },
        "パラベン": { safety: 3, category: "防腐剤", description: "製品の保存性を高める", allergen: true },
        "香料": { safety: 2, category: "香料", description: "アレルギーを引き起こす可能性", allergen: true },
        "着色料": { safety: 2, category: "着色剤", description: "見た目を良くするが刺激の可能性", allergen: true },
        "BHT": { safety: 2, category: "酸化防止剤", description: "製品の酸化を防ぐ", allergen: false },
        "フェノキシエタノール": { safety: 3, category: "防腐剤", description: "パラベンの代替防腐剤", allergen: false },
        "ナイアシンアミド": { safety: 5, category: "美白剤", description: "肌のトーンを整える", allergen: false },
        "アロエベラ": { safety: 5, category: "鎮静剤", description: "肌を落ち着かせる天然成分", allergen: false },
        "ティーツリーオイル": { safety: 3, category: "抗菌剤", description: "ニキビケアに効果的", allergen: true },
        "サリチル酸": { safety: 3, category: "角質除去", description: "毛穴の詰まりを改善", allergen: false },
        "尿素": { safety: 4, category: "保湿剤", description: "角質を柔らかくする", allergen: false },
        "スクワラン": { safety: 5, category: "エモリエント", description: "肌になじみやすい保湿成分", allergen: false },
        "シアバター": { safety: 5, category: "エモリエント", description: "濃厚な保湿効果", allergen: false }
    };
}

function analyzeIngredients() {
    const input = document.getElementById('ingredientInput');
    const resultsContainer = document.getElementById('ingredientResults');
    
    if (!input || !resultsContainer) return;
    
    const ingredientsList = input.value
        .split(/[,、\n]/)
        .map(ing => ing.trim())
        .filter(ing => ing.length > 0);
    
    if (ingredientsList.length === 0) {
        resultsContainer.innerHTML = '<p>成分を入力してください。</p>';
        return;
    }
    
    const analysis = ingredientsList.map(ingredient => {
        return analyzeIngredient(ingredient);
    });
    
    displayAnalysisResults(analysis, resultsContainer);
    
    // 解析履歴を保存
    saveAnalysisHistory(ingredientsList, analysis);
}

function analyzeIngredient(ingredient) {
    const normalizedIngredient = normalizeIngredientName(ingredient);
    const data = ingredientsDatabase[normalizedIngredient];
    
    if (data) {
        return {
            name: ingredient,
            normalized: normalizedIngredient,
            ...data,
            found: true
        };
    }
    
    // データベースにない場合は類似成分を検索
    const similar = findSimilarIngredient(normalizedIngredient);
    if (similar) {
        return {
            name: ingredient,
            normalized: normalizedIngredient,
            ...similar.data,
            found: true,
            similarTo: similar.name
        };
    }
    
    return {
        name: ingredient,
        normalized: normalizedIngredient,
        safety: 0,
        category: "不明",
        description: "データベースに情報がありません",
        allergen: false,
        found: false
    };
}

function normalizeIngredientName(name) {
    return name
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[・]/g, '')
        .trim();
}

function findSimilarIngredient(normalizedName) {
    const threshold = 0.8; // 類似度の閾値
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [key, value] of Object.entries(ingredientsDatabase)) {
        const score = calculateSimilarity(normalizedName, key.toLowerCase());
        if (score > threshold && score > bestScore) {
            bestMatch = { name: key, data: value };
            bestScore = score;
        }
    }
    
    return bestMatch;
}

function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = getEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
}

function getEditDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

function displayAnalysisResults(analysis, container) {
    const safetyLabels = {
        5: { text: '非常に安全', class: 'safety-high' },
        4: { text: '安全', class: 'safety-high' },
        3: { text: '普通', class: 'safety-medium' },
        2: { text: '注意', class: 'safety-medium' },
        1: { text: '要注意', class: 'safety-low' },
        0: { text: '不明', class: 'safety-low' }
    };
    
    // 全体評価
    const overallSafety = calculateOverallSafety(analysis);
    const allergenCount = analysis.filter(ing => ing.allergen).length;
    
    let html = `
        <div class="analysis-summary">
            <h4>解析結果サマリー</h4>
            <p>総合安全性スコア: <strong>${overallSafety.toFixed(1)}/5.0</strong></p>
            <p>アレルゲン成分: <strong>${allergenCount}個</strong></p>
        </div>
        <div class="ingredient-list">
            <h4>成分詳細</h4>
    `;
    
    analysis.forEach(ingredient => {
        const safety = safetyLabels[ingredient.safety];
        html += `
            <div class="ingredient-item">
                <div class="ingredient-info">
                    <strong>${ingredient.name}</strong>
                    ${ingredient.similarTo ? `<small>(${ingredient.similarTo}として解析)</small>` : ''}
                    <br>
                    <small>${ingredient.category} - ${ingredient.description}</small>
                    ${ingredient.allergen ? '<br><small class="allergen-warning">⚠️ アレルゲンの可能性</small>' : ''}
                </div>
                <div class="safety-badge ${safety.class}">
                    ${safety.text}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // 推奨事項
    html += generateRecommendations(analysis);
    
    container.innerHTML = html;
}

function calculateOverallSafety(analysis) {
    const validIngredients = analysis.filter(ing => ing.found);
    if (validIngredients.length === 0) return 0;
    
    const totalSafety = validIngredients.reduce((sum, ing) => sum + ing.safety, 0);
    return totalSafety / validIngredients.length;
}

function generateRecommendations(analysis) {
    const recommendations = [];
    const allergens = analysis.filter(ing => ing.allergen);
    const lowSafety = analysis.filter(ing => ing.safety <= 2 && ing.found);
    
    if (allergens.length > 0) {
        recommendations.push('アレルゲンとなる可能性のある成分が含まれています。敏感肌の方は注意してください。');
    }
    
    if (lowSafety.length > 0) {
        recommendations.push('刺激性のある成分が含まれています。使用前にパッチテストを推奨します。');
    }
    
    const overallSafety = calculateOverallSafety(analysis);
    if (overallSafety >= 4) {
        recommendations.push('全体的に安全性の高い成分構成です。');
    } else if (overallSafety >= 3) {
        recommendations.push('一般的な安全性レベルの製品です。');
    } else {
        recommendations.push('敏感肌の方には刺激が強い可能性があります。');
    }
    
    if (recommendations.length === 0) return '';
    
    return `
        <div class="recommendations">
            <h4>推奨事項</h4>
            <ul>
                ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    `;
}

function saveAnalysisHistory(ingredients, analysis) {
    const history = window.cosmeticFinder.storage.get('analysisHistory') || [];
    const newEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ingredients,
        analysis: analysis.map(a => ({
            name: a.name,
            safety: a.safety,
            category: a.category,
            allergen: a.allergen
        })),
        overallSafety: calculateOverallSafety(analysis)
    };
    
    history.unshift(newEntry);
    if (history.length > 20) history.pop(); // 最大20件
    
    window.cosmeticFinder.storage.set('analysisHistory', history);
}