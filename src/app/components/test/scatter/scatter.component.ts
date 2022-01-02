import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { createSvg } from 'src/app/core/helpers/createSvg';
import { Framework } from 'src/app/core/models/framework.model';

@Component({
  selector: 'app-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.scss'],
})
export class ScatterComponent implements OnInit, OnChanges {
  @Input() dataValue!: any;
  data: any;
  private margin = { top: 50, right: 50, bottom: 100, left: 100 };
  private divideFactor = 2;
  private width =
    window.innerWidth / this.divideFactor -
    (this.margin.left + this.margin.right);
  private height = 400 - (this.margin.top + this.margin.bottom);
  private svg: any;
  private initialized = false;
  private x: any;
  private y: any;
  private xAxisGroup: any;
  private yAxisGroup: any;
  private color: any;

  constructor() {
    this.x = d3.scaleLinear()
      .range([0, this.width])
      .nice();

    this.y = d3.scaleLinear()
      .range([this.height, 0])
      .nice();
  }
  ngOnInit(): void {
    this.svg = createSvg(
      this.margin,
      'figure#scatter',
      this.svg,
      this.height,
      this.divideFactor
    );

    // X label
    this.svg
      .append('text')
      .attr('class', 'x axis-label')
      .attr('x', this.width / 2)
      .attr('y', this.height + 60)
      .attr('font-size', '15px')
      .attr('text-anchor', 'middle')
      .text('Years');

    // Y label
    this.svg
      .append('text')
      .attr('class', 'y axis-label')
      .attr('x', -(this.height / 2))
      .attr('y', -60)
      .attr('font-size', '15px')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Stars');

    this.xAxisGroup = this.svg
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(0,' + this.height + ')');

    this.yAxisGroup = this.svg
      .append('g')
      .attr('class', 'y axis');

    this.data = this.dataValue['data'];
    this.drawPlot(this.data);
    this.initialized = true;
  }

  ngOnChanges() {
    if (this.initialized) {
      this.data = this.dataValue['data'];
      this.drawPlot(this.data);
    }
  }

  private drawPlot(data: any[]): void {
    //Set dynamic colors
    this.color = d3
      .scaleOrdinal()
      .domain(data.map((d: Framework) => d.Framework))
      .range(
        data.map((group, i) => {
          const t = i / data.length;
          return d3.hcl(t * 360, 50, 80);
        })
      );
    const t = d3.transition().duration(750)
    // Create the X-axis band scale
    this.x.domain([d3.min(data, (d) => d.Released) - 2, d3.max(data, (d) => d.Released)])
    // Draw the X-axis on the DOM
    this.xAxisGroup.transition(t).call(d3.axisBottom(this.x).ticks(this.data.length));

    // Create the Y-axis band scale
    this.y.domain([0, d3.max(data, (d) => d.Stars)]);
    // Draw the Y-axis on the DOM
    this.yAxisGroup.transition(t).call(d3.axisLeft(this.y).ticks(10));

    // JOIN new data with old elements.
    let circles = this.svg
      .selectAll('circle')
      .data(data,  (d: Framework) => d.Framework);

    // EXIT old elements not present in new data.
    circles
    .exit()
    .attr("fill", "red")
    .transition(t)
      .attr("cy", this.y(0))
      .remove()

    // ENTER new elements present in new data...
    circles
      .enter()
      .append('circle')
      .attr("fill", (d: Framework)  => this.color(d.Framework))
      .attr("cy", this.y(0))
      .attr('r', 7)
      // AND UPDATE old elements present in new data.
      .merge(circles)
      .transition(t)
        .attr("cx",  (d: Framework)  => this.x(d.Released))
        .attr("cy",  (d: Framework)  => this.y(d.Stars))
  }
}


// private drawPlot(data: any[]): void {
//   // Add X axis
//   const x = d3.scaleLinear().domain([2009, 2017]).range([0, this.width]);
//   this.svg
//     .append('g')
//     .attr('transform', 'translate(0,' + this.height + ')')
//     .call(d3.axisBottom(x).tickFormat(d3.format('d')));

//   // Add Y axis
//   const y = d3.scaleLinear().domain([0, 200000]).range([this.height, 0]);
//   this.svg.append('g').call(d3.axisLeft(y));

//   // Add dots
//   const dots = this.svg.append('g');
//   dots
//     .selectAll('dot')
//     .data(this.data)
//     .enter()
//     .append('circle')
//     .attr('cx', (d: any) => x(d.Released))
//     .attr('cy', (d: any) => y(d.Stars))
//     .attr('r', 7)
//     .style('opacity', 0.5)
//     .style('fill', '#69b3a2');

//   // Add labels
//   dots
//     .selectAll('text')
//     .data(this.data)
//     .enter()
//     .append('text')
//     .text((d: any) => d.Framework)
//     .attr('x', (d: any) => x(d.Released))
//     .attr('y', (d: any) => y(d.Stars));
// }
