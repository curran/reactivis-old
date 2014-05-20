// A model driven force directed graph for automatic generation
// of data flow diagrams for reactive models. 
// 
// Draws from http://bl.ocks.org/mbostock/4062045
//
// Curran Kelleher 4/30/2014
// Updated 5/14/2014
define(['d3', 'model'], function (d3, Model) {
  return function (div){
    var model = Model(),
        force = d3.layout.force()
          .charge(-200)
          .linkDistance(90)
          .gravity(0.03),
        svg = d3.select(div).append('svg').style('position', 'absolute'),

        // These 3 groups exist for control of Z-ordering.
        // Links are on the bottom.
        linkG = svg.append('g'),
        // Nodes are on top of links.
        nodeG = svg.append('g'),
        // Arrowheads are on top of nodes.
        arrowG = svg.append('g'),
        nodeSize = 20,
        arrowWidth = 8;
    
    // Arrowhead setup.
    // Draws from Mobile Patent Suits example:
    // http://bl.ocks.org/mbostock/1153292
    svg.append('defs')
      .append('marker')
        .attr('id', 'arrow')
        .attr('orient', 'auto')
        .attr('preserveAspectRatio', 'none')
        // See also http://www.w3.org/TR/SVG/coords.html#ViewBoxAttribute
        //.attr('viewBox', '0 -' + arrowWidth + ' 10 ' + (2 * arrowWidth))
        .attr('viewBox', '0 -5 10 10')
        // See also http://www.w3.org/TR/SVG/painting.html#MarkerElementRefXAttribute
        // TODO generalize computation of refX
        .attr('refX', 23)
        .attr('refY', 0)
        .attr('markerWidth', 10)
        .attr('markerHeight', arrowWidth)
      .append('path')
        //.attr('d', 'M0,-' + arrowWidth + 'L10,0L0,' + arrowWidth );
        .attr('d', 'M0,-5L10,0L0,5');
    

    model.set({
      color: d3.scale.ordinal()
        .domain(['property', 'lambda'])
        .range(['FFD1B5', 'white'])//d3.scale.category20(),
    });

    model.when('box', function (box) {
      svg.attr('width', box.width).attr('height', box.height);
      svg.style('left', box.x + 'px').style('top', box.y + 'px')
      force.size([box.width, box.height]);
    });

    model.when(['data', 'color'], function (graph, color){
      var link, node;

      force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

      link = linkG.selectAll('.link').data(graph.links);
      link.enter().append('line').attr('class', 'link')
      link.exit().remove();

      arrow = arrowG.selectAll('.arrow').data(graph.links);
      arrow.enter().append('line')
        .attr('class', 'arrow')
        .attr('marker-end', function(d) { return 'url(#arrow)' });
      arrow.exit().remove();

      node = nodeG.selectAll('g').data(graph.nodes);

      var nodeEnter = node.enter().append('g').call(force.drag);
      nodeEnter.append('rect')
        .attr('class', 'node')
        .attr('y', -nodeSize)
        .attr('height', nodeSize * 2)
        .attr('rx', nodeSize)
        .attr('ry', nodeSize);
      nodeEnter.append('text')
        .attr('class', 'nodeLabel');

      node.select('g text')
        .text(function(d) {
          return (d.type === 'property' ? d.name : 'λ');
        })
        /* Center text vertically */
        .attr('dy', function(d) {
          if(d.type === 'lambda'){
            return '0.35em';
          } else {
            return '0.3em';
          }
        })
        .select(function (d) {
          // Stash the svg text length in the data item
          // for use in computing the rectangle width later.
          d.textLength = this.getComputedTextLength();
        });

      node.select('g rect')
        .style('fill', function(d) { return color(d.type); })
        .attr('x', function(d) {
          if(d.type === 'lambda'){
            return -nodeSize;
          } else {
            return -(d.textLength + nodeSize) / 2;
          }
        })
        .attr('width', function(d) {
          if(d.type === 'lambda'){
            return nodeSize * 2;
          } else {
            return d.textLength + nodeSize;
          }
        });
      node.exit().remove();
//      node.select('title').text(function(d) { return d.name; });

      force.on('tick', function(e) {
        // Execute left-right constraints
        var k = 1 * e.alpha;
        force.links().forEach(function (link) {
          var a = link.source,
              b = link.target,
              dx = b.x - a.x,
              dy = b.y - a.y,
              d = Math.sqrt(dx * dx + dy * dy),
              x = (a.x + b.x) / 2;
          a.x += k * (x - d / 2 - a.x);
          b.x += k * (x + d / 2 - b.x);
        });


        link.call(edge);
        arrow.call(edge);

        node.attr('transform', function(d) {      
          return 'translate(' + d.x + ',' + d.y + ')';
        });
      });
    });

    // Sets the (x1, y1, x2, y2) line properties for graph edges.
    function edge(selection){

      // TODO compute correct arrowhead position:
      //   if(lambda)
      //     use circle
      //   else
      //     use text length to compute box
      //     if inside box
      //       use box
      //     else
      //       use circle on the end of the box
      selection
        .attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });
    }

    return model;
  };
});
