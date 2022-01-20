import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import countries from './data/data.json';

// import * as d3 from 'd3';

@Component({
  selector: 'app-chord-types',
  templateUrl: './chord-types.component.html',
  styleUrls: ['./chord-types.component.scss'],
})
export class ChordTypesComponent implements OnInit {
  // public countryList:{name:string, code:string}[] = countries;
  private _jsonURL = 'assets/data.json';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // this.getJSON().subscribe((data) => {
    //   console.log(data);
    // });
    //   d3.json(this._jsonURL).then(function(data){
    //   console.log(data)
    // })
   }

  public getJSON(): Observable<any> {
    return this.http.get(this._jsonURL);
  }
}
