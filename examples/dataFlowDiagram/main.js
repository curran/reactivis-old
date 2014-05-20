require(['d3', 'forceDirectedGraph'], function (d3, ForceDirectedGraph) {
  var div = document.getElementById('container'),
      forceDirectedGraph = ForceDirectedGraph(div),
      data = {
        "nodes": [
          {
            "type": "lambda",
            "index": 0
          },
          {
            "type": "property",
            "name": "a",
            "index": 1
          },
          {
            "type": "property",
            "name": "b",
            "index": 2
          },
          {
            "type": "property",
            "name": "c",
            "index": 3
          },
          {
            "type": "lambda",
            "index": 4
          },
          {
            "type": "property",
            "name": "d",
            "index": 5
          },
          {
            "type": "lambda",
            "index": 6
          },
          {
            "type": "property",
            "name": "e",
            "index": 7
          },
          {
            "type": "lambda",
            "index": 8
          },
          {
            "type": "property",
            "name": "f",
            "index": 9
          },
          {
            "type": "lambda",
            "index": 10
          },
          {
            "type": "lambda",
            "index": 11
          }
        ],
        "links": [
          {
            "source": 1,
            "target": 0
          },
          {
            "source": 0,
            "target": 2
          },
          {
            "source": 0,
            "target": 3
          },
          {
            "source": 2,
            "target": 4
          },
          {
            "source": 4,
            "target": 5
          },
          {
            "source": 3,
            "target": 6
          },
          {
            "source": 6,
            "target": 7
          },
          {
            "source": 5,
            "target": 8
          },
          {
            "source": 7,
            "target": 8
          },
          {
            "source": 8,
            "target": 9
          },
          {
            "source": 9,
            "target": 10
          },
          {
            "source": 9,
            "target": 11
          }
        ]
      };
//      {
//        nodes: [
//          { type: 'property', name: 'size' },
//          { type: 'lambda' },
//          { type: 'property', name: 'width' },
//        ],
//        
//        links: [
//          { source: 0, target: 1},
//          { source: 1, target: 2}
//        ]
//      };

  forceDirectedGraph.set('data', data);

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
