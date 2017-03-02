(function() {
    angular
      .module('app')
      .directive('genomeChart', genomeChart);

    function genomeChart() {

      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        link: function(scope, elem, attrs) {

          var margins = {
            top: 5,
            left: 5,
            right: 5,
            bottom: 5
          };
          var width = 500 - margins.left - margins.right;
          var height = 40 - margins.top - margins.bottom;

          var chromosomeRef = {
            1: 249250621,
            2: 243199373,
            3: 198022430,
            4: 191154276,
            5: 180915260,
            6: 171115067,
            7: 159138663,
            8: 146364022,
            9: 141213431,
            10: 135534747,
            11: 135006516,
            12: 133851895,
            13: 115169878,
            14: 107349540,
            15: 102531392,
            16: 90354753,
            17: 81195210,
            18: 78077248,
            19: 59128983,
            20: 63025520,
            21: 48129895,
            22: 51304566,
            23: 155270560
          }

          var dataset = [{

            data: [{
              id: 1,
              length: 249250621
            }],
            name: 'chromosome1'
          }, {
            data: [{
              id: 2,
              length: 243199373
            }],
            name: 'chromosome2'
          }, {
            data: [{
              id: 3,
              length: 198022430
            }],
            name: 'chromosome3'
          }, {
            data: [{
              id: 4,
              length: 191154276
            }],
            name: 'chromosome4'
          }, {
            data: [{
              id: 5,
              length: 180915260
            }],
            name: 'chromosome5'
          }, {
            data: [{
              id: 6,
              length: 171115067
            }],
            name: 'chromosome6'
          }, {
            data: [{
              id: 7,
              length: 159138663
            }],
            name: 'chromosome7'
          }, {
            data: [{
              id: 8,
              length: 146364022
            }],
            name: 'chromosome8'
          }, {
            data: [{
              id: 9,
              length: 141213431
            }],
            name: 'chromosome9'
          }, {
            data: [{
              id: 10,
              length: 135534747
            }],
            name: 'chromosome10'
          }, {
            data: [{
              id: 11,
              length: 135006516
            }],
            name: 'chromosome11'
          }, {
            data: [{
              id: 12,
              length: 133851895
            }],
            name: 'chromosome12'
          }, {
            data: [{
              id: 13,
              length: 115169878
            }],
            name: 'chromosome13'
          }, {
            data: [{
              id: 14,
              length: 107349540
            }],
            name: 'chromosome14'
          }, {
            data: [{
              id: 15,
              length: 102531392
            }],
            name: 'chromosome15'
          }, {
            data: [{
              id: 16,
              length: 90354753
            }],
            name: 'chromosome16'
          }, {
            data: [{
              id: 17,
              length: 81195210
            }],
            name: 'chromosome17'
          }, {
            data: [{
              id: 18,
              length: 78077248
            }],
            name: 'chromosome18'
          }, {
            data: [{
              id: 19,
              length: 59128983
            }],
            name: 'chromosome19'
          }, {
            data: [{
              id: 20,
              length: 63025520
            }],
            name: 'chromosome20'
          }, {
            data: [{
              id: 21,
              length: 48129895
            }],
            name: 'chromosome21'
          }, {
            data: [{
              id: 22,
              length: 51304566
            }],
            name: 'chromosome22'
          }, {
            data: [{
              id: 23,
              length: 155270560
            }],
            name: 'chromosome23'
          }]

          var dataset = dataset.map(function(d) {
            return d.data.map(function(e, i) {
              // Structure it so that your numeric
              // axis (the stacked amount) is y
              return {
                y: e.length,
                x: e.id
              };
            });
          });

          var stack = d3.layout.stack();

          stack(dataset);

          var dataset = dataset.map(function(group) {
            return group.map(function(d) {
              // Invert the x and y values, and y0 becomes x0
              return {
                x: d.y,
                y: d.x,
                x0: d.y0
              };
            });
          });



          scope.$watch("data", (n, o) => {
            if (n !== o) {
              updateChart();
            }
          })

          function updateChart() {

          let snpVals = []

          scope.data.forEach((elem) => {
            let position = 0; 

            let chromosomeNums = []
            for (let i = 1; i <= elem.chromosome; i++) {
              chromosomeNums.push(i)
            }
            chromosomeNums.forEach((elem) => {
              position += chromosomeRef[elem];
            })

            position += +elem.position;
            snpVals.push(position)
            
          }) //END OF FOREACH

          console.log("genome-chart directive", snpVals)

          let svg = d3.select(elem[0])
            .append('svg')
            .attr('width', width + margins.left + margins.right)
            .attr('height', height + margins.bottom + margins.top)
            .append('g')
            .attr('transform', `translate(${margins.left},${margins.top})`)

          let xMax = d3.max(dataset, function(group) {
            return d3.max(group, function(d) {
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

          let groups = svg.selectAll('g')
            .data(dataset)

          groups.exit().transition().duration(0).remove()

          groups.enter().append('g')
            .style('fill', function(d, i) {
              return colors(i);
            })
            .attr('fill-opacity', 0.6)
            .style('stroke', function(d, i) {
              return colors(i);
            })
            .style('stroke-width', 1)

          let rects = groups.selectAll('rect')
            .data(function(d) {
              return d;
            })
            .enter().append('rect')
            .attr('x', function(d) {
              return xScale(d.x0);
            })
            .attr('height', 30)
            .attr('width', function(d) {
              return xScale(d.x) - 3;
            })

          snpVals.forEach(function(elem) {

            svg.append('rect')
              .attr('fill', 'red')
              .attr('width', 3)
              .attr('height', 40)
              .attr('x', xScale(elem))
              .attr('y', -5);

          })
        }
      } //end of link
    };
  };
})();