require(['d3', 'forceDirectedGraph'], function (d3, ForceDirectedGraph) {

  // Grab the container div.
  var div = document.getElementById('container'),

      // Create the force directed graph visualization.
      forceDirectedGraph = ForceDirectedGraph(div),

      // Extract the name of the data flow graph file
      // from the URL hash, or use 'svg' by default.
      name = (function () {
        if(window.location.hash) {
          return window.location.hash.substr(1);
        } else {
          return 'svg';
        }
      }());

  // Load the data flow graph file.
  d3.json('../../dataFlowGraphs/' + name + '.json', function (data) {

    // Set the data on the graph visualization.
    forceDirectedGraph.set('data', data);
  });

  function initializeZoom(){
    var scale = div.clientWidth * 1 / 800;
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
