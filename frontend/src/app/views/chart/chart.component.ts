import { ChartData } from './../../services/request.service';
import { RequestService } from 'src/app/services/request.service';
import { Component, OnInit} from '@angular/core';

const FROM = 'from';
const TO = 'to';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  fromSelectedDate: Date;
  toSelectedDate: Date;
  circosData: ChartData;
  circosPrinted = false;
  loading = false;

  constructor(
    private requestService: RequestService,
  ) { }

  ngOnInit() {
  }

  dateChange(event: Date, hint: string) {
    if (hint === FROM) {
      this.fromSelectedDate = event;
    } else if (hint === TO) {
      this.toSelectedDate = event;
    }
  }

  getCirosData() {
    this.circosPrinted = !this.circosPrinted;
    const dates: Date[] = [];
    if (this.fromSelectedDate) {
      dates.push(this.fromSelectedDate);

      if (this.toSelectedDate) {
        dates.push(this.toSelectedDate);
      }

      this.loading = true;
      this.requestService.getCircosData(dates)
        .subscribe((res) => {
          this.loading = false;
          this.circosData = res;
        });
    }
  }

  onCancel() {
    this.circosPrinted = !this.circosPrinted;
  }
}
