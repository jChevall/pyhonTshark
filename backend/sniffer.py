import pyshark
import asyncio

# Env variable
interface = 'enp2s0'

# Variable

# Function
def print_callback(pkt):
    # pkt.pretty_print()
    print(pkt.highest_layer)
    # print('Packet from', pkt.ip.dst, 'to', pkt.ip.src)

# Sniff from interface
capture = pyshark.LiveCapture()

# Parse Capture
async def startSniffer():
    print("Start Sniffing the network")
    capture = pyshark.LiveCapture()
    for packet in capture.sniff_continuously(packet_count=5):
        print 'Just arrived:', packet.highest_layer
    # capture.apply_on_packets(print_callback, packet_count=10)
