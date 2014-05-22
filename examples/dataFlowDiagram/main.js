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
      }()),
      filename = '../../dataFlowGraphs/' + name + '.json';

  // Load the data flow graph file.
  d3.json(filename, function (data) {

    // Set the data on the graph visualization.
    forceDirectedGraph.set('data', data);

    // Whenever the user manually positions nodes,
    forceDirectedGraph.when('data', function (data) {

      // write the new positions to disk via the server.
      sendToServer({
        name: name,
        data: {
          nodes: data.nodes,
          // Restore indices so the data can be parsed properly later.
          links: data.links.map(function (d) {
            return {
              source: d.source.index,
              target: d.target.index
            };
          })
        }
      }); 
    });
  });

  function sendToServer(json){

    // Draws from http://stackoverflow.com/questions/6418220/javascript-send-json-object-with-ajax
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', '/writeDataFlowGraph');
    xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xmlhttp.send(JSON.stringify(json));
  }


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
