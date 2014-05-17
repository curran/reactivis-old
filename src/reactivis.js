define(['d3'], function(d3){
  var methods = {

    // (div) -> (svg, g)
    // (svg, box) -> svg DOM
    svg: function (model) {

      model.when('div', function (div) {
        var svg = d3.select(div).append('svg');
        model.set('svg', svg);
        model.set('g', svg.append('g'));
      });

      model.when(['svg', 'box'], function (svg, box) {
        svg.attr('width', box.width)
           .attr('height', box.height);
      });
    },

    // (box, margin) -> (width, height)
    // (g, margin) -> g DOM transformation
    margin: function (model) {

      model.when(['box', 'margin'], function (box, margin) {
        model.set('width', box.width - margin.left - margin.right);
        model.set('height', box.height - margin.top - margin.bottom);
      });

      model.when(['g', 'margin'], function (g, margin) {
        g.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      });
    },

    // D3 Ordinal Scale -> (xScale)
    // (xScale, data, getX) -> (xDomain)
    // (xScale, width) -> (xRange)
    xOrdinalScale: function (model) {

      model.set('xScale', d3.scale.ordinal());

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
    },

    // D3 Linear Scale -> (yScale)
    // (yScale, data, getY) -> (yDomain)
    // (yScale, height) -> (yRange)
    yLinearScale: function (model) {
      model.set('yScale', d3.scale.linear());

      model.when(['yScale', 'data', 'getY'], function (yScale, data, getY) {
        // TODO make min, max configurable
        yScale.domain([0, d3.max(data, getY)]);
        model.set('yDomain', yScale.domain());
      });

      model.when(['yScale', 'height'], function (yScale, height) {
        yScale.range([height, 0]);
        model.set('yRange', yScale.range());
      });
    },

    // (yScale) -> (yAxis)
    // (g) -> (yAxisG)
    // (yAxis, yAxisG, yDomain, yRange) -> Y Axis DOM
    yAxis: function (model) {

      model.when('yScale', function (yScale) {
        model.set('yAxis', d3.svg.axis().scale(yScale).orient('left').ticks(10, '%'));
      });

      model.when('g', function (g) {
        model.set('yAxisG', g.append('g').attr('class', 'y axis'));
      });

      model.when(['yAxis', 'yAxisG', 'yDomain', 'yRange'], function (yAxis, yAxisG) {
        yAxisG.call(yAxis);
      });
    },

    // (yAxisG) -> (yAxisLabel)
    // (yAxisLabel, yLabel) -> Y Axis Label DOM text
    yAxisLabel: function (model) {

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
    }
  };
  return function (model) {
    var reactivis = {};
    Object.keys(methods).forEach(function (method) {
      reactivis[method] = function () {
        methods[method](model);
        return reactivis;
      };
    });
    return reactivis;
  }
});
