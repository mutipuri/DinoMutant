const hpInput = document.getElementById('my_dino_hp');
const atkInput = document.getElementById('my_dino_atk');
const levelSpan = document.getElementById('my_level');

function updateLevel() {
    const hpValue = hpInput.value;
    const atkValue = atkInput.value;

    // 両方未入力なら表示しない
    if (hpValue === '' && atkValue === '') {
        levelSpan.textContent = '';
        return;
    }

    const hp = parseInt(hpInput.value) || 0;
    const atk = parseInt(atkInput.value) || 0;

    const level = hp + atk + 150;
    levelSpan.textContent = level;
}

hpInput.addEventListener('input', updateLevel);
atkInput.addEventListener('input', updateLevel);
