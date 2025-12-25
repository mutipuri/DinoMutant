import math
from unittest import result

enemy_hp = 100  # 敵の体力
enemy_atk = 200  # 敵の攻撃力


my_dino_hp = 200  # 恐竜1体の体力
my_dino_atk = 250  # 恐竜1体の攻撃力

# 恐竜の数
dinos = 11

# 恐竜の合計体力
total_my_hp = my_dino_hp * dinos * 10
# 恐竜の合計攻撃力
total_my_atk = my_dino_atk * dinos


# ( enemy_hp / total_my_atk ) - 0.00001 の結果を小数点以下切り捨てで表示する（敵が攻撃を耐える回数）
attack_count = math.floor((enemy_hp / total_my_atk) - 0.00001)

# enemy_hp <= total_my_atk なら "0"、そうでないならattack_count。attack_countは " math.floor((enemy_hp / total_my_atk) - 0.00001) "
if enemy_hp <= total_my_atk:
    attack_count = 0
else:
    attack_count = math.floor((enemy_hp / total_my_atk) - 0.00001)

# 被ダメ計算
totale_damage = attack_count * enemy_atk

# attack_count * enemy_atk >= total_my_hp なら "狩りに行けない"と表示する。そうでないなら damageを表示する

# 
if totale_damage >= total_my_hp:
    result = "狩りに行けない"
else:
    result = totale_damage