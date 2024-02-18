from utils import resolver
from flask import Flask, request, jsonify
from sqlalchemy import create_engine, text
from utils import embed_text, fetch_article

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
                return jsonify({'result': [{key: value for key, value in row.items()} for row in result.mappings()]})
            else:
                return jsonify({'result': f'{result.rowcount} row(s) affected.'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/find_similar_articles', methods=['POST'])
def find_similar_articles():
    data = request.json
    url = data.get('url')
    path = resolver[url] # "articles/Carlson Putin/Alexei Navalny’s death underlines the horrors of Tucker Carlson’s Putin interview..md" # need map from url to path
    article = fetch_article(path)

    search_vector = embed_text(article)
    sql = text("""
        SELECT *,
        VECTOR_DOT_PRODUCT(embedding, TO_VECTOR(:search_vector)) AS dot_product_result
        FROM articles
        WHERE VECTOR_DOT_PRODUCT(embedding, TO_VECTOR(:search_vector)) > 0.75
        ORDER BY dot_product_result DESC
    """)
    

    try:
        with engine.connect() as connection:
            result = connection.execute(sql, {'search_vector': str(search_vector)})
            article = None
            relevantArticles = []
            for row in result.mappings():
                if row['url'] == path:
                    article = dict(row)
                else:
                    relevantArticles.append(dict(row))
            return jsonify({'article': article, 'relevantArticles': relevantArticles})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001)
