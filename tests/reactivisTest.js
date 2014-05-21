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
    fs.writeFile('./dataFlowGraphs/svg.json', json, function(err) {
      if(err) console.log(err);
    }); 
  });
}

describe('A suite', function() {
  var reactivis = requirejs('reactivis'),
      Model = requirejs('model'),
      document = jsdom('<html><head></head><body><div id="container"></div></body></html>');

  it('svg', function(done) {
    var model = Model(),
        div = document.getElementById('container');

    outputDataFlowGraph('svg', model);

    reactivis(model).svg();

    model.set('div', div);
    model.when(['svg', 'g'], function(svg, g) {
      expect(svg.node().nodeName).to.equal('SVG');
      expect(g.node().nodeName).to.equal('G');

      model.set('box', {
        x: 50,
        y: 50,
        width: 200,
        height: 250
      });
      setTimeout(function () {
        expect(svg.attr('width')).to.equal('200');
        expect(svg.attr('height')).to.equal('250');
        // TODO test x, y
        done();
      }, 0);
    });
  });
});
