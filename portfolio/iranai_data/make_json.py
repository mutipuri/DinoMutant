import csv
import json
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

csv_path = BASE_DIR / "static" / "data" / "dino_mutant.csv"
json_path = BASE_DIR / "static" / "data" / "dino_mutant.json"

data = []

if not csv_path.exists():
    print(f"エラー: CSVファイルが見つかりません -> {csv_path}")
    sys.exit(1)

def clean_int(value):
    """カンマを除去してintに変換する"""
    if not value:
        return 0
    return int(value.replace(",", ""))

try:
    # utf-8-sig にすることで、Excel等で保存されたBOM付きCSVも読み込めるように修正
    with open(csv_path, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, 2):
            # levelが空の場合はスキップ（空行対策）
            if not row["level"] or row["level"].strip() == "":
                continue

            try:
                data.append({
                    "level": clean_int(row["level"]),
                    "niku": clean_int(row["niku"]),
                    "wara": row["wara"],  # "1~20"のような範囲データは文字列のまま扱う
                    "kawa": row["kawa"],
                    "tume": row["tume"],
                    "cry": row["cry"],
                    "enemy_hp": clean_int(row["enemy_hp"]),
                    "enemy_atk": clean_int(row["enemy_atk"]),
                    "one_shot_atk": clean_int(row["one_shot_atk"]),
                })
            except ValueError as e:
                print(f"エラー: {i}行目のデータ変換に失敗しました。数値が入っているか確認してください。\n行データ: {row}")
                raise e

    # 出力先フォルダが存在しない場合は作成する
    json_path.parent.mkdir(parents=True, exist_ok=True)

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"JSON作成完了！ -> {json_path}")

except Exception as e:
    print(f"エラーが発生しました: {e}")
