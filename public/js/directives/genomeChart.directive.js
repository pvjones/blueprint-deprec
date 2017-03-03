(function() {
  angular
    .module('app')
    .directive('genomeChart', genomeChart);

  function genomeChart(ChartResizeService) {

    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function(scope, elem, attrs) {

          let chartElement = elem[0];

          let width = ChartResizeService.calculateElementWidth(chartElement)
          window.onresize = (event) => {
            width = ChartResizeService.calculateElementWidth(chartElement)
            updateChart()
          };

          scope.$watch("data", (n, o) => {
            if (n !== o) {
              updateChart();
            }
          });

          let margins = {
            top: 5,
            left: 5,
            right: 5,
            bottom: 5
          };

          let height = 40 - margins.top - margins.bottom;

          let dataset = [
            [{
              id: 1,
              length: 249250621
            }],
            [{
              id: 2,
              length: 243199373
            }],
            [{
              id: 3,
              length: 198022430
            }],
            [{
              id: 4,
              length: 191154276
            }],
            [{
              id: 5,
              length: 180915260
            }],
            [{
              id: 6,
              length: 171115067
            }],
            [{
              id: 7,
              length: 159138663
            }],
            [{
              id: 8,
              length: 146364022
            }],
            [{
              id: 9,
              length: 141213431
            }],
            [{
              id: 10,
              length: 135534747
            }],
            [{
              id: 11,
              length: 135006516
            }],
            [{
              id: 12,
              length: 133851895
            }],
            [{
              id: 13,
              length: 115169878
            }],
            [{
              id: 14,
              length: 107349540
            }],
            [{
              id: 15,
              length: 102531392
            }],
            [{
              id: 16,
              length: 90354753
            }],
            [{
              id: 17,
              length: 81195210
            }],
            [{
              id: 18,
              length: 78077248
            }],
            [{
              id: 19,
              length: 59128983
            }],
            [{
              id: 20,
              length: 63025520
            }],
            [{
              id: 21,
              length: 48129895
            }],
            [{
              id: 22,
              length: 51304566
            }],
            [{
              id: 23,
              length: 155270560
            }]
          ]

          // DATA FORMATTING (SPECIFIC TO D3 V3)
          // GENOME/CHROMOSOMES

          let datasetMod1 = dataset.map(function(elem) {
            return elem.map(function(e, i) {
              // Structure it so that numeric
              // axis (the stacked amount) is y
              return {
                y: e.length,
                x: e.id
              };
            });
          });

          let stack = d3.layout.stack();
          stack(datasetMod1);

          let datasetMod2 = datasetMod1.map(function(group) {
            return group.map(function(d) {
              // Invert the x and y values, and y0 becomes x0
              return {
                x: d.y,
                y: d.x,
                x0: d.y0
              };
            });
          });

          let dataTEST = [{
            name: 'foo',
            value: 100000000
          }, {
            name: 'bar',
            value: 200000000
          }]

          var tip = d3.tip()
            .attr('class', 'd3-tip')
            .html(function(d) {
              return `<span class='tooltip-rsid'>RSID: ${d.rsid}</span><br /><span class='tooltip-chromosome'>Chromosome:  ${d.chromosome}</span><br /><span class='tooltip-position'>Positon:  ${d.position}</span>`;
            })


          //DRAW CHART

          function updateChart() {

            let snpVals = getSnpVals(scope.data);

            d3.select(elem[0]).selectAll('svg').remove()

            let svg = d3.select(elem[0])
              .append('svg')
              .attr('width', width + margins.left + margins.right)
              .attr('height', height + 100 + margins.bottom + margins.top)

          

            let xMax = d3.max(datasetMod2, (group) => {
              return d3.max(group, (d) => {
                return d.x + d.x0;
              });
            });

            let xScale = d3.scale.linear()
              .domain([0, xMax])
              .range([0, width])

            let colors = d3.scale.linear()
              .domain([1, width / 20])
              .interpolate(d3.interpolateHcl)
              .range([d3.rgb("#104f99"), d3.rgb('#f75050')]);

            let series = svg.append('g')
              .attr('transform', `translate(${margins.left},${margins.top})`)
              .selectAll('g')
              .data(datasetMod2);

            series.enter().append('g')
              .style('fill', (d, i) => {
                return colors(i);
              })
              .attr('fill-opacity', 0.6)
              .style('stroke', (d, i) => {
                return colors(i);
              })
              .style('stroke-width', 1)

            d3.selectAll('rect').remove()

            let rects = series.selectAll('rect')
              .data((d) => {
                return d;
              });

            rects.enter().append('rect')
              .attr('x', (d) => {
                return xScale(d.x0);
              })
              .attr('height', 30)
              .attr('width', (d) => {
                return xScale(d.x) - 3;
              }) 


            /////////

            let series2 = svg.append('g')
              .selectAll('g')
              .data(snpVals);

            series2.enter().append('g')
              .attr('fill', 'red')
              .attr('stroke', '#004a71')
              .attr('stroke-width', 1)
              .attr('opacity', 0.8)

            let rects2 = series2.selectAll('rect')
              .data(snpVals);

            rects2.enter().append('rect')
              .attr('class', 'snp-line')
              .attr('x', (d) => {
                return xScale(d.totalPosition)
              })
              .attr('height', 40)
              .attr('width', 4)
              
            // rects2.enter().append("text")
            //   .attr("class", "map-text")
            //   .attr("x", (d) => {
            //     return xScale(d.totalPosition) + 5
            //   })
            //   .attr("y", 45)
            //   .attr("dy", ".35em")
            //   .text((d) => {
            //     return d.rsid;
            //   })

            d3.selectAll('.snp-line').call(tip)
            d3.selectAll('.snp-line')
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide)

            // overlap();

          }; //END OF UPDATE FUNCTION

          //UTILTIY FUNCTIONS

          function calculateTextPosition() {}

          function getSnpVals(snpArray) {
            let snpVals = snpArray.map((elem) => {
              let snp = elem;
              snp.totalPosition = calculateSnpPosition(elem);
              return snp;
            });
            console.log(snpVals);
            return snpVals;
          };

          function calculateSnpPosition(snpObj) {
            let position = 0;
            for (let i = 0; i <= snpObj.chromosome - 1; i++) {
              position += +dataset[i][0].length;
            }
            position += +snpObj.position;
            return position;
          };

          // function overlap() {
          //   var move = 1;
          //   while (move > 0) {
          //     move=0;
          //     d3.selectAll('.map-text')
          //       .each(function() {
          //         var that = this,
          //           a = this.getBoundingClientRect();
          //         console.log(a)
          //         d3.selectAll('.map-text')
          //           .each(function() {
          //             if (this != that) {
          //               var b = this.getBoundingClientRect();
          //               if ((Math.abs(a.left - b.left) * 2 < (a.width + b.width)) &&
          //                 (Math.abs(a.top - b.top) * 2 < (a.height + b.height))) {
          //                 // overlap, move labels
          //                 var dx = (Math.max(0, a.right - b.left) +
          //                     Math.min(0, a.left - b.right)) * 0.01,
          //                   dy = (Math.max(0, a.bottom - b.top) +
          //                     Math.min(0, a.top - b.bottom)) * 0.02,
          //                   tt = d3.transform(d3.select(this).attr("transform")),
          //                   to = d3.transform(d3.select(that).attr("transform"));
          //                 move += Math.abs(dx) + Math.abs(dy);

          //                 to.translate = [to.translate[0] + dx, to.translate[1] + dy];
          //                 tt.translate = [tt.translate[0] - dx, tt.translate[1] - dy];
          //                 d3.select(this).attr("transform", "translate(" + tt.translate + ")");
          //                 d3.select(that).attr("transform", "translate(" + to.translate + ")");
          //                 a = this.getBoundingClientRect();
          //               }
          //             }
          //           })
          //       })
          //   }
          // }

        } //end of link
    };
  };
})();