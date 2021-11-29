import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Framework } from 'src/app/core/models/framework.model';
import { createSvg } from 'src/app/core/helpers/createSvg';
import { SvgInHtml } from 'src/app/core/models/svgInHtml.model';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
})
export class BarComponent implements OnInit, OnChanges {
  @Input() dataValue!: any;
  data: any;
  private margin = { top: 50, right: 50, bottom: 50, left: 50 };
  private divideFactor = 3;
  private width =
    window.innerWidth / this.divideFactor -
    (this.margin.left + this.margin.right);
  private height = 400 - this.margin.top * 2;
  private svg: any;
  private initialized = false;

  constructor() {}
  ngOnInit(): void {
    this.data = this.dataValue['data'];
    this.svg = createSvg(
      'figure#bar',
      this.svg,
      this.height,
      this.divideFactor
    );
    console.log('init SVG', this.svg);
    this.drawBars(this.data);
    this.initialized = true;
  }

  ngOnChanges() {
    if (this.initialized) {
      this.data = this.dataValue['data'];
      this.drawBars(this.data);
    }
  }

  // private createSvg(): void {
  //   this.svg = d3
  //     .select('figure#bar')
  //     .append('svg')
  //     .attr('width', this.width + this.margin * 2)
  //     .attr('height', this.height + this.margin * 2)
  //     .append('g')
  //     .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  // }

  private drawBars(data: any[]): void {
    // Create the X-axis band scale
    const x = d3
      .scaleBand()
      .range([0, this.width])
      .domain(data.map((d) => d.Framework))
      .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Create the Y-axis band scale
    const y = d3.scaleLinear().domain([0, 200000]).range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append('g').call(d3.axisLeft(y));

    // Create and fill the bars
    let bars = this.svg.selectAll('.bar').remove().exit().data(data);
    bars
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d: Framework) => x(d.Framework))
      .attr('y', (d: Framework) => y(d.Stars))
      .attr('width', x.bandwidth())
      .attr('height', (d: Framework) => this.height - y(d.Stars))
      .attr('fill', '#d04a35');
    bars.exit().remove();
  }

  private updateBars(data: any[]): void {
    console.log('ipdate');
    console.log(this.svg);
    const x = d3
      .scaleBand()
      .range([0, this.width])
      .domain(data.map((d) => d.Framework))
      .padding(0.2);

    const y = d3.scaleLinear().domain([0, 200000]).range([this.height, 0]);

    console.log('update after', this.svg);

    let bars = this.svg.select('g').selectAll('bars').data(data);
    console.log('bars', bars);

    bars.exit().remove(); //remove unneeded bars
    bars.enter().append('rect'); //create any new bars needed

    //update all bars to new positions
    bars
      .transition()
      .duration(500)
      .attr('x', (d: Framework) => x(d.Framework))
      .attr('y', (d: Framework) => y(d.Stars))
      .attr('width', x.bandwidth())
      .attr('height', (d: Framework) => this.height - y(d.Stars))
      .attr('fill', '#d04a35');
  }
}
