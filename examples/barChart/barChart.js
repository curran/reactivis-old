// An example bar chart using reactivis.
// Curran Kelleher 5/16/2014
define(['d3', 'model', 'reactivis'], function (d3, Model, reactivis) {
  return function BarChart(){
    var model = Model();

    reactivis(model)
      .svg()
      .margin()
      .xOrdinalScale()
      .xAxis()
      .yLinearScale()
      .yAxis()
      .yAxisLabel();

    model.when(['g', 'xScale', 'yScale', 'data', 'getX', 'getY'], function (g, xScale, yScale, data, getX, getY) {
      var bars = g.selectAll('.bar').data(data),
          barWidth = xScale.rangeBand(),
          maxBarHeight = yScale.range()[1];

      bars.enter().append('rect').attr('class', 'bar');
      bars
        .attr('x', function(d) { return xScale(getX(d)); })
        .attr('width', barWidth)
        .attr('y', function(d) { return yScale(getY(d)); })
        .attr('height', function(d) { return maxBarHeight - yScale(getY(d)); });
      bars.exit().remove();
    });
    return model;
  }
});
