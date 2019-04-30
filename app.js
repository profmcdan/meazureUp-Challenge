const data_test = [
  { id: 1, name: "A", value: 40 },
  { id: 2, name: "B", value: 10 },
  { id: 3, name: "C", value: 10 },
  { id: 4, name: "D", value: 1 },
  { id: 5, name: "E", value: 60 },
  { id: 6, name: "F", value: 100 },
  { id: 7, name: "G", value: 2 },
  { id: 8, name: "H", value: 22 },
  { id: 9, name: "I", value: -10 },
  { id: 10, name: "J", value: 12 },
  { id: 11, name: "K", value: 57 },
  { id: 12, name: "L", value: 98 },
  { id: 13, name: "M", value: 44 },
  { id: 14, name: "N", value: 32 },
  { id: 15, name: "O", value: 77 },
  { id: 16, name: "P", value: 7 },
  { id: 17, name: "Q", value: 83 },
];

// var d3 = require("d3"),
//   jsdom = require("jsdom");

function genCharArray(charA, charZ) {
  var a = [],
    i = charA.charCodeAt(0),
    j = charZ.charCodeAt(0);
  for (; i <= j; ++i) {
    a.push(String.fromCharCode(i));
  }
  return a;
}

function generateRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateData(min, max, seed) {
  var myrng = new Math.seedrandom(seed);
  const names = genCharArray("A", "Z");
  return names.map(n => {
    return { name: n, value: generateRandom(min, max) };
  });
}

// Generate the data
const MAX = 90,
  MIN = -10,
  SEED = 5;
let data = generateData(MIN, MAX, SEED);

const width = 800,
  height = 600;
const margin = { top: 20, right: 20, bottom: 30, left: 30 };

const chartContainer = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const xScale = d3
  .scaleBand()
  .domain(data.map(d => d.name))
  .range([0, width])
  .padding(0.1);

const yScale = d3
  .scaleLinear()
  .domain([MIN, MAX])
  // .domain([d3.min(data, d => d.value), d3.max(data, d => d.value)])
  .range([height, 0]);

// Add data
chartContainer
  .selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d, i) => xScale(d.name))
  .attr("width", xScale.bandwidth())
  .attr("y", d => {
    if (d.value >= 0) {
      return yScale(d.value);
    } else {
      return yScale(0);
    }
  })
  .attr("height", (d, i) => {
    if (d.value >= 0) {
      return height - yScale(d.value) - yScale(80);
    } else {
      return Math.abs(yScale(0) - yScale(d.value));
    }
  })
  .style("fill", d => {
    if (d.value > 0) {
      return "steelblue";
    } else {
      return "red";
    }
  });

// Add Axes

const xAxis = d3.axisBottom().scale(xScale);

const yAxis = d3
  .axisLeft()
  .scale(yScale)
  .tickFormat(d => d)
  .ticks(10);

chartContainer
  .append("g")
  .attr("id", "left-axis")
  .call(yAxis)
  .attr("transform", `translate(0, 0)`)
  .append("text")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text("value");

chartContainer
  .append("g")
  .attr("id", "bottom-axis")
  .call(xAxis)
  .attr("transform", `translate(0, ${height - yScale(80)})`);

// Add Text
chartContainer
  .selectAll("text")
  .data(data)
  .enter()
  .append("text")
  .text(d => d.value)
  .attr("y", d => height - yScale(d.value))
  .attr("x", (d, i) => xScale(d.name))
  .attr("font-family", "sans-serif")
  .attr("font-size", "11px")
  .attr("fill", "black")
  .attr("text-anchor", "middle");

function seedChanged() {
  const seed = document.getElementById("seed").value;
  data = generateData(MIN, MAX, seed);

  chartContainer
    .selectAll("rect")
    .data(data)
    .transition()
    // .delay(1500)
    .duration(2000)
    // .ease(d3.easeElasticOut)

    .attr("x", (d, i) => xScale(d.name))
    .attr("width", xScale.bandwidth())
    .attr("y", d => {
      if (d.value >= 0) {
        return yScale(d.value);
      } else {
        return yScale(0);
      }
    })
    .attr("height", (d, i) => {
      if (d.value >= 0) {
        return height - yScale(d.value) - yScale(80);
      } else {
        return Math.abs(yScale(0) - yScale(d.value));
      }
    })
    .style("fill", d => {
      if (d.value > 0) {
        return "steelblue";
      } else {
        return "red";
      }
    });
}
