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
      getX: function (d) { return d; }
    });
    model.when('xDomain', function (xDomain) {
      expect(xDomain[0]).to.equal(-1);
      expect(xDomain[1]).to.equal(5);

      setTimeout(function () {
        model.set('width', 500);
        model.when('xRange', function (xRange) {
          expect(xRange[0]).to.equal(0);
          expect(xRange[1]).to.equal(500);
          done();
        });
      }, 0);
    });
  });

  test('xOrdinalScale', function (model, done) {
    model.set({
      data: [ 'A', 'B', 'C' ],
      getX: function (d) { return d; }
    });
    model.when('xDomain', function (xDomain) {
      expect(xDomain[0]).to.equal('A');
      expect(xDomain[2]).to.equal('C');

      setTimeout(function () {
        model.set('width', 500);
        model.when('xRange', function (xRange) {
          expect(xRange[2]).to.equal(339);
          done();
        });
      }, 0);
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

    model.when(['xScale', 'g'], function () {
      setTimeout(function () {
        outputDataFlowGraph('xAxis', model);
        reactivis(model).xAxis();
        model.when(['xAxis', 'xAxisG'], function (xAxis, xAxisG) {
          expect(xAxis.scale()).to.equal(model.get('xScale'));
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
      data: [ 3, 4, -1, 5 ],
      getY: function (d) { return d; }
    });
    model.when('yDomain', function (yDomain) {
      expect(yDomain[0]).to.equal(-1);
      expect(yDomain[1]).to.equal(5);

      setTimeout(function () {
        model.set('height', 500);
        model.when('yRange', function (yRange) {
          expect(yRange[0]).to.equal(500);
          expect(yRange[1]).to.equal(0);
          done();
        });
      }, 0);
    });
  });

  //test('yOrdinalScale', function (model, done) {
  //  model.set({
  //    data: [ 'A', 'B', 'C' ],
  //    getY: function (d) { return d; }
  //  });
  //  model.when('yDomain', function (yDomain) {
  //    expect(yDomain[0]).to.equal('A');
  //    expect(yDomain[2]).to.equal('C');

  //    setTimeout(function () {
  //      model.set('width', 500);
  //      model.when('yRange', function (yRange) {
  //        expect(yRange[2]).to.equal(339);
  //        done();
  //      });
  //    }, 0);
  //  });
  //});

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

    model.when(['yScale', 'g'], function () {
      setTimeout(function () {
        outputDataFlowGraph('yAxis', model);
        reactivis(model).yAxis();
        model.when(['yAxis', 'yAxisG'], function (yAxis, yAxisG) {
          expect(yAxis.scale()).to.equal(model.get('yScale'));
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
