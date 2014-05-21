// Reusable reactive model data flow subgraphs
// for constructung reactive data visualizations.
//
// Curran Kelleher 5/20/2014
define(['d3'], function(d3){
  var methods = {

    // ## svg
    //
    //  * (div) -> (svg, g)
    //  * (svg, box) -> svg DOM
    //
    //<iframe src="../examples/dataFlowDiagram/#svg" width="450" height="200" frameBorder="0"></iframe>
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

    // ## margin
    // 
    //  * (box, margin) -> (width, height)
    //  * (g, margin) -> g DOM transformation
    //
    //<iframe src="../examples/dataFlowDiagram/#margin" width="450" height="200" frameBorder="0"></iframe>
    margin: function (model) {

      model.when(['box', 'margin'], function (box, margin) {
        model.set('width', box.width - margin.left - margin.right);
        model.set('height', box.height - margin.top - margin.bottom);
      });

      model.when(['g', 'margin'], function (g, margin) {
        g.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      });
    },

    // ## xLinearScale
    //
    //  * D3 Linear Scale -> (xScale)
    //  * (xScale, data, getX) -> (xDomain)
    //  * (xScale, width) -> (xRange)
    //
    //<iframe src="../examples/dataFlowDiagram/#xLinearScale" width="450" height="200" frameBorder="0"></iframe>
    xLinearScale: function (model) {
      model.set('xScale', d3.scale.linear());

      model.when(['xScale', 'data', 'getX'], function (xScale, data, getX) {
        // TODO make min, max configurable
        xScale.domain([d3.min(data, getX), d3.max(data, getX)]);
        model.set('xDomain', xScale.domain());
      });

      model.when(['xScale', 'width'], function (xScale, width) {
        xScale.range([0, width]);
        model.set('xRange', xScale.range());
      });
    },

    // ## xOrdinalScale
    //
    //  * D3 Ordinal Scale -> (xScale)
    //  * (xScale, data, getX) -> (xDomain)
    //  * (xScale, width) -> (xRange)
    //
    //<iframe src="../examples/dataFlowDiagram/#xOrdinalScale" width="450" height="200" frameBorder="0"></iframe>
    xOrdinalScale: function (model) {

      model.set('xScale', d3.scale.ordinal());

      model.when(['xScale', 'data', 'getX'], function (xScale, data, getX) {
        xScale.domain(data.map(getX));
        model.set('xDomain', xScale.domain());
      });

      model.when(['xScale', 'width'], function (xScale, width) {
        // TODO make the 0.1 a model property
        xScale.rangeRoundBands([0, width], 0.1);
        model.set('xRange', xScale.range());
      });
    },

    // ## xAxis
    //
    //  * (xScale) -> (xAxis)
    //  * (g) -> (xAxisG)
    //  * (xAxis, xAxisG, xDomain, xRange) -> X Axis DOM
    //  * (xAxisG, height) -> X Axis DOM
    //
    //<iframe src="../examples/dataFlowDiagram/#xAxis" width="450" height="200" frameBorder="0"></iframe>
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
 
    // ## xAxisLabel
    //
    //  * (xAxisG) -> (xAxisLabel)
    //  * (xAxisLabel, xLabel) -> X Axis Label DOM text
    //
    //<iframe src="../examples/dataFlowDiagram/#xAxisLabel" width="450" height="200" frameBorder="0"></iframe>
    xAxisLabel: function (model) {

      model.when('xAxisG', function (xAxisG) {
        model.set('xAxisLabel', xAxisG.append('text')
          .attr('class', 'label')
          .attr('y', -6)
          .style('text-anchor', 'end'));
      });

      model.when(['xAxisLabel', 'xLabel'], function (xAxisLabel, xLabel) {
        xAxisLabel.text(xLabel);
      });

      model.when(['xAxisLabel', 'width'], function (xAxisLabel, width) {
        xAxisLabel.attr('x', width);
      });
    },

    // ## yLinearScale
    //
    //  * D3 Linear Scale -> (yScale)
    //  * (yScale, data, getY) -> (yDomain)
    //  * (yScale, height) -> (yRange)
    //
    //<iframe src="../examples/dataFlowDiagram/#yLinearScale" width="450" height="200" frameBorder="0"></iframe>
    yLinearScale: function (model) {
      model.set('yScale', d3.scale.linear());

      model.when(['yScale', 'data', 'getY'], function (yScale, data, getY) {
        // TODO make min, max configurable
        yScale.domain([d3.min(data, getY), d3.max(data, getY)]);
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
        model.set('yAxis', d3.svg.axis().scale(yScale).orient('left'));

        // TODO add .ticks(10, '%'));
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
  };
});
