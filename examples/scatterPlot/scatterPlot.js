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

    model.set({
      xScaleType: 'linear',
      yScaleType: 'linear'
    });


    model.when(['g', 'xScale', 'yScale', 'data', 'getX', 'getY'], function (g, xScale, yScale, data, getX, getY) {
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
