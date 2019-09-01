from datetime import date, datetime
import time

def get_circos_data(collection, dates):
    if len(dates) == 1:
        timestamp = date.fromtimestamp(dates[0])
        # Call circos Data
        array = get_raw_data(collection)
        filtered_array = filter_raw_data_one_date(array, timestamp)
        # create_circos_dataV2(filtered_array)
        # circo_data = create_circos_data(filtered_array)
        return create_circos_data(filtered_array)
    else:
        timestamp_from = time.mktime(datetime.fromtimestamp(dates[0]).timetuple())
        timestamp_to = time.mktime(datetime.fromtimestamp(dates[1]).timetuple())
        # Call circos Data
        array = get_raw_data(collection)
        filtered_array = filter_raw_data_two_date(array, timestamp_from, timestamp_to)
        # create_circos_dataV2(filtered_array)
        # circo_data = create_circos_data(filtered_array)
        return create_circos_data(filtered_array)

def get_raw_data(collection):
    array = []
    datas = collection.get()
    for data in datas:
        array.append(data.to_dict())
    return array

def filter_raw_data_one_date(array, timestamp):
    data = filter(lambda x: date.fromtimestamp(x["date"]) == timestamp, array)
    return list(data)

def filter_raw_data_two_date(array, timestamp_from, timestamp_to):
    f1 = lambda x: x["date"] > timestamp_from
    f2 = lambda x: x["date"] < timestamp_to

    data = filter(f1 and f2, array)
    return list(data)

def create_circos_data(filtered_array):
    # Create Tabs
    ip_src_array = []
    ip_dest_array = []

    # Make 2 tab : one with unique source adress and another with unique destination adress
    for packet in filtered_array:
        # print(packet["ipSrc"], packet["ipDest"])
        if ip_src_array.count(packet["ipSrc"]) == 0 :
            ip_src_array.append(packet["ipSrc"])
        if ip_dest_array.count(packet["ipDest"]) == 0 :
            ip_dest_array.append(packet["ipDest"])

    # Create the matrix data
    matrix = {}
    for i in range(0, len(ip_src_array)):
        new = []
        for j in range(0, len(ip_dest_array)):
            new.append(0)
        matrix[ip_src_array[i]]=new

    for ip_src in ip_src_array:
        for ip_dest in ip_dest_array:
            index_dest = ip_dest_array.index(ip_dest)
            count_packet = 0
            for packet in filtered_array:
                if packet["ipSrc"] == ip_src and packet["ipDest"] == ip_dest:
                    count_packet = count_packet + 1
            matrix[ip_src][index_dest] = count_packet

    result = {"matrix": matrix, "ip_src_array": ip_src_array, "ip_dest_array": ip_dest_array}
    # print(result)
    return result
