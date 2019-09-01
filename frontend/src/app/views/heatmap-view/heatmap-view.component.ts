import { RequestService, ChartData } from './../../services/request.service';
import { Component, OnInit } from '@angular/core';

const FROM = 'from';
const TO = 'to';

@Component({
  selector: 'app-heatmap-view',
  templateUrl: './heatmap-view.component.html',
  styleUrls: ['./heatmap-view.component.css']
})
export class HeatmapViewComponent implements OnInit {

  fromSelectedDate: Date;
  toSelectedDate: Date;
  heatmapData: ChartData;
  heatmapPrinted = false;

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
    this.heatmapPrinted = !this.heatmapPrinted;
    const dates: Date[] = [];
    if (this.fromSelectedDate) {
      dates.push(this.fromSelectedDate);

      if (this.toSelectedDate) {
        dates.push(this.toSelectedDate);
      }

      this.requestService.getCircosData(dates)
        .subscribe((res) => {
          console.log(res);
          this.heatmapData = res;
        });
    }
  }
}
