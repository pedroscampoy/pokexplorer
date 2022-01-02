import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-chord-types',
  templateUrl: './chord-types.component.html',
  styleUrls: ['./chord-types.component.scss']
})
export class ChordTypesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    d3.json("").then(function(data: any): void{
      console.log(data)
    })
  }

}
