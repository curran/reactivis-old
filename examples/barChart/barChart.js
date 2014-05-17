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

    model.when(['yScale', 'data', 'getY'], function (yScale, data, getY) {
      yScale.domain([0, d3.max(data, getY)]);
      model.set('yDomain', yScale.domain());
    });

    model.when(['yScale', 'height'], function (yScale, height) {
      yScale.range([height, 0]);
      model.set('yRange', yScale.range());
    });

    model.when(['xScale', 'data', 'getX'], function (xScale, data, getX) {
      xScale.domain(data.map(getX));
      model.set('xDomain', xScale.domain());
    });

    model.when(['xScale', 'width'], function (xScale, width) {
      xScale.rangeRoundBands([0, width], .1);
      model.set('xRange', xScale.range());
    });

    model.when(['xAxis', 'xAxisG', 'xDomain', 'xRange'], function (xAxis, xAxisG) {
      xAxisG.call(xAxis);
    });

    model.when(['yAxis', 'yAxisG', 'yDomain', 'yRange'], function (yAxis, yAxisG) {
      yAxisG.call(yAxis);
    });

    model.when(['g', 'xScale', 'yScale', 'xDomain', 'xRange', 'yDomain', 'yRange', 'data', 'getX', 'getY', 'height'], function (g, xScale, yScale, xDomain, xRange, yDomain, yRange, data, getX, getY, height) {
      var bars;

      bars = g.selectAll('.bar').data(data);
      bars.enter().append('rect').attr('class', 'bar');
      bars
        .attr('x', function(d) { return xScale(getX(d)); })
        .attr('width', xScale.rangeBand())
        .attr('y', function(d) { return yScale(getY(d)); })
        .attr('height', function(d) { return height - yScale(getY(d)); });
      bars.exit().remove();
    });
    return model;
  }
});
