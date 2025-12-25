import json
import math
import os
from email.mime import image

from django.shortcuts import render


# Create your views here.
def index(request):
    """トップページを表示"""
    return render(request, 'index.html')

def dino(request):
    """シミュレーション画面（初期表示）"""
    return render(request, 'simulation.html')

# 結果表示
def simulation(request):
    result = None
    recovery_time = None
    enemy_hp = None
    enemy_atk = None
    my_dino_hp = None
    my_dino_atk = None
    enemy_level = None

    niku = None
    wara = None
    kawa = None
    tume = None
    cry = None
    one_shot_atk = None
    total_damage = None
    
    if request.method == 'POST':
        level_message = None
        
        # 数値変換用ヘルパー（カンマ除去）
        def parse_int_safe(val):
            if isinstance(val, str):
                return int(val.replace(',', ''))
            return int(val)

        # --- フォーム入力値の取得 ---
        my_dino_hp = int(request.POST.get('my_dino_hp'))
        my_dino_atk = int(request.POST.get('my_dino_atk'))
        enemy_level = int(request.POST.get('enemy_level'))

        # --- JSONデータの読み込み ---
        # プロジェクト内のJSONファイルパスを構築
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        json_path = os.path.join(base_dir, 'static', 'data', 'dino_mutant.json')
        
        enemy_hp = 0
        enemy_atk = 0
        
        if os.path.exists(json_path):
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        
        # --- 敵データの検索処理 ---
        # 全敵データを1つの配列にまとめる
        all_enemies = []
        for group in data.values():
            all_enemies.extend(group)

        # level順に並び変え
        all_enemies.sort(key=lambda x: parse_int_safe(x['level']))

        # 入力レベル以下で一番近い敵を探す
        target = None
        for enemy in reversed(all_enemies):
            if parse_int_safe(enemy['level']) <= enemy_level:
                target = enemy
                break
        
        # 入力レベルが見つかった時
        if target and parse_int_safe(target['level']) == enemy_level:
            level_message = f"Lv.{enemy_level} の敵を表示します"
            

        # 入力レベルが低すぎた場合 → 最小レベル
        if target is None:
            target = all_enemies[0]
            level_message = f"Lv.{enemy_level} が存在しないため、最低レベルのLv.{target['level']}を表示します"
        elif parse_int_safe(target['level']) != enemy_level:
            level_message = f"Lv.{enemy_level} が存在しないため、近いLv.{target['level']}を表示します"

        # --- 敵ステータスのセット ---
        if target:
            enemy_hp = parse_int_safe(target['enemy_hp'])
            enemy_atk = parse_int_safe(target['enemy_atk'])
            niku = target.get('niku')
            wara = target.get('wara')
            kawa = target.get('kawa')
            tume = target.get('tume')
            cry = target.get('cry')
            one_shot_atk = target.get('one_shot_atk')

        dinos = 11
        total_my_hp = my_dino_hp * dinos * 10
        total_my_atk = my_dino_atk * dinos

        if enemy_hp <= total_my_atk:
            attack_count = 0
        else:
            attack_count = math.floor((enemy_hp / total_my_atk) - 0.00001)

        damage = attack_count * enemy_atk
        
        recovery_time = ""

        if damage >= total_my_hp:
            result = "狩りに行けない"
        elif damage == 0:
            result = "ノーダメージ"
            recovery_time = "回復待ち時間なし"
        else:
            result = f"{damage:,}"
            # 11体で割って1体あたりの回復時間を算出 (秒)
            total_seconds = math.floor(damage / 11)
            # 分・秒の表記に変換
            if total_seconds > 60:
                minutes = math.floor(total_seconds / 60)
                seconds = total_seconds % 60
                recovery_time = f"{minutes}m{seconds}s"
            else:
                recovery_time = f"{total_seconds}s"

        # 数値をカンマ区切りにするヘルパー関数
        def fmt(val):
            if val is None:
                return None
            try:
                return f"{int(val):,}"
            except (ValueError, TypeError):
                return val

        context = {
            'result': result,
            'recovery_time': recovery_time,
            'enemy_hp': fmt(enemy_hp),
            'enemy_atk': fmt(enemy_atk),
            'my_dino_hp': my_dino_hp,
            'my_dino_atk': my_dino_atk,
            'enemy_level': enemy_level,
            'niku': fmt(niku),
            'wara': fmt(wara),
            'kawa': fmt(kawa),
            'tume': fmt(tume),
            'cry': fmt(cry),
            'one_shot_atk': fmt(one_shot_atk),
            'total_damage': result,
            'level_message': level_message,
        }
        return render(request, 'simulation.html', context)

    return render(request, 'simulation.html')
