var requirejs = require('requirejs'),
    jsdom = require('jsdom').jsdom,
    d3 = require('d3'),
    fs = require('fs'),
    expect = require('chai').expect;

requirejs.config({
  baseUrl: '',
  paths: {
    reactivis: 'dist/reactivis',
    model: 'bower_components/model/dist/model'
  },
  nodeRequire: require
});

function outputDataFlowGraph(name, model){
  model.detectFlowGraph(function (graph) {
    var json = JSON.stringify(graph, null, 2);
    fs.writeFile('./dataFlowGraphs/' + name + '.json', json, function(err) {
      if(err) console.log(err);
    }); 
  });
}

describe('A suite', function() {
  var reactivis = requirejs('reactivis'),
      Model = requirejs('model'),
      document = jsdom('<html><head></head><body></body></html>');

  function createDiv(){
    var div = document.createElement('div');
    document.body.appendChild(div);
    return div;
  }

  function test(name, callback){
    var model = Model();
    outputDataFlowGraph(name, model);
    reactivis(model)[name]();
    it(name, function(done) {
      callback(model, done);
    });
  }

  test('svg', function (model, done) {
    model.set('div', createDiv());
    model.when(['svg', 'g'], function(svg, g) {
      expect(svg.node().nodeName).to.equal('SVG');
      expect(g.node().nodeName).to.equal('G');
      setTimeout(function () {
        model.set('box', {
          x: 50,
          y: 50,
          width: 200,
          height: 250
        });
        setTimeout(function () {
          expect(svg.attr('width')).to.equal('200');
          expect(svg.attr('height')).to.equal('250');
          // todo test x, y
          done();
        }, 0);
      }, 0);
    });
  });

  test('margin', function (model, done) {
    model.set({
      box: { x: 50, y: 50, width: 200, height: 250 },
      margin: { top: 10, right: 20, bottom: 30, left: 40 }
    });
    model.when(['width', 'height'], function(width, height) {
      expect(width).to.equal(200 - 40 - 20);
      expect(height).to.equal(250 - 10 - 30);
      done();
    });
  });

  test('xLinearScale', function (model, done) {
    model.set({
      data: [ 3, 4, -1, 5 ],
      getX: function (d) { return d; },
      width: 500
    });
    model.when('xScale', function (xScale) {
      expect(xScale.domain()[0]).to.equal(-1);
      expect(xScale.domain()[1]).to.equal(5);
      expect(xScale.range()[0]).to.equal(0);
      expect(xScale.range()[1]).to.equal(500);
      done();
    });
  });

  test('xOrdinalScale', function (model, done) {
    model.set({
      data: [ 'A', 'B', 'C' ],
      getX: function (d) { return d; },
      width: 500
    });
    model.when('xScale', function (xScale) {
      expect(xScale.domain()[0]).to.equal('A');
      expect(xScale.domain()[2]).to.equal('C');
      expect(xScale.range()[0]).to.equal(17);
      expect(xScale.range()[1]).to.equal(178);
      done();
    });
  });

  it('xAxis', function(done) {
    var model = Model();
    
    reactivis(model)
      .svg()
      .margin()
      .xLinearScale();

    model.set({
      div: createDiv(),
      box: { x: 50, y: 50, width: 200, height: 250 },
      margin: { top: 10, right: 20, bottom: 30, left: 40 },
      data: [ 3, 4, -1, 5 ],
      getX: function (d) { return d; }
    });

    model.when(['xScale', 'height', 'g'], function (xScale) {
      setTimeout(function () {
        outputDataFlowGraph('xAxis', model);
        reactivis(model).xAxis();
        model.when(['xAxisG'], function (xAxisG) {
          expect(xAxisG.node().nodeName).to.equal('G');
          done();
        });
      }, 0);
    });
  });

  it('xAxisLabel', function(done) {
    var model = Model();
    
    reactivis(model)
      .svg()
      .margin()
      .xLinearScale()
      .xAxis();

    model.set({
      div: createDiv(),
      box: { x: 50, y: 50, width: 200, height: 250 },
      margin: { top: 10, right: 20, bottom: 30, left: 40 },
      data: [ 3, 4, -1, 5 ],
      getX: function (d) { return d; }
    });

    model.when(['xAxis', 'xAxisG'], function (xAxis, xAxisG) {
      setTimeout(function () {
        outputDataFlowGraph('xAxisLabel', model);
        reactivis(model).xAxisLabel();
        model.set('xLabel', 'Population');
        model.when('xAxisLabel', function (xAxisLabel) {
          expect(xAxisLabel.text()).to.equal('Population');
          done();
        });
      }, 0);
    });
  });

  test('yLinearScale', function (model, done) {
    model.set({
      data: [ 3, 4, -2, 7 ],
      getY: function (d) { return d; },
      height: 400
    });
    model.when('yScale', function (yScale) {
      expect(yScale.domain()[0]).to.equal(-2);
      expect(yScale.domain()[1]).to.equal(7);
      expect(yScale.range()[0]).to.equal(0);
      expect(yScale.range()[1]).to.equal(400);
      done();
    });
  });
  test('yOrdinalScale', function (model, done) {
    model.set({
      data: [ 'A', 'B', 'C' ],
      getY: function (d) { return d; },
      height: 500
    });
    model.when('yScale', function (yScale) {
      expect(yScale.domain()[0]).to.equal('A');
      expect(yScale.domain()[2]).to.equal('C');
      expect(yScale.range()[0]).to.equal(17);
      expect(yScale.range()[1]).to.equal(178);
      done();
    });
  });
  it('yAxis', function(done) {
    var model = Model();
    
    reactivis(model)
      .svg()
      .margin()
      .yLinearScale();

    model.set({
      div: createDiv(),
      box: { x: 50, y: 50, width: 200, height: 250 },
      margin: { top: 10, right: 20, bottom: 30, left: 40 },
      data: [ 3, 4, -1, 5 ],
      getY: function (d) { return d; }
    });

    model.when(['yScale', 'height', 'g'], function (yScale) {
      setTimeout(function () {
        outputDataFlowGraph('yAxis', model);
        reactivis(model).yAxis();
        model.when(['yAxisG'], function (yAxisG) {
          expect(yAxisG.node().nodeName).to.equal('G');
          done();
        });
      }, 0);
    });
  });

  it('yAxisLabel', function(done) {
    var model = Model();
    
    reactivis(model)
      .svg()
      .margin()
      .yLinearScale()
      .yAxis();

    model.set({
      div: createDiv(),
      box: { x: 50, y: 50, width: 200, height: 250 },
      margin: { top: 10, right: 20, bottom: 30, left: 40 },
      data: [ 3, 4, -1, 5 ],
      getY: function (d) { return d; }
    });

    model.when(['yAxis', 'yAxisG'], function (yAxis, yAxisG) {
      setTimeout(function () {
        outputDataFlowGraph('yAxisLabel', model);
        reactivis(model).yAxisLabel();
        model.set('yLabel', 'Population');
        model.when('yAxisLabel', function (yAxisLabel) {
          expect(yAxisLabel.text()).to.equal('Population');
          done();
        });
      }, 0);
    });
  });
});
