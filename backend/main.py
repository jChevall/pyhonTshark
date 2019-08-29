import firebase_admin
from firebase_admin import firestore
import flask
import asyncio
import nest_asyncio
# import sniffer
import pyshark
from threading import Thread
from multiprocessing import Process
import time


app = flask.Flask(__name__)

firebase_admin.initialize_app()
db = firestore.client()
PACKET_COLLECTION = db.collection('packet')
TEST_COLLECTION = db.collection('test')

@app.route('/startSniffer')
def start_sniffer():
    # asyncio.run(sniffer.startSniffer())
    return flask.jsonify({'message': "Sniffer has been launched"})
    # return flask.jsonify(data)

@app.route('/getRawData')
def getRawData():
    # asyncio.run(sniffer.startSniffer())
    data = TEST_COLLECTION.get()
    print(data.to_dict())
    # return flask.jsonify({'message': "Sniffer has been launched"})
    return flask.jsonify(data.to_dict())

def start_rest_api():
    print("Start REST API")
    app.run(host='127.0.0.1', port=3010, debug=False)

def start_sniffer():
    print("Start Sniffing")
    # Sniff from interface
    capture = pyshark.LiveCapture(interface= "enp2s0", only_summaries=True)
    packetIterator = capture.sniff_continuously
    # Iterate tought capture to parse packet and save it in Database
    iterate_packet(packetIterator)

def create_json(packet):
    return {
        "ipDest": packet.destination,
        "ipSrc": packet.source,
        "protocol": packet.protocol,
        "info": packet.info,
        "length": packet.length,
    }

def iterate_packet(packetIterator):
    for packet in packetIterator():
        json = create_json(packet)
        savedPacket = TEST_COLLECTION.document()
        savedPacket.set(json)

# Run the following script
if __name__ == '__main__':
    # Testing
    doc_ref = db.collection(u'test').list_documents()
    print(doc_ref)

    try:
        doc = doc_ref.get()
        print(u'Document data: {}'.format(doc.to_dict()))
    except google.cloud.exceptions.NotFound:
        print(u'No such document!')

    # # Launch flask (REST API) in a process
    # flask_process = Process(target=start_rest_api)
    # flask_process.daemon = True # Used to kill the process when handler the kill sign (Ctrl-C)
    # flask_process.start()
    #
    # # Launch Sniffer (Pyshark) in a process
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
