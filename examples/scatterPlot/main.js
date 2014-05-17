require(['d3', 'scatterPlot'], function (d3, ScatterPlot) {
  var div = document.getElementById('scatterPlotContainer'),
      scatterPlot = ScatterPlot();

  scatterPlot.set('div', div);

  scatterPlot.set({
    getX: function (d) { return d.sepalWidth; },
    getY: function (d) { return d.sepalLength; },
    "xLabel": "Sepal Width (cm)",
    "yLabel": "Sepal Length (cm)",
    "margin": {
      "top": 20,
      "right": 20,
      "bottom": 30,
      "left": 40
    }
  }); 

  d3.tsv('data.tsv', function (d) {
    d.sepalLength = +d.sepalLength;
    d.sepalWidth = +d.sepalWidth;
    return d;
  }, function(error, data) {

    // Set size once to initialize
    setSizeFromDiv();

    // Set size on resize
    window.addEventListener('resize', setSizeFromDiv);

    // Set the data
    scatterPlot.set('data', data);

    // Reset data each second
    setInterval(function () {

      // Include each element with a 10% chance.
      var randomSample = data.filter(function(d){
        return Math.random() < 0.1;
      });

      scatterPlot.set('data', randomSample);
    }, 1000);

    // Randomly change the margin every 1.7 seconds.
    function random(){ return Math.random() * 100; }
    setInterval(function () {
      scatterPlot.set('margin', {top: random(), right: random(), bottom: random(), left: random()});
    }, 1700);

    // Change the Y axis label every 600 ms.
    function randomString() {
      var possibilities = ['Frequency', 'Population', 'Alpha', 'Beta'],
          i = Math.round(Math.random() * possibilities.length);
      return possibilities[i];
    }
    setInterval(function () {
      scatterPlot.set('yLabel', randomString());
    }, 600);
  });

  function setSizeFromDiv(){
    scatterPlot.set('box', {
      width: div.clientWidth,
      height: div.clientHeight
    });
  }
});
