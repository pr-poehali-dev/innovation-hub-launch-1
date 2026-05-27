"""
Получить профиль текущего пользователя TalkWave по токену сессии.
"""
import json
import os
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p99873448_innovation_hub_launc")
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    headers = {**CORS, "Content-Type": "application/json"}
    token = event.get("headers", {}).get("X-Auth-Token", "")

    if not token:
        return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Нет токена"})}

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"SELECT u.id, u.phone, u.nickname FROM {SCHEMA}.sessions s JOIN {SCHEMA}.users u ON u.id = s.user_id WHERE s.token = %s AND s.expires_at > NOW()",
        (token,),
    )
    user = cur.fetchone()
    conn.close()

    if not user:
        return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Сессия недействительна"})}

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"id": user[0], "phone": user[1], "nickname": user[2]}),
    }
