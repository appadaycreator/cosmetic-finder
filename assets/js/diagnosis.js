// 肌質診断ロジック
const diagnosisQuestions = [
    {
        id: 'skin-type',
        question: 'あなたの肌質は？',
        options: [
            { value: 'dry', label: '乾燥肌' },
            { value: 'oily', label: '脂性肌' },
            { value: 'combination', label: '混合肌' },
            { value: 'sensitive', label: '敏感肌' },
            { value: 'normal', label: '普通肌' }
        ]
    },
    {
        id: 'age-range',
        question: '年齢層を教えてください',
        options: [
            { value: '10s', label: '10代' },
            { value: '20s', label: '20代' },
            { value: '30s', label: '30代' },
            { value: '40s', label: '40代' },
            { value: '50s+', label: '50代以上' }
        ]
    },
    {
        id: 'skin-concerns',
        question: '主な肌の悩みは？',
        options: [
            { value: 'acne', label: 'ニキビ・吹き出物' },
            { value: 'wrinkles', label: 'シワ・たるみ' },
            { value: 'spots', label: 'シミ・くすみ' },
            { value: 'pores', label: '毛穴の開き' },
            { value: 'none', label: '特になし' }
        ]
    },
    {
        id: 'sensitivity',
        question: '肌の敏感度は？',
        options: [
            { value: 'very-sensitive', label: 'とても敏感' },
            { value: 'sensitive', label: 'やや敏感' },
            { value: 'normal', label: '普通' },
            { value: 'resistant', label: '丈夫' }
        ]
    },
    {
        id: 'environment',
        question: '主な生活環境は？',
        options: [
            { value: 'urban', label: '都市部' },
            { value: 'suburban', label: '郊外' },
            { value: 'rural', label: '田舎' },
            { value: 'coastal', label: '海沿い' }
        ]
    },
    {
        id: 'routine-time',
        question: 'スキンケアにかけられる時間は？',
        options: [
            { value: 'minimal', label: '最小限（5分以内）' },
            { value: 'moderate', label: '適度（5-10分）' },
            { value: 'extensive', label: 'しっかり（10分以上）' }
        ]
    },
    {
        id: 'budget',
        question: '化粧品の予算は？（月額）',
        options: [
            { value: 'low', label: '〜3,000円' },
            { value: 'medium', label: '3,000円〜10,000円' },
            { value: 'high', label: '10,000円〜20,000円' },
            { value: 'premium', label: '20,000円以上' }
        ]
    },
    {
        id: 'ingredient-preference',
        question: '成分へのこだわりは？',
        options: [
            { value: 'natural', label: '天然・オーガニック重視' },
            { value: 'scientific', label: '科学的効果重視' },
            { value: 'hypoallergenic', label: '低刺激性重視' },
            { value: 'no-preference', label: '特にこだわりなし' }
        ]
    },
    {
        id: 'texture-preference',
        question: '好みのテクスチャーは？',
        options: [
            { value: 'light', label: 'さっぱり・軽い' },
            { value: 'rich', label: 'しっとり・濃厚' },
            { value: 'gel', label: 'ジェル状' },
            { value: 'no-preference', label: '特にこだわりなし' }
        ]
    },
    {
        id: 'fragrance',
        question: '香りの好みは？',
        options: [
            { value: 'fragrance-free', label: '無香料' },
            { value: 'natural', label: '天然の香り' },
            { value: 'light', label: '軽い香り' },
            { value: 'no-preference', label: 'こだわらない' }
        ]
    }
];

let currentQuestionIndex = 0;
let answers = {};

// 診断開始
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startDiagnosis');
    if (startButton) {
        startButton.addEventListener('click', startDiagnosis);
    }
});

function startDiagnosis() {
    const diagnosisSection = document.getElementById('diagnosis-section');
    const diagnosisContent = document.getElementById('diagnosis-content');
    
    if (!diagnosisSection || !diagnosisContent) return;
    
    diagnosisSection.style.display = 'block';
    currentQuestionIndex = 0;
    answers = {};
    
    showQuestion();
}

