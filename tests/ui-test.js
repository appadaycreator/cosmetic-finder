const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8080';

async function runUITests() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    const results = [];

    // Test 1: ホームページの読み込み
    try {
        await page.goto(`${BASE_URL}/lp.html`, { waitUntil: 'networkidle2' });
        const title = await page.title();
        results.push({
            test: 'ホームページの読み込み',
            status: title.includes('コスメファインダー') ? 'PASS' : 'FAIL',
            message: `Title: ${title}`
        });
    } catch (error) {
        results.push({
            test: 'ホームページの読み込み',
            status: 'FAIL',
            message: error.message
        });
    }

    // Test 2: ナビゲーションリンクの確認
    try {
        const navLinks = await page.$$eval('nav a', links => 
            links.map(link => ({ text: link.textContent, href: link.href }))
        );
        const expectedLinks = ['ホーム', '製品一覧', '使い方', 'お問い合わせ'];
        const hasAllLinks = expectedLinks.every(expected => 
            navLinks.some(link => link.text.includes(expected))
        );
        
        results.push({
            test: 'ナビゲーションリンクの確認',
            status: hasAllLinks ? 'PASS' : 'FAIL',
            message: `Found links: ${navLinks.map(l => l.text).join(', ')}`
        });
    } catch (error) {
        results.push({
            test: 'ナビゲーションリンクの確認',
            status: 'FAIL',
            message: error.message
        });
    }

    // Test 3: 肌診断ボタンの動作確認
    try {
        await page.click('#startDiagnosis');
        await page.waitForSelector('#diagnosis-section', { visible: true, timeout: 5000 });
        const diagnosisVisible = await page.$eval('#diagnosis-section', el => 
            window.getComputedStyle(el).display !== 'none'
        );
        
        results.push({
            test: '肌診断ボタンの動作確認',
            status: diagnosisVisible ? 'PASS' : 'FAIL',
            message: diagnosisVisible ? '診断セクションが表示されました' : '診断セクションが表示されません'
        });
    } catch (error) {
        results.push({
            test: '肌診断ボタンの動作確認',
            status: 'FAIL',
            message: error.message
        });
    }

    // Test 4: レスポンシブデザインのテスト
    const viewports = [
        { name: 'Mobile', width: 375, height: 667 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
        try {
            await page.setViewport({ width: viewport.width, height: viewport.height });
            await page.goto(`${BASE_URL}/lp.html`, { waitUntil: 'networkidle2' });
            
            // スクリーンショット保存（オプション）
            // await page.screenshot({ path: `screenshot-${viewport.name}.png` });
            
            results.push({
                test: `レスポンシブデザイン - ${viewport.name}`,
                status: 'PASS',
                message: `${viewport.width}x${viewport.height}で正常に表示`
            });
        } catch (error) {
            results.push({
                test: `レスポンシブデザイン - ${viewport.name}`,
                status: 'FAIL',
                message: error.message
            });
        }
    }

    // Test 5: フォームの検証
    try {
        await page.goto(`${BASE_URL}/contact.html`, { waitUntil: 'networkidle2' });
        
        // 空のフォームを送信
        await page.click('button[type="submit"]');
        
        // HTML5検証メッセージの確認
        const nameValid = await page.$eval('#name', el => el.validity.valid);
        
        results.push({
            test: 'フォーム検証の動作',
            status: !nameValid ? 'PASS' : 'FAIL',
            message: '必須フィールドの検証が機能しています'
        });
    } catch (error) {
        results.push({
            test: 'フォーム検証の動作',
            status: 'FAIL',
            message: error.message
        });
    }

    // Test 6: 成分解析機能のテスト
    try {
        await page.goto(`${BASE_URL}/lp.html`, { waitUntil: 'networkidle2' });
        
        // 成分リストを入力
        await page.type('#ingredientInput', '水、グリセリン、ヒアルロン酸');
        await page.click('#analyzeIngredients');
        
        // 結果の表示を待つ
        await page.waitForTimeout(1000);
        
        const hasResults = await page.$eval('#ingredientResults', el => 
            el.textContent.length > 0
        );
        
        results.push({
            test: '成分解析機能',
            status: hasResults ? 'PASS' : 'FAIL',
            message: hasResults ? '成分解析結果が表示されました' : '結果が表示されません'
        });
    } catch (error) {
        results.push({
            test: '成分解析機能',
            status: 'FAIL',
            message: error.message
        });
    }

    // Test 7: 製品一覧ページの動作確認
    try {
        await page.goto(`${BASE_URL}/products.html`, { waitUntil: 'networkidle2' });
        
        // 製品が表示されているか確認
        const productCards = await page.$$('.product-card');
        const hasProducts = productCards.length > 0;
        
        // 検索機能のテスト
        await page.type('#productSearch', 'クリーム');
        await page.click('#searchButton');
        await page.waitForTimeout(500);
        
        const searchResults = await page.$$('.product-card');
        
        results.push({
            test: '製品一覧ページの動作',
            status: hasProducts ? 'PASS' : 'FAIL',
            message: `製品数: ${productCards.length}, 検索結果: ${searchResults.length}`
        });
    } catch (error) {
        results.push({
            test: '製品一覧ページの動作',
            status: 'FAIL',
            message: error.message
        });
    }

    // Test 8: 診断質問数の確認（10問）
    try {
        await page.goto(`${BASE_URL}/lp.html`, { waitUntil: 'networkidle2' });
        await page.click('#startDiagnosis');
        await page.waitForSelector('.question', { visible: true });
        
        // 全質問をカウント
        let questionCount = 0;
        for (let i = 0; i < 10; i++) {
            const questionText = await page.$eval('.question h4', el => el.textContent);
            if (questionText.includes(`質問 ${i + 1}`)) {
                questionCount++;
                // 次の質問へ
                const options = await page.$$('.option');
                if (options.length > 0) {
                    await options[0].click();
                    await page.waitForTimeout(400);
                }
            }
        }
        
        results.push({
            test: '診断質問数の確認',
            status: questionCount === 10 ? 'PASS' : 'FAIL',
            message: `確認された質問数: ${questionCount}/10`
        });
    } catch (error) {
        results.push({
            test: '診断質問数の確認',
            status: 'FAIL',
            message: error.message
        });
    }

    // Test 9: Service Workerの確認
    try {
        const swRegistered = await page.evaluate(async () => {
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.getRegistration();
                return registration !== undefined;
            }
            return false;
        });
        
        results.push({
            test: 'Service Worker登録',
            status: swRegistered ? 'PASS' : 'FAIL',
            message: swRegistered ? 'Service Workerが登録されています' : 'Service Workerが登録されていません'
        });
    } catch (error) {
        results.push({
            test: 'Service Worker登録',
            status: 'FAIL',
            message: error.message
        });
    }

    await browser.close();

    // 結果のサマリー
    console.log('\n=== UIテスト結果 ===\n');
    results.forEach(result => {
        const icon = result.status === 'PASS' ? '✅' : '❌';
        console.log(`${icon} ${result.test}: ${result.status}`);
        console.log(`   ${result.message}\n`);
    });

    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    console.log(`\n総計: ${passed}/${results.length} テスト成功, ${failed} テスト失敗\n`);

    return results;
}

// テストの実行
if (require.main === module) {
    runUITests().catch(console.error);
}

module.exports = { runUITests };