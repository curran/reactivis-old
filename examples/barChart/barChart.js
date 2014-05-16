// An example bar chart using reactivis.
// Curran Kelleher 5/16/2014
define(['d3', 'model', 'reactivis'], function (d3, Model, reactivis) {
  return function BarChart(div){
    var x = d3.scale.ordinal(),
        y = d3.scale.linear(),
        xAxis = d3.svg.axis().scale(x).orient('bottom'),
        yAxis = d3.svg.axis().scale(y).orient('left').ticks(10, '%'),
        svg = d3.select(div).append('svg'),
        g = svg.append('g'),
        xAxisG = g.append('g').attr('class', 'x axis'),
        yAxisG = g.append('g').attr('class', 'y axis'),
        yAxisLabel = yAxisG.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '.71em')
          .style('text-anchor', 'end'),
        model = Model();


    model.when('yLabel', yAxisLabel.text, yAxisLabel);

    model.when('margin', function (margin) {
      g.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    });

    reactivis.margin(model);
    
    model.when('box', function (box) {
      svg.attr('width', box.width)
         .attr('height', box.height);
    });

    model.when('height', function (height) {
      xAxisG.attr('transform', 'translate(0,' + height + ')');
    });

    model.when(['width', 'height', 'data', 'barField', 'heightField'], function (width, height, data, barField, heightField) {
      var bars;

      x.domain(data.map(function(d) { return d[barField]; }));
      y.domain([0, d3.max(data, function(d) { return d[heightField]; })]);
      x.rangeRoundBands([0, width], .1);
      y.range([height, 0]);

      xAxisG.call(xAxis);
      yAxisG.call(yAxis);

      bars = g.selectAll('.bar').data(data);
      bars.enter().append('rect').attr('class', 'bar');
      bars.attr('x', function(d) { return x(d[barField]); })
          .attr('width', x.rangeBand())
          .attr('y', function(d) { return y(d[heightField]); })
          .attr('height', function(d) { return height - y(d[heightField]); });
      bars.exit().remove();
    });
    return model;
  }
});
