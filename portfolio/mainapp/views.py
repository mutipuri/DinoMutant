import math
from email.mime import image

from django.shortcuts import render

# aiu


# Create your views here.
def index(request):
    return render(request, 'index.html')

def dino(request):
    return render(request, 'simulation.html')

def kekka(request):
    if request.method == 'POST':
        # 入力値を取得
        enemy_hp = int(request.POST.get('enemy_hp'))    # H5(敵の体力)
        my_dino_hp = int(request.POST.get('my_dino_hp'))  # RIGHT(M$3,3)
        my_dino_atk = int(request.POST.get('my_dino_atk'))    # MID(M$3,3)
        enemy_atk = int(request.POST.get('enemy_attack'))   # I5

        dinos = 11  # 恐竜の数

        # 必要攻撃回数
        if enemy_hp <= my_dino_atk * dinos:
            attack_count = 0
        else:
            attack_count = math.floor(
                (enemy_hp) / (my_dino_atk * dinos) - 0.00001)

        # 総合被ダメ(/@より前)
        total_damage = attack_count * enemy_atk

        # 狩りに行けない判定
        max_hp = my_dino_hp * dinos

        if total_damage >= max_hp:
            return render(request, 'kekka.html', {'total_damage': '狩りに行けない'})

        # 回復時間(/@より後)
        seconds = total_damage // dinos
        if seconds > 60:
            minutes = seconds // 60
            seconds = seconds % 60
            recovery_time = f"{minutes}m{seconds}s"
        else:
            recovery_time = f"{seconds}s"

        # テンプレートへ渡す
        return render(request, 'kekka.html', {
            "total_damage" : total_damage,
            "recovery_time" : recovery_time,
            "attack_count" : attack_count,
        })

    # GETで来た場合は入力画面へ
    return render(request, 'kekka.html')

    return render(request, 'simulation.html')

    return render(request, 'simulation.html')
