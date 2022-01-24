import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as d3 from 'd3';
// import * as d3tip from 'd3-tip';
import { Observable } from 'rxjs';
import { createSvg } from 'src/app/core/helpers/createSvg';

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
  private x: any;
  private y: any;
  private area: any;
  private xAxisGroup: any;
  private yAxisGroup: any;
  private color: any;
  public time = 0;
  private formatCharacter = '$';
  private format: any;
  private formattedData: any;
  private interval!: ReturnType<typeof setTimeout>;
  private timeLabel: any;
  private _jsonURL = 'assets/countries.json';
  public continents: Array<string> = [];
  private selectedContinent = 'all'
  private legend: any;
  // private tip: any;
  public icon = true;
  public defaultContinent = 'all'

  form = this.fb.group({
    continentName: ['all', [Validators.required]],
  });

  formatLabel(value: number) {
    return value + 1800;
  }

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getJSON().subscribe((data) => {
      this.formattedData = data.map((year: any) => {
        return year['countries']
          .filter((country: any) => {
            const dataExists = country.income && country.life_exp;
            return dataExists;
          })
          .map((country: any) => {
            if (!this.continents.includes(country.continent)) {
              this.continents.push(country.continent);
            }
            country.income = Number(country.income);
            country.life_exp = Number(country.life_exp);
            return country;
          });
      });
      this.update(this.formattedData[this.time]);
      this.drawLegend();
    });
  }

  ngAfterViewInit(): void {
    // d3.interval(() => {
    //   // at the end of our data, loop back
    //   this.step()
    // }, 100);

    // Tooltip
    // this.tip = d3.tip()
    //   .attr('class', 'd3-tip')
    //   .html((d: any): string => {
    //     let text = `<strong>Country:</strong> <span style='color:red;text-transform:capitalize'>${d.country}</span><br>`
    //     text += `<strong>Continent:</strong> <span style='color:red;text-transform:capitalize'>${d.continent}</span><br>`
    //     text += `<strong>Life Expectancy:</strong> <span style='color:red'>${d3.format(".2f")(d.life_exp)}</span><br>`
    //     text += `<strong>GDP Per Capita:</strong> <span style='color:red'>${d3.format("$,.0f")(d.income)}</span><br>`
    //     text += `<strong>Population:</strong> <span style='color:red'>${d3.format(",.0f")(d.population)}</span><br>`
    //     return text
    //   })

    // this.svg.call(this.tip)

    // Scales
    this.x = d3
      .scaleLog()
      .base(10)
      .range([0, this.width])
      .domain([142, 150000])
      .nice();

    this.y = d3.scaleLinear().range([this.height, 0]).domain([0, 90]).nice();

    this.area = d3
      .scaleLinear()
      .range([25 * Math.PI, 1500 * Math.PI])
      .domain([2000, 1400000000])
      .nice();

    this.color = d3.scaleOrdinal(d3.schemePastel1);

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
    this.timeLabel = this.svg
      .append('text')
      .attr('y', this.height - 10)
      .attr('x', this.width - 40)
      .attr('font-size', '40px')
      .attr('opacity', '0.4')
      .attr('text-anchor', 'middle')
      .text('1800');

    // X Axis
    this.format = d3.format(this.formatCharacter);
    const xAxisCall = d3
      .axisBottom(this.x)
      .tickValues([400, 4000, 40000])
      .tickFormat(this.format);

    this.svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.height})`)
      .call(xAxisCall);

    // Y Axis
    const yAxisCall = d3.axisLeft(this.y);
    this.svg.append('g').attr('class', 'y axis').call(yAxisCall);
  }

  update(data: any) {
    // standard transition time for the visualization
    const t = d3.transition().duration(100);

    const filteredData = data.filter((d: any) => {
      if (this.selectedContinent === "all") return true
      else {
        return d.continent == this.selectedContinent
      }
    })

    // JOIN new data with old elements.
    const circles = this.svg
      .selectAll('circle')
      .data(filteredData, (d: any) => d.country);

    // EXIT old elements not present in new data.
    circles.exit().remove();

    // ENTER new elements present in new data.
    circles
      .enter()
      .append('circle')
      .attr('fill', (d: any) => this.color(d.continent))
      .merge(circles)
      .transition(t)
      .attr('cy', (d: any) => this.y(d.life_exp))
      .attr('cx', (d: any) => this.x(d.income))
      .attr('r', (d: any) => Math.sqrt(this.area(d.population) / Math.PI));

    // update the time label
    this.timeLabel.text(String(this.time + 1800));
  }

  //Legend
  drawLegend(): void {
    this.legend = this.svg
      .append('g')
      .attr('class', 'legend')
      .attr(
        'transform',
        `translate( ${this.width - 10},  ${this.height - 125})`
      );

    this.continents.forEach((continent, i) => {
      const legendRow = this.legend
        .append('g')
        .attr('class', 'legend-sub')
        .attr('transform', `translate( 0,  ${i * 20})`);

      legendRow
        .append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', this.color(continent));

      legendRow
        .append('text')
        .attr('x', -10)
        .attr('y', 10)
        .attr('text-anchor', 'end')
        .style('text-transform', 'capitalize')
        .text(continent);
    });
  }

  step(): void {
    // at the end of our data, loop back
    this.time = this.time < 214 ? this.time + 1 : 0;
    this.update(this.formattedData[this.time]);
  }

  onClickPlay(): void {
    if (this.icon) {
      this.icon = !this.icon;
      this.interval = setInterval(() => this.step(), 100);
    } else {
      this.icon = !this.icon;
      clearInterval(this.interval);
    }
  }

  onClickReset(): void {
    this.time = 0;
    this.update(this.formattedData[this.time]);
  }

  // get continentName() {
  //   return this.form.get('continentName');
  // }

  onChangeContinent(event: any) {
    this.selectedContinent = event.value
    this.update(this.formattedData[this.time])
  }

  onChangeTime(event: any) {
    this.time = event.value
    this.update(this.formattedData[this.time])
  }

  public getJSON(): Observable<any> {
    return this.http.get(this._jsonURL);
  }
}
