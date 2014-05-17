// An example bar chart using reactivis.
// Curran Kelleher 5/16/2014
define(['d3', 'model', 'reactivis'], function (d3, Model, reactivis) {
  return function BarChart(div){
    var model = Model();

    model.set('xScale', d3.scale.ordinal());
    model.set('yScale', d3.scale.linear());

    model.when('xScale', function (xScale) {
      model.set('xAxis', d3.svg.axis().scale(xScale).orient('bottom'));
    });

    model.when('yScale', function (yScale) {
      model.set('yAxis', d3.svg.axis().scale(yScale).orient('left').ticks(10, '%'));
    });

    model.when('div', function (div) {
      model.set('svg', d3.select(div).append('svg'));
    });

    model.when('svg', function (svg) {
      model.set('g', svg.append('g'));
    });

    model.when('g', function (g) {
      model.set('xAxisG', g.append('g').attr('class', 'x axis'));
    });

    model.when('g', function (g) {
      model.set('yAxisG', g.append('g').attr('class', 'y axis'));
    });

    model.when('yAxisG', function (yAxisG) {
      model.set('yAxisLabel', yAxisG.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end'));
    });

    model.when(['yAxisLabel', 'yLabel'], function (yAxisLabel, yLabel) {
      yAxisLabel.text(yLabel);
    });

    model.when(['g', 'margin'], function (g, margin) {
      g.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    });

    reactivis.margin(model);
    
    model.when(['svg', 'box'], function (svg, box) {
      svg.attr('width', box.width)
         .attr('height', box.height);
    });

    model.when(['xAxisG', 'height'], function (xAxisG, height) {
      xAxisG.attr('transform', 'translate(0,' + height + ')');
    });

    model.when(['g', 'xScale', 'yScale', 'xAxis', 'yAxis', 'xAxisG', 'yAxisG', 'width', 'height', 'data', 'barField', 'heightField'], function (g, xScale, yScale, xAxis, yAxis, xAxisG, yAxisG, width, height, data, barField, heightField) {
      var bars;

      xScale.domain(data.map(function(d) { return d[barField]; }));
      yScale.domain([0, d3.max(data, function(d) { return d[heightField]; })]);
      xScale.rangeRoundBands([0, width], .1);
      yScale.range([height, 0]);

      xAxisG.call(xAxis);
      yAxisG.call(yAxis);

      bars = g.selectAll('.bar').data(data);
      bars.enter().append('rect').attr('class', 'bar');
      bars.attr('x', function(d) { return xScale(d[barField]); })
          .attr('width', xScale.rangeBand())
          .attr('y', function(d) { return yScale(d[heightField]); })
          .attr('height', function(d) { return height - yScale(d[heightField]); });
      bars.exit().remove();
    });
    return model;
  }
});
