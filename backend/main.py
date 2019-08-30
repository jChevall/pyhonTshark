import firebase_admin
from firebase_admin import firestore
import flask
import asyncio
import nest_asyncio
import sniffer
import pyshark
from threading import Thread
from multiprocessing import Process
import time
import my_service
from datetime import datetime
from flask import Flask
from flask_cors import CORS,cross_origin

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/": {"origins": "http://localhost:4200"}})

firebase_admin.initialize_app()
db = firestore.client()
PACKET_COLLECTION = db.collection('packet')
TEST_COLLECTION = db.collection('test')

@app.route('/startSniffer')
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def start_sniffer():
    # asyncio.run(sniffer.startSniffer())
    return flask.jsonify({'message': "Sniffer has been launched"})
    # return flask.jsonify(data)

@app.route('/getRawData')
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def getRawData():
    # asyncio.run(sniffer.startSniffer())
    my_data = my_service.get_raw_data(TEST_COLLECTION)
    # return flask.jsonify({'message': "Sniffer has been launched"})
    return flask.jsonify(my_data)

@app.route('/getCircos', methods=['POST'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def getCircos():
    req = flask.request.json
    # Get data from json
    print(req)
    dates = req["dates"]
    # Send data to service
    result = my_service.get_circos_data(TEST_COLLECTION, dates)
    # Return circos data
    return flask.jsonify(result)

def start_rest_api():
    print("Start REST API")
    app.run(host='127.0.0.1', port=3010, debug=False)

def start_sniffer():
    print("Start Sniffing")
    # Sniff from interface
    sniffer.start_sniffer(TEST_COLLECTION)

# Run the following script
if __name__ == '__main__':
    # Testing
    # my_service.get_raw_data(TEST_COLLECTION)

    # Launch flask (REST API) in a process
    flask_process = Process(target=start_rest_api)
    flask_process.daemon = True # Used to kill the process when handler the kill sign (Ctrl-C)
    flask_process.start()

    # Launch Sniffer (Pyshark) in a process
    # sniffer_process = Process(target=start_sniffer)
    # sniffer_process.daemon = True # Used to kill the process when handler the kill sign (Ctrl-C)
    # sniffer_process.start()

    # Used to don't finish the script (cause 2 process running)
    while True:
       time.sleep(1)



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
