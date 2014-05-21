require(['d3', 'forceDirectedGraph'], function (d3, ForceDirectedGraph) {
  var div = document.getElementById('container'),
      forceDirectedGraph = ForceDirectedGraph(div),
      name = 'svg';

  if(window.location.hash) {
    name = window.location.hash.substr(1);
  } 

  d3.json('../../dataFlowGraphs/' + name + '.json', function (data) {
    forceDirectedGraph.set('data', data);
  });

  function initializeZoom(){
    var scale = 0.6;
    forceDirectedGraph.set({
      scale: scale,
      translate: [
        div.clientWidth / 2 * (1 - scale),
        div.clientHeight / 2 * (1 - scale)
      ]
    });
  }
  initializeZoom();


  setSizeFromDiv();
  window.addEventListener('resize', setSizeFromDiv);
  function setSizeFromDiv(){
    forceDirectedGraph.set('box', {
      x: 0,
      y: 0,
      width: div.clientWidth,
      height: div.clientHeight
    });
  }
});
