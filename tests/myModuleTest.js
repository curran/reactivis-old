var requirejs = require('requirejs'),
    expect = require('chai').expect;

requirejs.config({
  baseUrl: 'dist',
  nodeRequire: require
});

describe('A suite', function() {
  var myModule = requirejs('reactivis');

  it('can access the AMD module', function() {
    expect(myModule.test()).to.equal('A');
  });
});
