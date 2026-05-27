"""
Вход в TalkWave по номеру телефона и паролю.
"""
import json
import os
import secrets
import hashlib
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


def hash_password(p: str) -> str:
    return hashlib.sha256(p.encode()).hexdigest()


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    headers = {**CORS, "Content-Type": "application/json"}
    body = json.loads(event.get("body") or "{}")

    phone = body.get("phone", "").strip()
    password = body.get("password", "").strip()

    if not phone or not password:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Укажите телефон и пароль"})}

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"SELECT id, nickname, is_verified FROM {SCHEMA}.users WHERE phone = %s AND password_hash = %s",
        (phone, hash_password(password)),
    )
    user = cur.fetchone()
    if not user:
        conn.close()
        return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Неверный номер или пароль"})}

    if not user[2]:
        conn.close()
        return {"statusCode": 403, "headers": headers, "body": json.dumps({"error": "Номер не подтверждён", "need_verify": True})}

    token = secrets.token_hex(32)
    expires = datetime.now() + timedelta(days=30)
    cur.execute(
        f"INSERT INTO {SCHEMA}.sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
        (user[0], token, expires),
    )
    conn.commit()
    conn.close()

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"success": True, "token": token, "nickname": user[1], "user_id": user[0]}),
    }
