// A bar chart using reactivis.
// Curran Kelleher 7/4/2014
require(['d3', 'model', 'reactivis'], function (d3, Model, reactivis) {

  var barChart = reactivis.BarChart(),
      div = document.getElementById('barChartContainer');

  // respond to browser window resizes
  reactivis(barChart).listenForResize();

  barChart.set('div', div);

  barChart.set('margin', { top: 20, right: 20, bottom: 30, left: 40 });
  barChart.set({
    getX: function (d) { return d.char; },
    getY: function (d) { return d.freq; },
    yLabel: "Frequency"
  });

  d3.tsv('../data/characterFrequencies.tsv', function (d) {
    d.frequency = +d.frequency;
    return d;
  }, function(error, data) {

    // Set the data
    barChart.set('data', data);

    // Reset data each second to a random subset,
    // to demonstrate that the bar chart responds correctly.
    setInterval(function () {

      // Include each element with a 50% chance.
      var randomSample = data.filter(function(d){
        return Math.random() < 0.5;
      });

      barChart.set('data', randomSample);
    }, 1000);

    // Randomly change the margin every 1.7 seconds.
    function random(){
      return Math.random() * 100;
    }
    setInterval(function () {
      barChart.set('margin', {
        top: random(),
        right: random(),
        bottom: random(),
        left: random()
      });
    }, 1700);

    // Change the Y axis label every 600 ms.
    setInterval(function () {

      var possibilities = ['Frequency', 'Population', 'Alpha', 'Beta'],
          i = Math.round(Math.random() * possibilities.length),
          randomString = possibilities[i];

      barChart.set('yLabel', randomString);
    }, 600);
  });
});
