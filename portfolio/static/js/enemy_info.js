// JSONデータを取得
fetch('/static/data/dino_mutant.json')
    .then(res => res.json())
    .then(data => {
        // data は [ {level: 1120, ...}, {level: 1121, ...} ] のような配列
        const areaList = document.getElementById('area-list');
        areaList.innerHTML = ''; // 初期化

        if (!data) return;

        // データが配列（make_json.pyで作ったフラットなリスト）の場合
        if (Array.isArray(data)) {
            if (data.length === 0) return;
            data.sort((a, b) => a.level - b.level);
            const minLv = data[0].level;
            const maxLv = data[data.length - 1].level;
            createAccordion(areaList, `${minLv} ～ ${maxLv}`, data);
        }
        // データがオブジェクト（dino_mutant.jsonにあるようなグループ化されたデータ）の場合
        else {
            Object.keys(data).forEach(label => {
                createAccordion(areaList, label, data[label]);
            });
        }
    })
    .catch(err => {
        console.error('JSON読み込みエラー:', err);
        document.getElementById('area-list').textContent = 'データの読み込みに失敗しました';
    });

/**
 * アコーディオンを作成して表示する関数
 * @param {HTMLElement} parent - 追加先の親要素
 * @param {string} label - ボタンに表示する範囲テキスト
 * @param {Array} items - その範囲に含まれるデータのリスト
 */
function createAccordion(parent, label, items) {
    // 1. 全体を囲むコンテナ
    const container = document.createElement('div');

    // 2. 範囲を表示するボタン（親アコーディオン）
    const rangeBtn = document.createElement('button');
    rangeBtn.textContent = label;

    // 3. レベル一覧が入るコンテナ（初期状態は非表示）
    const levelsContainer = document.createElement('div');
    levelsContainer.style.display = 'none'; // 最初は隠す

    // 範囲ボタンをクリックした時の動作
    rangeBtn.onclick = () => {
        // 表示/非表示を切り替え
        if (levelsContainer.style.display === 'none') {
            levelsContainer.style.display = 'block';
        } else {
            levelsContainer.style.display = 'none';
        }
    };

    // コンテナにボタンとリストを追加
    container.appendChild(rangeBtn);
    container.appendChild(levelsContainer);
    parent.appendChild(container);

    // 4. 各レベルごとのボタンを作成（子アコーディオン）
    items.forEach(item => {
        const levelItem = document.createElement('div');

        // レベルボタン
        const levelBtn = document.createElement('button');
        levelBtn.textContent = `Lv.${item.level}`;

        // 詳細情報のコンテナ（初期状態は非表示）
        const detailDiv = document.createElement('div');
        detailDiv.style.display = 'none'; // 最初は隠す

        // 詳細情報の中身（HTML）
        detailDiv.innerHTML = `
                    <ul>
                        <li>肉: ${item.niku}</li>
                        <li>藁: ${item.wara}</li>
                        <li>皮: ${item.kawa}</li>
                        <li>爪: ${item.tume}</li>
                        <li>クリスタル: ${item.cry}</li>
                        <li>敵HP: ${item.enemy_hp}</li>
                        <li>敵攻撃力: ${item.enemy_atk}</li>
                        <li>ワンパン必要攻撃力: ${item.one_shot_atk}</li>
                    </ul>
                `;

        // レベルボタンをクリックした時の動作
        levelBtn.onclick = () => {
            // 詳細の表示/非表示を切り替え
            detailDiv.style.display = detailDiv.style.display === 'none' ? 'block' : 'none';
        };

        // 要素を組み立てる
        levelItem.appendChild(levelBtn);
        levelItem.appendChild(detailDiv);
        levelsContainer.appendChild(levelItem);
    });
}
