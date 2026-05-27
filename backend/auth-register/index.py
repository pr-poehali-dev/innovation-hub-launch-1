"""
Регистрация нового пользователя TalkWave по номеру телефона.
"""
import json
import os
import random
import string
import hashlib
import psycopg2

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

    from datetime import datetime, timedelta
    code = generate_sms_code()
    expires = datetime.now() + timedelta(minutes=10)
    cur.execute(
        f"INSERT INTO {SCHEMA}.sms_codes (phone, code, expires_at) VALUES (%s, %s, %s)",
        (phone, code, expires),
    )
    conn.commit()
    conn.close()

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"success": True, "user_id": user_id, "debug_code": code}),
    }
