import pyshark

# Env variable
interface = 'enp2s0'

# Variable

# Function
def print_callback(pkt):
    # pkt.pretty_print()
    print(pkt.highest_layer)
    # print('Packet from', pkt.ip.dst, 'to', pkt.ip.src)  

# Sniff from interface
capture = pyshark.LiveCapture(interface='enp2s0')

# Parse Capture
capture.apply_on_packets(print_callback, packet_count=10)
