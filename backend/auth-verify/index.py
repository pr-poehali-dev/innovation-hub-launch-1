"""
Подтверждение номера телефона по SMS-коду и выдача токена сессии.
"""
import json
import os
import secrets
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


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    headers = {**CORS, "Content-Type": "application/json"}
    body = json.loads(event.get("body") or "{}")

    phone = body.get("phone", "").strip()
    code = body.get("code", "").strip()

    if not phone or not code:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Укажите телефон и код"})}

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"SELECT id FROM {SCHEMA}.sms_codes WHERE phone = %s AND code = %s AND used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
        (phone, code),
    )
    row = cur.fetchone()
    if not row:
        conn.close()
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Неверный или истёкший код"})}

    sms_id = row[0]
    cur.execute(f"UPDATE {SCHEMA}.sms_codes SET used = TRUE WHERE id = %s", (sms_id,))
    cur.execute(f"UPDATE {SCHEMA}.users SET is_verified = TRUE WHERE phone = %s", (phone,))

    cur.execute(f"SELECT id, nickname FROM {SCHEMA}.users WHERE phone = %s", (phone,))
    user = cur.fetchone()

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
