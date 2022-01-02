import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { createSvg } from 'src/app/core/helpers/createSvg';
// import { data } from './data/data';

@Component({
  selector: 'app-project2',
  templateUrl: './project2.component.html',
  styleUrls: ['./project2.component.scss'],
})
export class Project2Component implements OnInit, AfterViewInit {
  // data: any;
  private margin = { top: 50, right: 50, bottom: 100, left: 100 };
  private divideFactor = 1.2;
  private width =
    window.innerWidth / this.divideFactor -
    (this.margin.left + this.margin.right);
  private height = 500 - (this.margin.top + this.margin.bottom);
  private svg: any;
  private initialized = false;
  private x: any;
  private y: any;
  private area: any;
  private xAxisGroup: any;
  private yAxisGroup: any;
  private color: any;
  // private time = 0;
  private formatCharacter = '$';
  private formattedData: any;

  constructor() {
    // Scales
    this.x = d3
      .scaleLog()
      .base(10)
      .range([0, this.width])
      .domain([142, 150000]);
    //.nice();

    this.y = d3.scaleLinear().range([this.height, 0]).domain([0, 90]).nice();

    this.area = d3
      .scaleLinear()
      .range([25 * Math.PI, 1500 * Math.PI])
      .domain([2000, 1400000000])
      .nice();

    this.color = d3.scaleOrdinal(d3.schemePastel1);
  }

  ngOnInit(): void {
    // this.formattedData = data.map((year: any) => {
    //   return year['countries']
    //     .filter((country: any) => {
    //       const dataExists = country.income && country.life_exp;
    //       return dataExists;
    //     })
    //     .map((country: any) => {
    //       country.income = Number(country.income);
    //       country.life_exp = Number(country.life_exp);
    //       return country;
    //     });
    // });

    // console.log(this.formattedData)

  }

  ngAfterViewInit(): void {
    // let time = 0;

    this.svg = createSvg(
      this.margin,
      'figure#project2',
      this.svg,
      this.height,
      this.divideFactor
    );

    // Labels
    const xLabel = this.svg
      .append('text')
      .attr('y', this.height + 70)
      .attr('x', this.width / 2)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .text('GDP Per Capita ($)');
    const yLabel = this.svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -170)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .text('Life Expectancy (Years)');
    const timeLabel = this.svg
      .append('text')
      .attr('y', this.height - 10)
      .attr('x', this.width - 40)
      .attr('font-size', '40px')
      .attr('opacity', '0.4')
      .attr('text-anchor', 'middle')
      .text('1800');

    // X Axis
    const xAxisCall = d3.axisBottom(this.x).tickValues([400, 4000, 40000]);
    //.tickFormat(d3.format(this.formatCharacter));

    this.svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.height})`)
      .call(xAxisCall);

    // Y Axis
    const yAxisCall = d3.axisLeft(this.y);
    this.svg.append('g').attr('class', 'y axis').call(yAxisCall);



      // run the code every 0.1 second
      // d3.interval(() => {
      //   // at the end of our data, loop back
      //   time = time < 214 ? time + 1 : 0;
      //   console.log(time);
      //   // update(formattedData[time])
      // }, 100);

      // first run of the visualization
      // update(formattedData[0])
  }
}
