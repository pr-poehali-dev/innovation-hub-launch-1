"""
Регистрация нового пользователя TalkWave по номеру телефона с отправкой SMS.
"""
import json
import os
import random
import string
import hashlib
import urllib.request
import urllib.parse
import psycopg2
from datetime import datetime, timedelta

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p99873448_innovation_hub_launc")
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def generate_sms_code() -> str:
    return "".join(random.choices(string.digits, k=6))


def send_sms(phone: str, code: str) -> bool:
    api_key = os.environ.get("SMSRU_API_KEY", "")
    # Нормализуем номер: оставляем только цифры, добавляем 7 если надо
    digits = "".join(c for c in phone if c.isdigit())
    if digits.startswith("8") and len(digits) == 11:
        digits = "7" + digits[1:]
    elif len(digits) == 10:
        digits = "7" + digits

    params = urllib.parse.urlencode({
        "api_id": api_key,
        "to": digits,
        "msg": f"TalkWave: ваш код подтверждения {code}. Никому не сообщайте.",
        "json": 1,
    })
    url = f"https://sms.ru/sms/send?{params}"
    req = urllib.request.urlopen(url, timeout=10)
    resp = json.loads(req.read().decode())
    return resp.get("status") == "OK"


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    headers = {**CORS, "Content-Type": "application/json"}
    body = json.loads(event.get("body") or "{}")

    phone = body.get("phone", "").strip()
    nickname = body.get("nickname", "").strip()
    password = body.get("password", "").strip()

    if not phone or not nickname or not password:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Заполните все поля"})}
    if len(password) < 6:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Пароль минимум 6 символов"})}

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE phone = %s OR nickname = %s", (phone, nickname))
    if cur.fetchone():
        conn.close()
        return {"statusCode": 409, "headers": headers, "body": json.dumps({"error": "Номер или никнейм уже занят"})}

    cur.execute(
        f"INSERT INTO {SCHEMA}.users (phone, nickname, password_hash) VALUES (%s, %s, %s) RETURNING id",
        (phone, nickname, hash_password(password)),
    )
    user_id = cur.fetchone()[0]

    code = generate_sms_code()
    expires = datetime.now() + timedelta(minutes=10)
    cur.execute(
        f"INSERT INTO {SCHEMA}.sms_codes (phone, code, expires_at) VALUES (%s, %s, %s)",
        (phone, code, expires),
    )
    conn.commit()
    conn.close()

    sms_sent = send_sms(phone, code)
    if not sms_sent:
        return {"statusCode": 500, "headers": headers, "body": json.dumps({"error": "Не удалось отправить SMS. Проверьте номер телефона."})}

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"success": True, "user_id": user_id}),
    }
