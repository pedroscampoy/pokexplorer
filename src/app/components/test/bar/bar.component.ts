import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Framework } from 'src/app/core/models/framework.model';
import { createSvg } from 'src/app/core/helpers/createSvg';
import { SvgInHtml } from 'src/app/core/models/svgInHtml.model';
import { Store } from '@ngrx/store';
import { dataSelector } from 'src/app/core/store/selectors';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
})
export class BarComponent implements OnInit {
  //dataValue!: any;
  dataStore$ = this.store.select(dataSelector);
  data: any;
  private margin = { top: 50, right: 50, bottom: 100, left: 100 };
  private divideFactor = 3;
  private width =
    window.innerWidth / this.divideFactor -
    (this.margin.left + this.margin.right);
  private height = 400 - (this.margin.top + this.margin.bottom);
  private svg: any;
  private x: any;
  private y: any;
  private xAxisGroup: any;
  private yAxisGroup: any;
  private color: any;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.svg = createSvg(
      this.margin,
      'figure#bar',
      this.svg,
      this.height,
      this.divideFactor
    );

    this.createAxis();
    this.createLabel();
    this.dataStore$.subscribe((data: any) => {
      this.drawBars(data);
    });
  }

  createAxis(): void {
    this.x = d3.scaleBand().range([0, this.width]).padding(0.2);
    this.y = d3.scaleLinear().range([this.height, 0]);
    this.yAxisGroup = this.svg.append('g').attr('class', 'y axis');
    this.xAxisGroup = this.svg
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(0,' + this.height + ')');
  }

  createLabel(): void {
    // X label
    this.svg
      .append('text')
      .attr('class', 'x axis-label')
      .attr('x', this.width / 2)
      .attr('y', this.height + 60)
      .attr('font-size', '15px')
      .attr('text-anchor', 'middle')
      .text('Framework');

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
  }

  // ngOnChanges() {
  //   if (this.initialized) {
  //     this.data = this.dataValue['data'];
  //     this.drawBars(this.data);
  //   }
  // }

  private drawBars(data: any[]): void {
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
    const t = d3.transition().duration(750);
    // Create the X-axis band scale
    this.x.domain(data.map((d: Framework) => d.Framework));
    // Draw the X-axis on the DOM
    this.xAxisGroup
      .transition(t)
      .call(d3.axisBottom(this.x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', 'translate(-10,0)rotate(-45)');

    // Create the Y-axis band scale
    this.y.domain([0, d3.max(data, (d) => d.Stars)]);
    // Draw the Y-axis on the DOM
    this.yAxisGroup.transition(t).call(d3.axisLeft(this.y).ticks(10));

    // JOIN new data with old elements.
    let rects = this.svg
      .selectAll('rect')
      .data(data, (d: Framework) => d.Framework);

    // EXIT old elements not present in new data.
    rects
      .exit()
      .attr('fill', 'red')
      .transition(t)
      .attr('height', 0)
      .attr('y', this.y(0))
      .remove();

    // ENTER new elements present in new data...
    rects
      .enter()
      .append('rect')
      .attr('fill', (d: Framework) => this.color(d.Framework))
      .attr('y', this.y(0))
      .attr('height', 0)
      // AND UPDATE old elements present in new data.
      .merge(rects)
      .transition(t)
      .attr('x', (d: Framework) => this.x(d.Framework))
      .attr('width', this.x.bandwidth)
      .attr('y', (d: Framework) => this.y(d.Stars))
      .attr('height', (d: Framework) => this.height - this.y(d.Stars));
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

// const y = d3.scaleLinear().domain([0, d3.max(data, d => d.Stars)]).range([this.height, 0]);

//     // Draw the Y-axis on the DOM
//     this.svg.append('g').call(d3.axisLeft(y));

//     // Create and fill the bars
//     let bars = this.svg.selectAll('.bar').data(data);

//     bars.exit().transition().duration(1000).attr('height', 0).remove();

//     bars
//       .enter()
//       .append('rect')
//       .attr('class', 'bar')
//       .attr('x', (d: Framework) => x(d.Framework))
//       .attr('y', (d: Framework) => y(d.Stars))
//       .attr('height', 0)
//       .attr('width', x.bandwidth())
//       .attr('fill', '#d04a35')
//       .merge(bars)
//       .transition()
//       .duration(1000)
//       .delay(1000)
//       .attr('x', (d: Framework) => x(d.Framework))
//       .attr('height', (d: Framework) => this.height - y(d.Stars))
