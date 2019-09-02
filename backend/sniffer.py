import pyshark
import time

# Const
interface = 'enp2s0'

def create_json(packet):
    return {
        "ipDest": packet.destination,
        "ipSrc": packet.source,
        "protocol": packet.protocol,
        "info": packet.info,
        "length": packet.length,
        "date": time.time(),
    }

def iterate_packet(packetIterator, collection):
    for packet in packetIterator():
        json = create_json(packet)
        savedPacket = collection.document()
        savedPacket.set(json)

# Parse Capture
def start_sniffer(collection):
    # Sniff from interface
    # Filter port 4200 (front) and port 3010 (back)
    capture = pyshark.LiveCapture(only_summaries=True, bpf_filter='not tcp port 4200 and not tcp port 3010')
    packetIterator = capture.sniff_continuously
    # Iterate tought capture to parse packet and save it in Database
    iterate_packet(packetIterator, collection)
