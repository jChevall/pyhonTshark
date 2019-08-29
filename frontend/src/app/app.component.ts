import * as d3 from 'd3';
import { Component, OnInit } from '@angular/core';
import { RequestService } from "./services/request.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
//la function ngOnInit fait partie de l'interface OnInit.
export class AppComponent implements OnInit {
  title = 'Oh shit .. Here we go again';
  rawData;

  constructor(
    private requestService: RequestService
  ) {
    this.rawData = requestService.getRawData();
    console.log(this.rawData);
  }

  // Le framework Angular décide quand cette function est executée.
  ngOnInit() {
    console.log('Test')
    // this.requestService.getRawData().subscribe((res) => {
    //   console.log(res);
    // })

    // // create the svg area
    // let svg = d3.select("#my_dataviz")
    //   .append("svg")
    //     .attr("width", 440)
    //     .attr("height", 440)
    //   .append("g")
    //     .attr("transform", "translate(220,220)")
    //
    // // create input data: a square matrix that provides flow between entities
    // let matrix = [
    //   [11975,  5871, 8916, 2868],
    //   [ 1951, 10048, 2060, 6171],
    //   [ 8010, 16145, 8090, 8045],
    //   [ 1013,   990,  940, 6907]
    // ];
    //
    // // give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
    // let res = d3.chord()
    //     .padAngle(0.05)     // padding between entities (black arc)
    //     .sortSubgroups(d3.descending)
    //     (matrix)
    //
    // // add the groups on the inner part of the circle
    // svg
    //   .datum(res)
    //   .append("g")
    //   .selectAll("g")
    //   .data(function(d) { return d.groups; })
    //   .enter()
    //   .append("g")
    //   .append("path")
    //     .style("fill", "grey")
    //     .style("stroke", "black")
    //     .attr("d", d3.arc()
    //       .innerRadius(200)
    //       .outerRadius(210)
    //     )
    //
    // // Add the links between groups
    // svg
    //   .datum(res)
    //   .append("g")
    //   .selectAll("path")
    //   .data(function(d) { return d; })
    //   .enter()
    //   .append("path")
    //     .attr("d", d3.ribbon()
    //       .radius(200)
    //     )
    //     .style("fill", "#69b3a2")
    //     .style("stroke", "black");
    }
  }
