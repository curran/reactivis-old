var requirejs = require('requirejs'),
    jsdom = require('jsdom').jsdom,
    d3 = require('d3'),
    expect = require('chai').expect;

requirejs.config({
  baseUrl: '',
  paths: {
    reactivis: 'dist/reactivis',
    model: 'bower_components/model/dist/model'
  },
  nodeRequire: require
});

describe('A suite', function() {
  var reactivis = requirejs('reactivis'),
      Model = requirejs('model'),
      document = jsdom('<html><head></head><body><div id="container"></div></body></html>');

  it('svg', function(done) {
    var model = Model(),
        div = document.getElementById('container');
    reactivis(model).svg();
    model.set('div', div);
    model.when(['svg', 'g'], function(svg, g) {
      expect(svg.node().nodeName).to.equal('SVG');
      expect(g.node().nodeName).to.equal('G');
      done();
    });
  });
});
