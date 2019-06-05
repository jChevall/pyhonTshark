import pyshark
import constants
import tools

pathName = '/tmp/mycapture.cap'
interface = 'enp2s0'

# Open saved trace file
# cap = pyshark.FileCapture(pathName)

# Sniff from interface
capture = pyshark.LiveCapture(interface=interface)
# capture.sniff(timeout=10)

# print(capture)

# for packet in capture.sniff_continuously(packet_count=5):
#     print('Packet from', packet.ip.dst, 'to', packet.ip.src)

# -------------- only_summaries=True -----------------
# delta: Delta (difference) time between the current packet and the previous captured packet
# destination: The Layer 3 (IP, IPv6) destination address
# info: A brief application layer summary (e.g. ‘HTTP GET /resource_folder/page.html’)
# ip id: IP Identification field used for uniquely identifying packets from a host
# length: Length of the packet in bytes
# no: Index number of the packet in the list
# protocol: The highest layer protocol recognized in the packet
# source:  Layer 3 (IP, IPV6) source address
# stream: Index of the TCP stream this packet is a part of (TCP packets only)
# summary_line: All the summary attributes in one tab-delimited string
# time: Absolute time between the current packet and the first packet
# window: The TCP window size (TCP packets only)

def print_callback(pkt):
        print_conversation_header(pkt)
        tools.pause()

def print_conversation_header(pkt):
    try:
        protocol =  pkt.transport_layer
        src_addr = pkt.ip.src
        src_port = pkt[pkt.transport_layer].srcport
        dst_addr = pkt.ip.dst
        dst_port = pkt[pkt.transport_layer].dstport
        print ('%s  %s:%s --> %s:%s' % (protocol, src_addr, src_port, dst_addr, dst_port))
    except AttributeError as e:
        #ignore packets that aren't TCP/UDP or IPv4
        pass
        
def ifLayerUnknow(highest_layer):
        result = True
        for layer in constants.HIGHEST_LAYER_LIST:
                if highest_layer == layer:
                        result = False
        return result




capture.apply_on_packets(print_callback, timeout=100000)
