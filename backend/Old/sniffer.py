import pyshark
import asyncio
import nest_asyncio


# Env variable
interface = 'enp2s0'

# Variable
# packetCollection = None

#
def createJson(packet):
    return {
        "ipDest": packet.destination,
        "ipSrc": packet.source,
        "protocol": packet.protocol,
        "info": packet.info,
        "length": packet.length,
    }

def iteratePacket(packetIterator, collection):
    for packet in packetIterator():
        print("Test 3")
        json = createJson(packet)
        savedPacket = collection.document()
        savedPacket.set(json)

# Parse Capture
async def startSniffer(collection):
    print("Test 1")
    # Sniff from interface
    capture = pyshark.LiveCapture(interface= "enp2s0", only_summaries=True)
    packetIterator = capture.sniff_continuously

    print("Test 2")
    # Iterate tought capture to parse packet and save it in Database
    iteratePacket(packetIterator, collection)
