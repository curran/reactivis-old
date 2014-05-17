define(['d3', 'model', 'reactivis'], function (d3, Model, reactivis) {
  return function (div){
    var model = Model();

    reactivis(model)
      .svg()
      .margin()
      .xLinearScale()
      .xAxis()
      .xAxisLabel()
      .yLinearScale()
      .yAxis()
      .yAxisLabel();

    model.when(['g', 'xScale', 'yScale', 'xDomain', 'xRange', 'yDomain', 'yRange', 'data', 'getX', 'getY', 'width', 'height'], function (g, xScale, yScale, xDomain, xRange, yDomain, yRange, data, getX, getY, width, height) {
      var dots = g.selectAll('.dot').data(data);
      dots.enter().append('circle')
        .attr('class', 'dot')
        .attr('r', 3.5);
      dots
        .attr('cx', function(d) { return xScale(getX(d)); })
        .attr('cy', function(d) { return yScale(getY(d)); });
      dots.exit().remove();
    });
    return model;
  }
});
