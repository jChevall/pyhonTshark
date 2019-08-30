import { Component, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { CircosData, RequestService } from 'src/app/services/request.service';
import * as d3 from 'd3';

const COLOR_PALETTE: string[] = [
  '#016f9e',
  '#2894d9',
  '#00bcd4',
  '#34d293',
  '#43b556',
  '#288a2e',
  '#d4e157',
  '#ffeb3b',
  '#ffca28',
  '#ff9651',
  '#f57c00',
  '#e96656',
  '#c62828',
  '#cfd8dc',
  '#546e7a'
];

@Component({
  selector: 'app-circos',
  templateUrl: './circos.component.html',
  styleUrls: ['./circos.component.css']
})
export class CircosComponent implements OnInit, OnChanges {

  private circosData: CircosData;
  @ViewChild('chart', {static: false}) chart: ElementRef;
  private svg;

  constructor(
    private requestService: RequestService,
  ) { }

  ngOnInit() {
    this.requestService.getCircosData().subscribe((res) => {
      console.log(res);
      this.circosData = res;
    });
  }

  ngOnChanges() {
  }

  /**
   * Init svg dimmension and position
   */
  private doCircos() {
    const element = this.chart.nativeElement;
    const padding = 0;
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const outerRadius = Math.min(width, height) * 0.5;
    const innerRadius = outerRadius - 20;
    if (outerRadius > 0 && innerRadius > 0) {
      this.generateCircos(innerRadius, outerRadius, width - padding, height - padding);
    }
  }

  /**
   * generate circos
   * @param innerRadius innerRadius
   * @param outerRadius outerRadius
   * @param width width in px
   * @param height height in px
   */
  private generateCircos(innerRadius, outerRadius, width, height) {
    const element = this.chart.nativeElement;
    // remove the div with the class circos-container
    d3.select('div.circos-container').remove();

    this.svg = d3.select(element)
      .append('div')
      .classed('circos-container', true)
      .append('svg')
      .attr('preserveAspectRatio', 'none')
      .attr('viewBox', `0 0 ${element.offsetWidth} ${element.offsetHeight}`)
      .classed('svg-content-responsive', true);

    const keys = Object.keys(this.circosData.matrix);

    // init differents parameters
    const chord = d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending);

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const ribbon = d3.ribbon()
      .radius(innerRadius);

    // init color palette
    const color = d3.scaleOrdinal()
      .domain(d3.range(4).map((a) => a.toString()))
      .range(COLOR_PALETTE);

    // creating legend
    const g = this.svg.append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
      .datum(chord(this.getCircosData()));

    const group = g.append('g')
      .attr('class', 'groups')
      .selectAll('g')
      .data((chords) => chords.groups)
      .enter().append('g');

    group.append('title')
      .text((d, i) => `Mac: ${keys[i]}\nTraffic: ${Math.round(d.value / 10) / 100}%`);

    const groupPath = group.append('path')
      .attr('id', (d, i) => 'group' + i)
      .style('fill', (d) => color(d.index))
      .attr('d', arc)
      .on('mouseover', this.mouseover.bind(this))
      .on('mouseout', this.mouseout.bind(this));

    const groupText = group.append('text')
      .attr('x', 6)
      .attr('dy', 15);

    groupText.append('textPath')
      .attr('xlink:href', (d, i) => '#group' + i)
      .text((d, i) => keys[i])
      .on('mouseover', this.mouseover.bind(this))
      .on('mouseout', this.mouseout.bind(this));


    groupText.filter(function (d, i) {
      return groupPath._groups[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength();
    }).remove();

    // creating arcs
    g.append('g')
      .attr('class', 'ribbons')
      .selectAll('path')
      .data((chords) => chords)
      .enter().append('path')
      .attr('d', ribbon)
      .style('fill', (d) => color(d.target.index));

    // creating tooltip
    // this.svg.selectAll('.ribbons path').append('title').text((d) =>
    //   this.data.labels[d.source.index] +
    //   ' → ' + this.data.labels[d.target.index] +
    //   ': ' + d.source.value / 1e3 +
    //   '\n' + this.data.labels[d.target.index] +
    //   ' → ' + this.data.labels[d.source.index] +
    //   ': ' + d.target.value / 1e3
    // );
  }

  /* event on mouseover on .ribbons path or legend
  * @param item *
  * @param index *
  * @param fullItems *
  */
  private mouseover(item, index, fullItems) {
    this.svg.selectAll('.ribbons path')
      .classed('fade', (a) => a.source.index !== index && a.target.index !== index)
      .transition()
      .duration(10);
  }

  /**
   * event on mouseout on .ribbons path or legend
   * @param item item
   * @param index index
   * @param fullItems fullItems
   */
  private mouseout(item, index, fullItems) {
    this.svg.selectAll('.ribbons path')
      .classed('fade', null)
      .transition()
      .duration(10);
  }

  private getCircosData() {
    return Object.keys(this.circosData.matrix).map((k) => this.circosData.matrix[k]);
  }

  // private getData() {
  //   const nbAgent = this.getRandomNumber(5, 12);
  //   const data = {
  //     labels: [],
  //     data: {}
  //   };

  //   for (let i = 0; i < nbAgent; i++) {
  //     const agentName = 'Agent #' + i;
  //     data.labels.push(agentName);
  //     data.data[agentName] = [];
  //   }

  //   Object.keys(data.data).forEach((key) => {
  //     Object.keys(data.data).forEach((key2) => {
  //       if (key !== key2) {
  //         data.data[key].push(this.getRandomNumber(0, 10000));
  //       } else {
  //         data.data[key].push(null);
  //       }
  //     });
  //   });

  //   console.log(data);
  //   return data;
  // }

  // private getRandomNumber(min, max) {
  //   return Math.floor((Math.random() * (max - min)) + min);
  // }


}
