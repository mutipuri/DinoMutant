document.getElementById('calc-btn').addEventListener('click', function () {
    const input = document.getElementById('enemy_level');
    const enemyLevel = parseInt(input.value);

    console.log("入力値:", input.value);
    console.log("数値:", enemyLevel);

    if (isNaN(enemyLevel)) {
        alert("敵レベルを入力してほしい");
        return;
    }

    fetch('/static/data/dino_mutant.json')
        .then(response => response.json())
        .then(data => {
            console.log("JSON全部:", data);

            let allData = [];

            if (Array.isArray(data)) {
                allData = data;
            } else {
                for (const key in data) {
                    allData = allData.concat(data[key]);
                }
            }

            allData.sort((a, b) => a.level - b.level);

            let targetData = null;

            for (let i = allData.length - 1; i >= 0; i--) {
                if (allData[i].level <= enemyLevel) {
                    targetData = allData[i];
                    break;
                }
            }

            if (!targetData && allData.length > 0) {
                targetData = allData[0];
            }

            console.log("targetData:", targetData);

            if (!targetData) {
                alert('指定されたレベルのデータが見つかりませんでした。');
                return;
            }

            if (targetData.level !== enemyLevel) {
                alert(`指定されたLv.${enemyLevel}のデータがないため、近いLv.${targetData.level}のデータを表示します。`);
            }

            document.getElementById('res-niku').textContent = targetData.niku;
            document.getElementById('res-wara').textContent = targetData.wara;
            document.getElementById('res-kawa').textContent = targetData.kawa;
            document.getElementById('res-tume').textContent = targetData.tume;
            document.getElementById('res-cry').textContent = targetData.cry;
            document.getElementById('res-one-shot-atk').textContent = targetData.one_shot_atk;
            document.getElementById('res-enemy-hp').textContent = targetData.enemy_hp;
            document.getElementById('res-enemy-atk').textContent = targetData.enemy_atk;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('データの読み込みに失敗しました。');
        });
});
