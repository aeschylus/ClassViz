console.log('\'Allo \'Allo!');

// CONSTANTS
var classCodes = {
  'Directions': 'directions',
  'Exposition': 'exposition',
  'Guest Speaker': 'guestSpeaker',
  'Individual Work': 'individualWork',
  'Lab': 'lab',
  'Lecture/IRE': 'lecture',
  'Setup (other)': 'setup',
  'Small Group Discussion': 'sga',
  'Visual Phenomena': 'smd',
  'Whole Class Discussion': 'wcd',
  'Work Through Examples/IRE': 'wte'
};

d3.csv('data/ClassStructure.csv', data => {
  // document.write(data);
  console.log(data);
  let class1 = data.filter(event => {
    return event.Teacher === "1";
  });
  let class2 = data.filter(event => {
    return event.Teacher === "2";
  });

  console.log(class1);
  console.log(class2);

  // utility functions
  var formatTime = d3.timeFormat("%H:%M"),
  parseTimestamp = function(stamp) {
    return stamp.split(':');
  },
  dateFromTimestamp = function(stamp) {
    var stamp = parseTimestamp(stamp);
    return new Date(2012, 0, 1, stamp[0], stamp[1], stamp[2]);
  };
  // window.formatMinutes = function(d) { return formatTime(new Date(2012, 0, 1, d)); };

  var minTime = d3.min(class1, (d) => dateFromTimestamp(d.StartTime)),
      maxTime = d3.max(class1, (d) => dateFromTimestamp(d.EndTime));

  console.log(minTime);
  console.log(maxTime);



  var timeScale = d3.scaleTime()
        .domain([minTime, maxTime]);

  let svgCanvas = d3.select('svg');

  timeScale.range([75, (svgCanvas.node().getBoundingClientRect().height - 100)]);

  let chart1 = svgCanvas.append('g').selectAll('g');
  let color = d3.scaleOrdinal(d3.schemeCategory10);

  console.log(chart1);
  chart1
    .data(class1)
    .enter()
    .append('rect')
    .attr('class', function(d) {
      return 'period ' + classCodes[d.Code];
    })
    .attr("x", 200)
    .attr("y", function(d) {
      console.log(d);
      return timeScale(dateFromTimestamp(d.StartTime));
    })
    .attr("height", function(d) {
      console.log(timeScale(dateFromTimestamp(d.EndTime)) - timeScale(dateFromTimestamp(d.StartTime)));
      return timeScale(dateFromTimestamp(d.EndTime)) - timeScale(dateFromTimestamp(d.StartTime));
    })
    .attr("width", 200);

  // period labels
  chart1
    .data(class1)
    .enter()
    .append('text')
    .attr('class', 'periodLabel')
    .attr("x", 300)
    .attr("y", function(d) {
      console.log(d);
      var boxOffset = (timeScale(dateFromTimestamp(d.EndTime)) - timeScale(dateFromTimestamp(d.StartTime)))/2;
      return timeScale(dateFromTimestamp(d.StartTime)) + boxOffset;
    })
    .text(function(d) { return d.Code; })
    .attr('text-anchor', 'middle');

  // timestamps
  chart1
    .data(class1)
    .enter()
    .append('text')
    .attr('class', 'timestamp')
    .attr("x", 100)
    .attr("y", function(d) {
      console.log(d);
      return timeScale(dateFromTimestamp(d.StartTime));
    })
    .text(function(d) { return d.StartTime; })
    .attr('text-anchor', 'right');
});
