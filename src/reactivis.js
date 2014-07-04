// Reusable reactive model data flow subgraphs
// for constructung reactive data visualizations.
//
// Curran Kelleher
define(['d3', 'model'], function(d3, Model){
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

    // ## listenForResize
    //
    //  * DOM resize event, (div) -> (box)
    listenForResize: function (model) {
      model.when(['div'], function (div) {
        function setBoxFromDiv(){
          model.set('box', {
            width: div.clientWidth,
            height: div.clientHeight
          });
        }
        setBoxFromDiv();
        window.addEventListener('resize', setBoxFromDiv);
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
    //  * (data, getX, width) -> (xScale)
    //
    //<iframe src="../examples/dataFlowDiagram/#xLinearScale" width="450" height="200" frameBorder="0"></iframe>
    xLinearScale: function (model) {
      model.when(['data', 'getX', 'width'], function (data, getX, width) {
        model.set('xScale', linearScale(data, getX, width));
      });
    },

    // ## xOrdinalScale
    //
    //  * (data, getX, width) -> (xScale)
    //
    //<iframe src="../examples/dataFlowDiagram/#xOrdinalScale" width="450" height="200" frameBorder="0"></iframe>
    xOrdinalScale: function (model) {
      model.when(['data', 'getX', 'width'], function (data, getX, width) {
        model.set('xScale', ordinalScale(data, getX, width));
      });
    },

    // ## xAxis
    //
    //  * (g) -> (xAxisG)
    //  * (xAxisG, xScale, height) -> X Axis DOM
    //
    //<iframe src="../examples/dataFlowDiagram/#xAxis" width="450" height="200" frameBorder="0"></iframe>
    xAxis: function (model) {

      model.when('g', function (g) {
        model.set('xAxisG', g.append('g').attr('class', 'x axis'));
      });

      model.when(['xAxisG', 'xScale', 'height'], function (xAxisG, xScale, height) {
        var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
        xAxisG.call(xAxis);
        xAxisG.attr('transform', 'translate(0,' + height + ')');
        model.set('xAxis', xAxis);
      });
    },
 
    // ## xAxisLabel
    //
    //  * (xAxisG) -> (xAxisLabel)
    //  * (xAxisLabel, xLabel, width) -> X Axis Label DOM
    //
    //<iframe src="../examples/dataFlowDiagram/#xAxisLabel" width="450" height="200" frameBorder="0"></iframe>
    xAxisLabel: function (model) {

      model.when('xAxisG', function (xAxisG) {
        model.set('xAxisLabel', xAxisG.append('text')
          .attr('class', 'label')
          .attr('y', -6)
          .style('text-anchor', 'end'));
      });

      model.when(['xAxisLabel', 'xLabel', 'width'], function (xAxisLabel, xLabel, width) {
        xAxisLabel
          .text(xLabel)
          .attr('x', width);
      });
    },

    // ## yLinearScale
    //
    //  * (data, getY, height) -> (yScale)
    //
    //<iframe src="../examples/dataFlowDiagram/#yLinearScale" width="450" height="200" frameBorder="0"></iframe>
    yLinearScale: function (model) {
      model.when(['data', 'getY', 'height'], function (data, getY, height) {
        model.set('yScale', linearScale(data, getY, height));
      });
    },

    // ## yOrdinalScale
    //
    //  * (data, getY, width) -> (yScale)
    //
    //<iframe src="../examples/dataFlowDiagram/#yOrdinalScale" width="450" height="200" frameBorder="0"></iframe>
    yOrdinalScale: function (model) {
      model.when(['data', 'getY', 'height'], function (data, getY, height) {
        model.set('yScale', ordinalScale(data, getY, height));
      });
    },

    // ## yAxis
    //
    //  * (g) -> (yAxisG)
    //  * (yAxisG, yScale) -> Y Axis DOM
    //
    //<iframe src="../examples/dataFlowDiagram/#yAxis" width="450" height="200" frameBorder="0"></iframe>
    yAxis: function (model) {

      model.when('g', function (g) {
        model.set('yAxisG', g.append('g').attr('class', 'y axis'));
      });

      model.when(['yAxisG', 'yScale'], function (yAxisG, yScale) {
        var yAxis = d3.svg.axis().scale(yScale).orient('left');
        yAxisG.call(yAxis);
        model.set('yAxis', yAxis);
      });
    },

    // ## yAxisLabel
    //
    //  * (yAxisG) -> (yAxisLabel)
    //  * (yAxisLabel, yLabel) -> Y Axis Label DOM
    //
    //<iframe src="../examples/dataFlowDiagram/#yAxisLabel" width="450" height="200" frameBorder="0"></iframe>
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

  function linearScale(data, accessor, rangeExtent){
    return d3.scale.linear()
      .domain(d3.extent(data, accessor))
      .range([0, rangeExtent]);
  }

  function ordinalScale(data, accessor, rangeExtent){
    return d3.scale.ordinal()
      .domain(data.map(accessor))
      // TODO make the 0.1 a model property
      .rangeRoundBands([0, rangeExtent], 0.1);
  }

  var reactivis = function (model) {
    var chainable = {};
    Object.keys(methods).forEach(function (method) {
      chainable[method] = function () {
        methods[method](model);
        return chainable;
      };
    });
    return chainable;
  };

  // ## BarChart()
  //
  //   Constructs a reactive bar chart.
  reactivis.BarChart = function () {
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
          maxBarHeight = yScale.range()[1];

      bars.enter().append('rect').attr('class', 'bar');
      bars
        .attr('x', function(d) { return xScale(getX(d)); })
        .attr('width', xScale.rangeBand())
        .attr('y', function(d) { return yScale(getY(d)); })
        .attr('height', function(d) { return maxBarHeight - yScale(getY(d)); });
      bars.exit().remove();

      model.set('bars', bars);
    });
    return model;
  };

  // ## ScatterPlot()
  //
  //   Constructs a reactive scatter plot.
  reactivis.ScatterPlot = function () {
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
  };

  return reactivis;
});
