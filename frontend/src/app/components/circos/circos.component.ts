import { element } from 'protractor';
import { ChartData, CoupleIpAdressName } from './../../services/request.service';
import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, SimpleChanges, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
import * as d3 from 'd3';
import { stringify } from '@angular/compiler/src/util';

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
export class CircosComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() circosData: ChartData;
  private data;

  private chart: ElementRef;
  @ViewChild('chart', {static: false}) set content(content: ElementRef) {
     this.chart = content;
  }

  private svg;

  @Input() printed;

  assignementMap = new Map();

  constructor(
    private requestService: RequestService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.requestService.readAllIpAssignement().subscribe((res) => {
      const tab: CoupleIpAdressName[] = res['data'];
      tab.forEach(element => {
        this.assignementMap.set(element.data.ipAdress, element.data.name);
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.circosData && this.circosData) {
      this.data = {
        labels: this.circosData['ip_src_array'],
        data: this.circosData.matrix,
      };
      this.doCircos();
    }
    if (changes.printed && this.printed) {
      d3.select('div.circos-container').remove();
      d3.select('h3').remove();
    }
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
      if (this.data.labels.length === 0) {
        element.innerHTML  = '<h3>Sorry but we have not found any data</h3>';
      } else {
        d3.select('h3').remove();
        this.generateCircos(innerRadius, outerRadius, width - padding, height - padding);
      }
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
    console.log('generateCircos');
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

    const keys = Object.keys(this.data.data);

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

    // Labels
    group.append('title')
      .text((d, i) => `Ip adress: ${this.getLabel(keys[i])}`); // `Mac: ${keys[i]}\nTraffic: ${Math.round(d.value / 10) / 100}%`);

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
      .text((d, i) => this.getLabel(keys[i]))
      .on('mouseover', this.mouseover.bind(this))
      .on('mouseout', this.mouseout.bind(this));


    groupText.filter(function(d, i) {
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
    this.svg.selectAll('.ribbons path').append('title').text((d) => {
      return this.getLabel(this.data.labels[d.source.index]) +
      ' → ' + this.getLabel(this.data.labels[d.target.index]) +
      ': ' + d.source.value +
      '\n' + this.getLabel(this.data.labels[d.target.index]) +
      ' → ' + this.getLabel(this.data.labels[d.source.index]) +
      ': ' + d.target.value;
      }
    );
  }

  private getLabel(hint: string) {
    if (this.assignementMap.get(hint)) {
      return this.assignementMap.get(hint);
    } else {
      return hint;
    }
  }

  /**
   * event on mouseover on .ribbons path or legend
   * @param item item
   * @param index index
   * @param fullItems fullItems
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
    return Object.keys(this.data.data).map((k) => this.data.data[k]);
  }

  private getDataExemple() {
    return {
      "ip_dest_array":["172.20.10.1","172.20.10.2","213.19.162.51","185.33.223.215","216.58.204.106","213.19.162.71","216.58.198.195","23.111.8.154","18.194.73.153","34.95.120.147","178.162.133.150","216.58.201.226","216.58.215.34","216.58.201.238","216.58.213.142","104.27.173.82","104.16.190.66","64.233.167.154","23.57.81.215","178.250.2.150","3.121.124.121","209.197.3.15","143.204.231.139","216.58.198.196"],
      "labels":["172.20.10.2","18.194.73.153","216.58.204.106","172.20.10.1","104.27.173.82","216.58.198.195","213.19.162.71","23.57.81.215","64.233.167.154","216.58.201.226","213.19.162.51","216.58.215.34","143.204.231.139","3.121.124.121","185.33.223.215","23.111.8.154","104.16.190.66","34.95.120.147","178.162.133.150","209.197.3.15","216.58.201.238","216.58.198.196","216.58.213.142"],
      "data":{"104.16.190.66":[0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"104.27.173.82":[0,17,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"143.204.231.139":[0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"172.20.10.1":[0,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"172.20.10.2":[13,0,12,31,52,14,5,7,11,6,6,12,9,3,1,11,5,6,5,2,4,5,3,2],"178.162.133.150":[0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"18.194.73.153":[0,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"185.33.223.215":[0,23,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"209.197.3.15":[0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"213.19.162.51":[0,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"213.19.162.71":[0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"216.58.198.195":[0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"216.58.198.196":[0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"216.58.201.226":[0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"216.58.201.238":[0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"216.58.204.106":[0,77,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"216.58.213.142":[0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"216.58.215.34":[0,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"23.111.8.154":[0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"23.57.81.215":[0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"3.121.124.121":[0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"34.95.120.147":[0,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"64.233.167.154":[0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}};
  }
}
