from flask import Flask, request, jsonify
from sqlalchemy import create_engine, text

app = Flask(__name__)

username = 'SUPERUSER'
password = 'SYS2'
hostname = 'localhost' 
port = '1972' 
namespace = 'USER'
CONNECTION_STRING = f"iris://{username}:{password}@{hostname}:{port}/{namespace}"

engine = create_engine(CONNECTION_STRING)

@app.route('/execute_sql', methods=['POST'])
def execute_sql():
    data = request.json
    sql = data.get('sql')
    params = data.get('params', {})
    print('SQL: ' + sql)
    print(f'Params: {params}')
    print()

    if not sql:
        return jsonify({'error': 'SQL statement is required.'}), 400

    try:
        with engine.connect() as connection:
            result = connection.execute(text(sql), params)
            connection.commit()
            if result.returns_rows:
                return jsonify({'result': [list(row) for row in result.all()]})
            else:
                return jsonify({'result': f'{result.rowcount} row(s) affected.'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/search', methods=['POST'])
def search():
    data = request.json
    search_vector = data.get('search_vector')

    sql = text("""
        SELECT *,
        VECTOR_DOT_PRODUCT(embedding, TO_VECTOR(:search_vector)) AS dot_product_result
        FROM superset_points
        WHERE VECTOR_DOT_PRODUCT(embedding, TO_VECTOR(:search_vector)) > 0.5
        ORDER BY dot_product_result DESC
    """)

    try:
        with engine.connect() as connection:
            result = connection.execute(sql, {'search_vector': str(search_vector)}).fetchall()
            return jsonify({'result': [list(row) for row in result]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
