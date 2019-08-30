import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface CircosData {
  matrix: number[][];
  ipSourceTab: string[];
  ipDestTab: string[];
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

const URL_CIRCOS_DATA = 'http://localhost:3010/getCircos';
const URL_RAW_DATA = 'http://localhost:3010/getRawData';

@Injectable()
export class RequestService {
  constructor(private http: HttpClient) {
    httpOptions.headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
    httpOptions.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    httpOptions.headers.append('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    httpOptions.headers.append('Access-Control-Allow-Credentials', 'true');
  }

  getRawData(): Observable<any> {
    return this.http.get(URL_RAW_DATA);
  }

  getCircosData(): Observable<CircosData> {
    console.log('getCircosData');
    return this.http.post<CircosData>(URL_CIRCOS_DATA, { dates: [1567064398] });
  }
}
