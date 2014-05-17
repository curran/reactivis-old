// An example bar chart using reactivis.
// Curran Kelleher 5/16/2014
define(['d3', 'model', 'reactivis'], function (d3, Model, reactivis) {
  return function BarChart(div){
    var model = Model();

    reactivis(model)
      .svg()
      .margin()
      .xOrdinalScale()
      .xAxis()
      .yLinearScale()
      .yAxis()
      .yAxisLabel();

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
