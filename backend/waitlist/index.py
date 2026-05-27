"""
Waitlist TalkWave: сохраняем номера телефонов желающих попасть в бета-тест.
"""
import json
import os
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p99873448_innovation_hub_launc")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    headers = {**CORS, "Content-Type": "application/json"}
    method = event.get("httpMethod", "GET")

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        phone = body.get("phone", "").strip()
        if not phone or len(phone) < 7:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Введите корректный номер телефона"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.waitlist WHERE phone = %s", (phone,))
        if cur.fetchone():
            conn.close()
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"success": True, "message": "Вы уже в списке!"})}

        cur.execute(f"INSERT INTO {SCHEMA}.waitlist (phone) VALUES (%s)", (phone,))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"success": True, "message": "Вы в списке ожидания!"})}

    if method == "GET":
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.waitlist")
        count = cur.fetchone()[0]
        conn.close()
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"count": count})}

    return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Not found"})}
