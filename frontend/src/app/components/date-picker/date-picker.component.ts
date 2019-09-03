import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent implements OnInit  {

  @Input() preSelectDate: Date;
  @Input() placeholder: string;

  @Output() valueChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onSelectDate(event: MatDatepickerInputEvent<Date>) {
    this.valueChange.emit(event.value);
  }

}
