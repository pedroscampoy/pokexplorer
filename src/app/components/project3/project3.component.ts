import { Options } from '@angular-slider/ngx-slider/options';
import * as d3 from 'd3';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ThresholdNumberArrayGenerator } from 'd3';
import { createSvg } from 'src/app/core/helpers/createSvg';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FilteredCoins, ICoin } from '../../core/models/bitcoin.model';

@Component({
  selector: 'app-project3',
  templateUrl: './project3.component.html',
  styleUrls: ['./project3.component.scss'],
})
export class Project3Component implements OnInit, AfterViewInit {
  private margin = { top: 50, right: 100, bottom: 100, left: 100 };
  private divideFactor = 1.2;
  private width =
    window.innerWidth / this.divideFactor -
    (this.margin.left + this.margin.right);
  private height = 500 - (this.margin.top + this.margin.bottom);
  private svg: any;
  private x: any;
  private y: any;
  private _jsonURL = 'assets/coins.json';
  public filteredData: FilteredCoins = {};
  private xAxisCall: any;
  private yAxisCall: any;
  private xAxis: any;
  private yAxis: any;
  private coin = 'bitcoin';
  private yValue = 'price_usd';
  private yLabel: any;
  private line: any;

  // time parsers/formatters
  parseTime = d3.timeParse('%d/%m/%Y');
  formatTime = d3.timeFormat('%d/%m/%Y');
  private startDate = this.parseTime('12/5/2013')?.getTime();
  private endDate = this.parseTime('31/10/2017')?.getTime();

  // for tooltip
  bisectDate = d3.bisector((d: any) => d.date).left;

  //forms
  options: Options = {
    floor: this.startDate,
    ceil: this.endDate,
    step: 86400000, // one day,
    translate: (value: number): string => {
      return new Date(value).toLocaleDateString();
    },
  };
  form = this.fb.group({
    sliderControl: [[this.startDate, this.endDate], [Validators.required]],
    bitcoin: [['bitcoin'], [Validators.required]],
    var_select: [['price_usd'], [Validators.required]],
  });

