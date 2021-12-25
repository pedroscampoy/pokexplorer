import * as d3 from 'd3';

export function createSvg(
  margin : { top: number, right: number, bottom: number, left: number },
  htmlTag: string,
  svg: any,
  height: number,
  divideFactor: number = 3
): any {
  //const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  const width = window.innerWidth / divideFactor - (margin.left + margin.right) ;
  svg = d3
    .select(htmlTag)
    .append('svg')
    .attr('width', width + (margin.left + margin.right))
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  return svg;
}
