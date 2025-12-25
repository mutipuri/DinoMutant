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
            data.sort((a, b) => {
                const getVal = v => typeof v === 'string' ? parseInt(v.replace(/,/g, ''), 10) : v;
                return getVal(a.level) - getVal(b.level);
            });
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
    rangeBtn.className = 'btn w-100 text-start mb-2 fw-bold border border-2 shadow py-3 px-4';
    rangeBtn.innerHTML = `<span class="fs-4">${label}</span>`;

    // 3. レベル一覧が入るコンテナ（初期状態は非表示）
    const levelsContainer = document.createElement('div');
    levelsContainer.className = 'p-3 mb-4 bg-light rounded border shadow-sm'; // コンテナのデザイン
    levelsContainer.style.display = 'none'; // 最初は隠す

    // 特定の範囲に色を付ける
    if (items.length > 0) {
        const parseLv = v => typeof v === 'string' ? parseInt(v.replace(/,/g, ''), 10) : v;
        const start = parseLv(items[0].level);
        const end = parseLv(items[items.length - 1].level);

        let bgColor = '#fff';
        let containerColor = '#fff';

        if (start === 1120 && end === 1156) {
            bgColor = '#3c8eecff'; // 水色
            containerColor = '#c5e0fc'; // 薄い水色
        } else if (start === 2070 && end === 2144) {
            bgColor = '#81ddf2ff'; // 黄緑色
            containerColor = '#d9f5fc'; // 薄い黄緑色
        } else if (start === 2148 && end === 2302) {
            bgColor = '#7ef67cff'; // 黄色
            containerColor = '#d8fcd8'; // 薄い黄色
        } else if (start === 2306 && end === 2381) {
            bgColor = '#e9f982ff'; // オレンジ
            containerColor = '#f9fcd9'; // 薄いオレンジ
        } else if (start === 2385 && end === 2499) {
            bgColor = '#f6bbebff'; // 薄紫
            containerColor = '#fcebf9'; // 薄い紫
        } else if (start === 2503 && end === 2696) {
            bgColor = '#ff8c00'; // 橙色
            containerColor = '#ffe0b3'; // 薄い橙色
        }

        rangeBtn.style.backgroundColor = bgColor;
        if (bgColor !== '#fff') {
            levelsContainer.style.backgroundColor = containerColor;
            levelsContainer.classList.remove('bg-light');
        }
        rangeBtn.style.color = '#000';
    }

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
        levelBtn.className = 'btn btn-white w-100 text-start mb-2 border shadow-sm fw-bold';
        levelBtn.textContent = `Lv.${item.level.toLocaleString()}`;

        // 詳細情報のコンテナ（初期状態は非表示）
        const detailDiv = document.createElement('div');
        detailDiv.style.display = 'none'; // 最初は隠す

        // 詳細情報の中身（HTML）
        // simulation.htmlのデザインに合わせてリッチにする
        detailDiv.innerHTML = `
                    <div class="card card-body border-0 bg-white mb-3 shadow-sm">
                        <div class="text-center mb-3 border rounded p-2 bg-light">
                            <span class="fw-bold fs-5">肉:</span> 
                            <span class="text-danger fw-bold fs-3 ms-2">${item.niku.toLocaleString()}</span>
                        </div>
                        
                        <div class="table-responsive mb-3">
                            <table class="table table-bordered table-dark text-center mb-0">
                                <thead>
                                    <tr><th>藁</th><th>皮</th><th>爪</th><th>クリスタル</th></tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="fs-5 fw-bold">${item.wara}</td>
                                        <td class="fs-5 fw-bold">${item.kawa}</td>
                                        <td class="fs-5 fw-bold">${item.tume}</td>
                                        <td class="fs-5 fw-bold">${item.cry}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="row text-center g-2">
                            <div class="col-4"><div class="small fw-bold text-muted">体力</div><div class="text-danger fw-bold fs-5">${item.enemy_hp.toLocaleString()}</div></div>
                            <div class="col-4"><div class="small fw-bold text-muted">攻撃</div><div class="text-danger fw-bold fs-5">${item.enemy_atk.toLocaleString()}</div></div>
                            <div class="col-4"><div class="small fw-bold text-muted">ワンパン</div><div class="text-danger fw-bold fs-5">${item.one_shot_atk.toLocaleString()}</div></div>
                        </div>
                    </div>
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
