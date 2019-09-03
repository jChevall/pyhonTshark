import firebase_admin
from firebase_admin import firestore
import flask
import sniffer
import pyshark
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
PACKET_COLLECTION = db.collection('packets')
TEST_COLLECTION = db.collection('test')
IP_ASSIGNEMENT_COLLECTION = db.collection('ipAssignnement')

@app.route('/createCoupleIpAdressName', methods=['POST'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def post_couple_ipadress_name():
    req = flask.request.json
    savedData = IP_ASSIGNEMENT_COLLECTION.document()
    savedData.set(req)
    return flask.jsonify({"data": req, "id":savedData.id}), 201

@app.route('/readCoupleIpAdressName')
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def read_couple_ipadress_name():
    array = []
    datas = IP_ASSIGNEMENT_COLLECTION.get()
    for data in datas:
        array.append({"data": data.to_dict(), "id":data.id})
    return flask.jsonify({'data': array})

@app.route('/updateCoupleIpAdressName/<id>', methods=['PUT'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def update_couple_ipadress_name(id):
    req = flask.request.json
    savedData = IP_ASSIGNEMENT_COLLECTION.document(id)
    savedData.set(req)
    return flask.jsonify({'data': savedData.to_dict(), "id": savedData.id})

@app.route('/deleteCoupleIpAdressName/<id>', methods=['DELETE'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def delete_couple_ipadress_name(id):
    deletedData = IP_ASSIGNEMENT_COLLECTION.document(id)
    deletedData.delete()
    return flask.jsonify({'success': True})

@app.route('/getRawData')
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def get_raw_data():
    my_data = my_service.get_raw_data(PACKET_COLLECTION)
    return flask.jsonify(my_data)

@app.route('/getCircos', methods=['POST'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def get_circos_data():
    req = flask.request.json
    # Get data from json
    dates = req["dates"]
    # Send data to service
    result = my_service.get_circos_data(TEST_COLLECTION, dates)
    # Return circos data
    return flask.jsonify(result)

def start_rest_api():
    print("Start REST API")
    app.run(host='127.0.0.1', port=3010, debug=False)

def start_sniffing():
    print("Start Sniffing")
    # Sniff from interface
    sniffer.start_sniffer(PACKET_COLLECTION)

# Init Process
flask_process = Process(target=start_rest_api)
flask_process.daemon = True # Used to kill the process when handler the kill sign (Ctrl-C)
sniffer_process = Process(target=start_sniffing)
sniffer_process.daemon = True # Used to kill the process when handler the kill sign (Ctrl-C)

# Run the following script
if __name__ == '__main__':
    # Launch flask REST API
    flask_process.start()

    # Launch Sniffer
    # sniffer_process.start()

    # Used to don't finish the script (cause 2 process running)
    while True:
       time.sleep(1)