function showQuestion() {
    const diagnosisContent = document.getElementById('diagnosis-content');
    if (!diagnosisContent) return;
    
    if (currentQuestionIndex >= diagnosisQuestions.length) {
        showResults();
        return;
    }
    
    const question = diagnosisQuestions[currentQuestionIndex];
    
    diagnosisContent.innerHTML = `
        <div class="question">
            <h4>質問 ${currentQuestionIndex + 1} / ${diagnosisQuestions.length}</h4>
            <p>${question.question}</p>
            <div class="options">
                ${question.options.map((option, index) => `
                    <div class="option" data-value="${option.value}" tabindex="0" role="button" aria-label="${option.label}">
                        <span class="option-number">${index + 1}.</span> ${option.label}
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 20px;">
                ${currentQuestionIndex > 0 ? '<button onclick="previousQuestion()">戻る</button>' : ''}
            </div>
            <div class="diagnosis-keyboard-hint">
                <p>💡 キーボード操作: 
                <code>1-${question.options.length}</code> 数字キーで選択 | 
                <code>↑↓</code> 矢印キーで移動 | 
                <code>Enter</code> 次へ進む</p>
            </div>
        </div>
    `;
    
    // オプションクリックイベント
    const options = diagnosisContent.querySelectorAll('.option');
    options.forEach((option, index) => {
        option.addEventListener('click', () => {
            selectOption(option);
        });
        
        // 最初のオプションにフォーカスを設定
        if (index === 0) {
            option.focus();
        }
    });
    
    // キーボードイベントリスナーを追加
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            const selectedOption = diagnosisContent.querySelector('.option.selected');
            if (selectedOption) {
                // 既に選択されている場合は次へ進む
                proceedToNext();
            } else {
                // 何も選択されていない場合は最初のオプションを選択
                const firstOption = diagnosisContent.querySelector('.option');
                if (firstOption) {
                    selectOption(firstOption);
                }
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            navigateOptions(e.key === 'ArrowDown' ? 1 : -1);
        } else if (e.key >= '1' && e.key <= '9') {
            // 数字キーで選択
            const optionIndex = parseInt(e.key) - 1;
            const targetOption = options[optionIndex];
            if (targetOption) {
                selectOption(targetOption);
            }
        }
    };
    
    // イベントリスナーを追加（既存のものがあれば削除）
    document.removeEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleKeyPress);
}

function selectOption(optionElement) {
    const value = optionElement.dataset.value;
    const questionId = diagnosisQuestions[currentQuestionIndex].id;
    
    // 選択状態の更新
    const options = optionElement.parentElement.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));
    optionElement.classList.add('selected');
    
    // 回答を保存
    answers[questionId] = value;
    
    // 次の質問へ
    setTimeout(() => {
        proceedToNext();
    }, 300);
}

function proceedToNext() {
    currentQuestionIndex++;
    showQuestion();
}

function navigateOptions(direction) {
    const options = document.querySelectorAll('.option');
    const currentSelected = document.querySelector('.option.selected');
    let currentIndex = currentSelected ? Array.from(options).indexOf(currentSelected) : -1;
    
    // 新しいインデックスを計算
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = options.length - 1;
    if (newIndex >= options.length) newIndex = 0;
    
    // 選択状態を更新
    options.forEach(opt => opt.classList.remove('selected'));
    options[newIndex].classList.add('selected');
    options[newIndex].focus();
    
    // 回答を保存
    const value = options[newIndex].dataset.value;
    const questionId = diagnosisQuestions[currentQuestionIndex].id;
    answers[questionId] = value;
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

function showResults() {
    const diagnosisContent = document.getElementById('diagnosis-content');
    if (!diagnosisContent) return;
    
    // 診断結果の計算
    const result = calculateDiagnosisResult(answers);
    
    // 結果を保存
    const savedResult = window.saveDiagnosisResult({
        answers,
        result,
        recommendations: result.recommendations
    });
    
    diagnosisContent.innerHTML = `
        <div class="diagnosis-result">
            <h3>診断結果</h3>
            <div class="result-summary">
                <h4>あなたの肌タイプ: ${result.skinTypeLabel}</h4>
                <p>${result.description}</p>
            </div>
            
            <div class="recommendations">
                <h4>おすすめのスキンケア</h4>
                <ul>
                    ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            
            <div class="product-suggestions">
                <h4>おすすめ製品カテゴリー</h4>
                <div class="product-categories">
                    ${result.productCategories.map(cat => `
                        <div class="category-card">
                            <h5>${cat.name}</h5>
                            <p>${cat.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="actions">
                <button onclick="viewRecommendedProducts()">おすすめ製品を見る</button>
                <button onclick="restartDiagnosis()">もう一度診断する</button>
                <button onclick="shareDiagnosis()">結果をシェアする</button>
            </div>
        </div>
    `;
}

function calculateDiagnosisResult(answers) {
    const skinType = answers['skin-type'];
    const age = answers['age-range'];
    const concerns = answers['skin-concerns'];
    const sensitivity = answers['sensitivity'];
    
    // 肌タイプラベル
    const skinTypeLabels = {
        'dry': '乾燥肌',
        'oily': '脂性肌',
        'combination': '混合肌',
        'sensitive': '敏感肌',
        'normal': '普通肌'
    };
    
    // 基本的な推奨事項
    const baseRecommendations = {
        'dry': [
            '保湿力の高いクリームを使用する',
            'セラミド配合の製品を選ぶ',
            '洗顔は1日1回程度に控える'
        ],
        'oily': [
            '軽いテクスチャーの製品を使用する',
            'ノンコメドジェニック製品を選ぶ',
            '適度な洗顔で皮脂をコントロール'
        ],
        'combination': [
            'Tゾーンと頬で使い分ける',
            'バランスの取れた保湿を心がける',
            '季節に応じてケアを調整'
        ],
        'sensitive': [
            '低刺激性の製品を選ぶ',
            'パッチテストを必ず行う',
            'シンプルなケアを心がける'
        ],
        'normal': [
            '基本的なケアを継続する',
            '季節に応じて調整する',
            '予防的なケアを取り入れる'
        ]
    };
    
    // 製品カテゴリーの推奨
    const productCategories = getRecommendedCategories(skinType, concerns, age);
    
    return {
        skinType,
        skinTypeLabel: skinTypeLabels[skinType],
        description: getPersonalizedDescription(answers),
        recommendations: baseRecommendations[skinType] || [],
        productCategories
    };
}

function getPersonalizedDescription(answers) {
    const skinType = answers['skin-type'];
    const age = answers['age-range'];
    const concerns = answers['skin-concerns'];
    
    let description = `あなたは${age}の${getSkinTypeDescription(skinType)}です。`;
    
    if (concerns !== 'none') {
        description += `主な肌の悩みとして${getConcernDescription(concerns)}があるため、それに対応したケアが重要です。`;
    }
    
    return description;
}

function getSkinTypeDescription(type) {
    const descriptions = {
        'dry': '乾燥肌で、保湿を重視したケアが必要',
        'oily': '脂性肌で、皮脂コントロールが重要',
        'combination': '混合肌で、部位に応じたケアが必要',
        'sensitive': '敏感肌で、刺激の少ない製品選びが大切',
        'normal': '普通肌で、バランスの取れたケアが理想的'
    };
    return descriptions[type] || '';
}

function getConcernDescription(concern) {
    const descriptions = {
        'acne': 'ニキビ・吹き出物',
        'wrinkles': 'シワ・たるみ',
        'spots': 'シミ・くすみ',
        'pores': '毛穴の開き'
    };
    return descriptions[concern] || '';
}

function getRecommendedCategories(skinType, concerns, age) {
    const categories = [];
    
    // 基本カテゴリー
    categories.push({
        name: 'クレンジング',
        description: skinType === 'oily' ? 'さっぱりタイプ' : 'しっとりタイプ'
    });
    
    categories.push({
        name: '化粧水',
        description: skinType === 'dry' ? '高保湿タイプ' : 'さっぱりタイプ'
    });
    
    // 悩み別カテゴリー
    if (concerns === 'acne') {
        categories.push({
            name: 'ニキビケア',
            description: '抗炎症成分配合'
        });
    } else if (concerns === 'wrinkles') {
        categories.push({
            name: 'エイジングケア',
            description: 'レチノール・ペプチド配合'
        });
    } else if (concerns === 'spots') {
        categories.push({
            name: '美白ケア',
            description: 'ビタミンC誘導体配合'
        });
    }
    
    return categories;
}

async function viewRecommendedProducts() {
    // 製品推奨ページへの遷移
    const diagnosisData = {
        answers: answers,
        result: calculateDiagnosisResult(answers)
    };
    
    // 診断結果をローカルストレージに保存
    localStorage.setItem('currentDiagnosis', JSON.stringify(diagnosisData));
    
    // 製品一覧ページへ遷移（診断結果でフィルタリング）
    window.location.href = '/products.html?diagnosis=true';
}

function restartDiagnosis() {
    currentQuestionIndex = 0;
    answers = {};
    showQuestion();
}

function shareDiagnosis() {
    // シェア機能（実装により異なる）
    if (navigator.share) {
        navigator.share({
            title: 'コスメファインダー診断結果',
            text: '私の肌タイプ診断結果をチェック！',
            url: window.location.href
        });
    } else {
        alert('シェア機能は準備中です');
    }
}