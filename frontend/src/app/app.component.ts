import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// la function ngOnInit fait partie de l'interface OnInit.
export class AppComponent implements OnInit {

  constructor(
  ) { }

  // Le framework Angular décide quand cette function est executée.
  ngOnInit() {
  }

}

