
define('reactivis/reactivis',['d3'], function(d3){
  return {

    // (box, margin) -> (width, height)
    margin: function (model) {
      model.when(['box', 'margin'], function (box, margin) {
        model.set('width', box.width - margin.left - margin.right);
        model.set('height', box.height - margin.top - margin.bottom);
      });
    },

    // (xScale, data, getX) -> (xDomain)
    // (xScale, width) -> (xRange)
    xOrdinalScale: function (model) {

      model.when(['xScale', 'data', 'getX'], function (xScale, data, getX) {
        xScale.domain(data.map(getX));
        model.set('xDomain', xScale.domain());
      });

      model.when(['xScale', 'width'], function (xScale, width) {
        // TODO make the .1 a model property
        xScale.rangeRoundBands([0, width], .1);
        model.set('xRange', xScale.range());
      });
    },

    // (xScale) -> (xAxis)
    // (g) -> (xAxisG)
    // (xAxis, xAxisG, xDomain, xRange) -> X Axis DOM
    // (xAxisG, height) -> X Axis DOM
    xAxis: function (model) {

      model.when('xScale', function (xScale) {
        model.set('xAxis', d3.svg.axis().scale(xScale).orient('bottom'));
      });

      model.when('g', function (g) {
        model.set('xAxisG', g.append('g').attr('class', 'x axis'));
      });

      model.when(['xAxis', 'xAxisG', 'xDomain', 'xRange'], function (xAxis, xAxisG) {
        xAxisG.call(xAxis);
      });

      model.when(['xAxisG', 'height'], function (xAxisG, height) {
        xAxisG.attr('transform', 'translate(0,' + height + ')');
      });
    }
  };
});

define('reactivis', ['reactivis/reactivis'], function (main) { return main; });
