import firebase_admin
from firebase_admin import firestore
import flask
import asyncio
import nest_asyncio
import sniffer
from threading import Thread


app = flask.Flask(__name__)

firebase_admin.initialize_app()
PACKET_COLLECTION = firestore.client().collection('packet')
TEST_COLLECTION = firestore.client().collection('test')

@app.route('/startSniffer')
def start_sniffer():
    # asyncio.run(sniffer.startSniffer())
    data = PACKET_COLLECTION.get()
    print(data)
    return flask.jsonify({'message': "Sniffer has been launched"})
    # return flask.jsonify(data)


def start_rest_api():
    print("Start REST API")
    app.run(host='127.0.0.1', port=3010, debug=True)

def start_sniffer():
    print("Start Sniffing")
    thread = Thread(target=sniffer.startSniffer(TEST_COLLECTION))
    thread.start()

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=3010, debug=False)



# @app.route('/heroes', methods=['POST'])
# def create_hero():
#     req = flask.request.json
#     hero = SUPERHEROES.document()
#     hero.set(req)
#     return flask.jsonify({'id': hero.id}), 201
#
# @app.route('/heroes/<id>')
# def read_hero(id):
#     return flask.jsonify(_ensure_hero(id).to_dict())
#
# @app.route('/heroes/<id>', methods=['PUT'])
# def update_hero(id):
#     _ensure_hero(id)
#     req = flask.request.json
#     SUPERHEROES.document(id).set(req)
#     return flask.jsonify({'success': True})
#
# @app.route('/heroes/<id>', methods=['DELETE'])
# def delete_hero(id):
#     _ensure_hero(id)
#     SUPERHEROES.document(id).delete()
#     return flask.jsonify({'success': True})
#
# def _ensure_hero(id):
#     try:
#         return SUPERHEROES.document(id).get()
#     except:
#         flask.abort(404)
#
