import { Injectable } from '@angular/core';
import { Observable, Timestamp, of } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface ChartData {
  matrix: number[][];
  ipSourceTab: string[];
  ipDestTab: string[];
}

export interface CoupleIpAdressName {
  data: {
    ipAdress: string;
    name: string;
  };
  id?: string;
}

interface Packet {
  date: number;
  info: string;
  ipDest: string;
  ipSrc: string;
  length: number;
  protocol: string;
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const URL_SERVER = 'http://localhost:3010/';
const URL_CIRCOS_DATA = URL_SERVER + 'getCircos';
const URL_RAW_DATA = URL_SERVER + 'getRawData';
const URL_START_SNIFFER = URL_SERVER + 'startSniffer';
const URL_STOP_SNIFFER = URL_SERVER + 'stopSniffer';

const URL_IP_ASSIGNEMENT_CRUD  = {
  create:  URL_SERVER + 'createCoupleIpAdressName',
  read:  URL_SERVER + 'readCoupleIpAdressName',
  update:  URL_SERVER + 'updateCoupleIpAdressName',
  delete:  URL_SERVER + 'deleteCoupleIpAdressName',
};

@Injectable()
export class RequestService {
  constructor(private http: HttpClient) {
    httpOptions.headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
    httpOptions.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    httpOptions.headers.append('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    httpOptions.headers.append('Access-Control-Allow-Credentials', 'true');
  }

  createIpAssignement(ipAssignement: CoupleIpAdressName) {
    return this.http.post(URL_IP_ASSIGNEMENT_CRUD.create, ipAssignement);
  }

  readAllIpAssignement() {
    return this.http.get(URL_IP_ASSIGNEMENT_CRUD.read);
  }

  readIpAssignement(id: string) {
    return this.http.get(URL_IP_ASSIGNEMENT_CRUD.read + '/' + id);
  }

  updateIpAssignement(id: string, ipAssignement) {
    return this.http.put(URL_IP_ASSIGNEMENT_CRUD.update + '/' + id, ipAssignement);
  }

  deleteIpAssignement(id: string) {
    return this.http.delete(URL_IP_ASSIGNEMENT_CRUD.delete + '/' + id);
  }

  getRawData(): Observable<any> {
    return this.http.get(URL_RAW_DATA);
  }

  startSniffer() {
    return this.http.get(URL_START_SNIFFER);
  }

  stopSniffer() {
    return this.http.get(URL_STOP_SNIFFER);
  }


  getCircosData(dates: Date[]): Observable<ChartData> {
    const body = {
      dates: dates.map(element => element.getTime() / 1000)
    };
    return this.http.post<ChartData>(URL_CIRCOS_DATA, body);
  }
}
