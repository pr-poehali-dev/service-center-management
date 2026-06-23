import json
import os
import psycopg2
import psycopg2.extras


def handler(event: dict, context) -> dict:
    '''
    Business: Управление заявками сервисного центра — список, создание, смена статуса.
    Args: event с httpMethod (GET/POST/PUT), body для создания и обновления заявок.
    Returns: HTTP-ответ со списком заявок или результатом операции.
    '''
    method = event.get('httpMethod', 'GET')

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    dsn = os.environ['DATABASE_URL']
    conn = psycopg2.connect(dsn)
    conn.autocommit = True

    try:
        if method == 'GET':
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute(
                    "SELECT id, client_name, client_phone, device_type, device_model, "
                    "issue, master, status, price, created_at FROM orders ORDER BY id DESC"
                )
                rows = cur.fetchall()
            orders = []
            for r in rows:
                d = dict(r)
                d['created_at'] = d['created_at'].isoformat() if d['created_at'] else None
                orders.append(d)
            return {
                'statusCode': 200,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'orders': orders}, ensure_ascii=False),
            }

        if method == 'POST':
            body = json.loads(event.get('body') or '{}')
            client_name = (body.get('client_name') or '').strip()
            client_phone = (body.get('client_phone') or '').strip()
            device_type = (body.get('device_type') or 'phone').strip()
            device_model = (body.get('device_model') or '').strip()
            issue = (body.get('issue') or '').strip()
            master = (body.get('master') or '').strip()
            status = (body.get('status') or 'diag').strip()
            try:
                price = int(body.get('price') or 0)
            except (ValueError, TypeError):
                price = 0

            if not client_name or not client_phone or not device_model:
                return {
                    'statusCode': 400,
                    'headers': {**cors, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Заполните имя, телефон и модель устройства'}, ensure_ascii=False),
                }

            cn = client_name.replace("'", "''")
            cp = client_phone.replace("'", "''")
            dt = device_type.replace("'", "''")
            dm = device_model.replace("'", "''")
            iss = issue.replace("'", "''")
            ms = master.replace("'", "''")
            st = status.replace("'", "''")

            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute(
                    f"INSERT INTO orders (client_name, client_phone, device_type, device_model, issue, master, status, price) "
                    f"VALUES ('{cn}', '{cp}', '{dt}', '{dm}', '{iss}', '{ms}', '{st}', {price}) "
                    f"RETURNING id"
                )
                new_id = cur.fetchone()['id']

            return {
                'statusCode': 200,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'success': True, 'id': new_id}, ensure_ascii=False),
            }

        if method == 'PUT':
            body = json.loads(event.get('body') or '{}')
            order_id = int(body.get('id') or 0)
            status = (body.get('status') or '').strip().replace("'", "''")
            if not order_id or not status:
                return {
                    'statusCode': 400,
                    'headers': {**cors, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Нужны id и status'}, ensure_ascii=False),
                }
            with conn.cursor() as cur:
                cur.execute(f"UPDATE orders SET status = '{status}' WHERE id = {order_id}")
            return {
                'statusCode': 200,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'success': True}, ensure_ascii=False),
            }

        return {
            'statusCode': 405,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}, ensure_ascii=False),
        }
    finally:
        conn.close()
