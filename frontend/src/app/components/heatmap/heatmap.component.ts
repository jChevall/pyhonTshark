import { ChartData, CoupleIpAdressName } from './../../services/request.service';
import { Component, OnInit, OnChanges, Input, ViewChild, ElementRef, SimpleChanges, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { RequestService } from 'src/app/services/request.service';

/**
 * source https://material.io/guidelines/style/color.html#color-color-palette
 * '900' : [50, 100, 200, 300, 400, 500, 600]
 */
export const PALETTE_HEATMAP = {
  '#009688' : {
    namePalette: 'Teal',
    palette: ['#E0F2F1', '#B2DFDB', '#80CBC4', '#4DB6AC', '#26A69A', '#009688', '#00897B']
  },
};

const MIN_HEIGHT_RECT = 25;

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() heatmapData: ChartData;

  @Input() config;
  private data;

  afterInit;

  private chart: ElementRef;

  @ViewChild('chart', {static: false}) set content(content: ElementRef) {
     this.chart = content;
  }

  @Input() printed;

  private svg;
  private noData = false;
  public selectedColor = '#009688';
  public colors = []; // SelectItem [] = [];

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
    this.noData = false;
    d3.select('div.heatmap-container').remove();
    if (changes.heatmapData && this.heatmapData) {
      this.data = {
        labels: this.heatmapData['ip_src_array'],
        data: this.heatmapData.matrix,
      };
      this.doHeatmap();
    }
  }


  /**
   * Init svg dimmension and position and generate heatmap
   */
  private doHeatmap() {
    const element = this.chart.nativeElement;
    const width = element.offsetWidth;
    let height = 0;
    if (element.offsetHeight > Object.keys(this.data.data).length * MIN_HEIGHT_RECT) {
      height = element.offsetHeight;
    } else {
      height = Object.keys(this.data.data).length * MIN_HEIGHT_RECT;
    }
    height -= 60;
    const outerRadius = Math.min(width, height) * 0.5;
    const innerRadius = outerRadius;
    if (outerRadius > 0 && innerRadius > 0) {
      if (this.data.labels.length === 0) {
        this.noData = true;
      } else {
        this.generateHeatmap(width, height);
      }
    }
  }

  /**
   * generate heatmap
   * @param width width of the svg
   * @param height height of the svg
   */
  private generateHeatmap(width, height) {
    const element = this.chart.nativeElement;
    // remove the div with the class heatmap-container
    d3.select('div.heatmap-container').remove();

    this.svg = d3.select(element)
      .append('div')
      .classed('heatmap-container', true)
      .append('svg')
      .attr('preserveAspectRatio', 'none')
      .attr('viewBox', `0 0 ${element.offsetWidth} ${height + 50}`)
      .classed('svg-content-responsive', true);

    // init differents parameters
    const labelWidth = 200; // 100;
    const paddingTop = 40;
    const gridSize = this.getGridSize();
    const gridElementHeight = Math.floor((height - paddingTop) / gridSize.y);
    const gridElementWidth = Math.floor((width - labelWidth) / gridSize.x);
    const buckets = 9;

    // creating the y legend
    this.svg.selectAll('.yLabel')
      .data(Object.keys(this.data.data))
      .enter().append('text')
      .text((d) => this.getLabel(d))
      .attr('x', labelWidth - 1)
      .attr('y', (d, i) => i * gridElementHeight + paddingTop)
      .style('text-anchor', 'end')
      .attr('transform', 'translate(0,' + gridElementHeight / 1.5 + ')')
      .attr('class', 'dayLabel mono axis');

    // creating the x legend
    this.svg.selectAll('.xLabel')
      .data(this.data.labels)
      .enter().append('g')
      // .attr('transform',  (d, i) => 'translate( ' + (i * gridElementWidth + labelWidth) + ', ' + (height) + ')')
      .attr('transform',  (d, i) => 'translate( ' + (i * gridElementWidth + labelWidth + 10) + ', ' + 40 + ')')
      .append('text')
      .text((d) => this.getLabel(d))
      // .style('text-anchor', 'start')
      // .attr('transform', 'rotate(65)');
      .attr('transform', 'rotate(295)');

    let colors: string[] = [];
    colors = PALETTE_HEATMAP[this.selectedColor].palette

    // init color palette
    const colorScale = d3.scaleQuantile()
      .domain([0, buckets - 1, d3.max(d3.values(this.getHeatmapData()))])
      .range(colors as any);

    // assign the data
    const cards = this.svg.selectAll('.hour')
      .data(this.getHeatmapData(), (d) => d);

    cards.append('title');

    // creating rectangles
    cards.enter().append('rect')
      .attr('x', (d, i) => (i % gridSize.x) * gridElementWidth + labelWidth)
      .attr('y', (d, i) => Math.floor(i / gridSize.x) * gridElementHeight + paddingTop)
      .attr('id', (d, i) => i)
      .attr('class', 'hour bordered')
      .attr('width', gridElementWidth)
      .attr('height', gridElementHeight)
      .on('mouseover', function(d, i) {
          d3.select(this)
          .transition()
          .duration(10)
          .style('fill-opacity', 0.3);
      })
      .on('mouseout', function(d, i) {
        d3.select(this)
        .transition()
        .duration(100)
        .style('fill-opacity', 1);
      })
      .merge(cards)
      .transition()
      .duration(10)
      .style('fill', (d) => colorScale(d));

    // creating tooltips
    this.svg.selectAll('rect.hour')
      .append('title').text((value, index, array) => {
        return this.getLabel(Object.keys(this.data.data)[Math.floor(index / gridSize.x)]) +
        ' → ' + this.getLabel(this.data.labels[index % gridSize.x]) +
        ': \n ' + value;
      });
    cards.exit().remove();

    // creating color legend
    // const linearGradient = this.svg.append('linearGradient').attr('id', 'linear-gradient');

    // const gradientScale = d3.scaleLinear().range(colors as any);

    // linearGradient.selectAll('stop').data(gradientScale.range()).enter().append('stop').attr('offset', function (d, i) {
    //   return i / (gradientScale.range().length - 1);
    // }).attr('stop-color', function (d) {
    //   return d;
    // });

    // this.svg.append('rect')
    //   .attr('width', 300)
    //   .attr('height', 20)
    //   .style('fill', 'url(#linear-gradient)')
    //   .attr('transform', `translate(${element.offsetWidth})`);

    // this.svg.append('g')
    // .selectAll('text')
    // .data([0].concat(colorScale.quantiles()), (d) => {
    //     return d - (d % 1);
    // })
    // .enter()
    // .append('text')
    // .attr('class', 'octets')
    // .attr('x', function (d, i) {
    //   return '' + ((element.offsetWidth / 2) + i * 45);
    // })
    // .attr('y', (d, i) => {
    //   return 0 === i % 2 ? 38 : 8;
    // })
    // .text(function (d) {
    //   return d - (d % 1);
    // });
  }

  /**
   * return de grid size
   */
  private getGridSize() {
    const keys = Object.keys(this.data.data);
    return {
      x: this.data.data && this.data.data[keys[0]] ? this.data.data[keys[0]].length : 0,
      y: this.data.data ? Object.keys(this.data.data).length : 0
    };
  }

  /**
   *
   */
  private getHeatmapData() {
    return Object.keys(this.data.data).reduce((acc, key) => [...acc, ...this.data.data[key]], []);
  }

  private getLabel(hint: string) {
    if (this.assignementMap.get(hint)) {
      return this.assignementMap.get(hint);
    } else {
      return hint;
    }
  }

  private getDataExemple() {
    return {
      "ip_dest_array":["172.20.10.1","172.20.10.2","213.19.162.51","185.33.223.215","216.58.204.106","213.19.162.71","216.58.198.195","23.111.8.154","18.194.73.153","34.95.120.147","178.162.133.150","216.58.201.226","216.58.215.34","216.58.201.238","216.58.213.142","104.27.173.82","104.16.190.66","64.233.167.154","23.57.81.215","178.250.2.150","3.121.124.121","209.197.3.15","143.204.231.139","216.58.198.196"],
      "labels":["172.20.10.2","18.194.73.153","216.58.204.106","172.20.10.1","104.27.173.82","216.58.198.195","213.19.162.71","23.57.81.215","64.233.167.154","216.58.201.226","213.19.162.51","216.58.215.34","143.204.231.139","3.121.124.121","185.33.223.215","23.111.8.154","104.16.190.66","34.95.120.147","178.162.133.150","209.197.3.15","216.58.201.238","216.58.198.196","216.58.213.142"],
      "data":{"104.16.190.66":[0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"104.27.173.82":[0,17,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"143.204.231.139":[0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"172.20.10.1":[0,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"172.20.10.2":[13,0,12,31,52,14,5,7,11,6,6,12,9,3,1,11,5,6,5,2,4,5,3,2],"178.162.133.150":[0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"18.194.73.153":[0,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"185.33.223.215":[0,23,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"209.197.3.15":[0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"213.19.162.51":[0,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"213.19.162.71":[0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"216.58.198.195":[0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"216.58.198.196":[0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"216.58.201.226":[0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"216.58.201.238":[0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"216.58.204.106":[0,77,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"216.58.213.142":[0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"216.58.215.34":[0,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"23.111.8.154":[0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"23.57.81.215":[0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"3.121.124.121":[0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"34.95.120.147":[0,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"64.233.167.154":[0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}};
  }
}