  private sliderValues = this.form.get('sliderControl')?.value;

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getJSON().subscribe((data: any) => {
      // prepare and clean data
      Object.keys(data).forEach((coin: any) => {
        this.filteredData[coin] = data[coin]
          .filter((d: any) => {
            return !(d['price_usd'] == null);
          })
          .map((d: any) => {
            d['price_usd'] = Number(d['price_usd']);
            d['24h_vol'] = Number(d['24h_vol']);
            d['market_cap'] = Number(d['market_cap']);
            d['date'] = this.parseTime(d['date']);
            return d;
          });
      });
      this.update();
    });
  }

  ngAfterViewInit(): void {
    this.svg = createSvg(
      this.margin,
      'figure#project3',
      this.svg,
      this.height,
      this.divideFactor
    );

    // add the line for the first time
    this.svg
      .append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'grey')
      .attr('stroke-width', '3px');

    // axis labels
    const xLabel = this.svg
      .append('text')
      .attr('class', 'x axisLabel')
      .attr('y', this.height + 50)
      .attr('x', this.width / 2)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .text('Time');
    this.yLabel = this.svg
      .append('text')
      .attr('class', 'y axisLabel')
      .attr('transform', 'rotate(-90)')
      .attr('y', -60)
      .attr('x', -170)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .text('Price ($)');

    // scales
    this.x = d3.scaleTime().range([0, this.width]);
    this.y = d3.scaleLinear().range([this.height, 0]);

    // axis generators
    this.xAxisCall = d3.axisBottom(this.x);
    this.yAxisCall = d3
      .axisLeft(this.y)
      .ticks(6)
      .tickFormat((d: any) => `${d / 1000}k`);

    // axis groups
    this.xAxis = this.svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.height})`);
    this.yAxis = this.svg.append('g').attr('class', 'y axis');
  }

  // event listeners
  get sliderControl() {
    return this.form.get('sliderControl');
  }

  onChangeBitcoin(event: any) {
    this.coin = event.value;
    this.update();
  }
  onChangeVarSelect(event: any) {
    this.yValue = event.value;
    this.update();
  }

  onChangeRange(event: any) {
    this.sliderValues = [event.value, event.highValue]
    this.update();
  }
  public getJSON(): Observable<any> {
    return this.http.get(this._jsonURL);
  }

  update() {
    const t = d3.transition().duration(1000);

    // filter data based on selections
    const dataTimeFiltered = this.filteredData[this.coin].filter((d) => {
      return d.date >= this.sliderValues[0] && d.date <= this.sliderValues[1];
    });

    // update scales
    this.x.domain(d3.extent(dataTimeFiltered, (d) => d.date));
    this.y.domain([
      d3.min(dataTimeFiltered, (d: any) => d[this.yValue]) / 1.005,
      d3.max(dataTimeFiltered, (d: any) => d[this.yValue]) * 1.005,
    ]);

    // fix for format values
    // const formatSi = d3.format('.2s');
    // function formatAbbreviation(x: any) {
    //   const s = formatSi(x);
    //   switch (s[s.length - 1]) {
    //     case 'G':
    //       return s.slice(0, -1) + 'B'; // billions
    //     case 'k':
    //       return s.slice(0, -1) + 'K'; // thousands
    //   }
    //   return s;
    // }

    // update axes
    this.xAxisCall.scale(this.x);
    this.xAxis.transition(t).call(this.xAxisCall);
    this.yAxisCall.scale(this.y);
    this.yAxis
      .transition(t)
      .call(this.yAxisCall);
      //.call(this.yAxisCall.tickFormat(formatAbbreviation));

    // clear old tooltips
    // d3.select('.focus').remove();
    // d3.select('.overlay').remove();

    /******************************** Tooltip Code ********************************/

    // const focus = this.svg.append("g")
    //   .attr("class", "focus")
    //   .style("display", "none")

    // focus.append("line")
    //   .attr("class", "x-hover-line hover-line")
    //   .attr("y1", 0)
    //   .attr("y2", this.height)

    // focus.append("line")
    //   .attr("class", "y-hover-line hover-line")
    //   .attr("x1", 0)
    //   .attr("x2", this.width)

    // focus.append("circle")
    //   .attr("r", 7.5)

    // focus.append("text")
    //   .attr("x", 15)
    //   .attr("dy", ".31em")

    // this.svg.append("rect")
    //   .attr("class", "overlay")
    //   .attr("width", this.width)
    //   .attr("height", this.height)
    //   .on("mouseover", () => focus.style("display", null))
    //   .on("mouseout", () => focus.style("display", "none"))
    //   .on("mousemove", mousemove)

    // function mousemove() {
    //   const x0 = x.invert(d3.mouse(this)[0])
    //   const i = this.bisectDate(dataTimeFiltered, x0, 1)
    //   const d0 = dataTimeFiltered[i - 1]
    //   const d1 = dataTimeFiltered[i]
    //   const d = x0 - d0.date > d1.date - x0 ? d1 : d0
    //   focus.attr("transform", `translate(${this.x(d.date)}, ${this.y(d[yValue])})`)
    //   focus.select("text").text(d[yValue])
    //   focus.select(".x-hover-line").attr("y2", HEIGHT - y(d[yValue]))
    //   focus.select(".y-hover-line").attr("x2", -x(d.date))
    // }

    /******************************** Tooltip Code ********************************/

    // Path generator
    this.line = d3
      .line()
      .x((d: any) => this.x(d.date))
      .y((d: any) => this.y(d[this.yValue]));

    // Update our line path
    this.svg
      .select('.line')
      .transition(t)
      .attr('d', this.line(dataTimeFiltered));

    // Update y-axis label
    const newText =
      this.yValue === 'price_usd'
        ? 'Price ($)'
        : this.yValue === 'market_cap'
        ? 'Market Capitalization ($)'
        : '24 Hour Trading Volume ($)';
    this.yLabel.text(newText);
  }
}
