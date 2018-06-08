// Define SVG area dimensions
var svgWidth = 1200;
var svgHeight = 600;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)
  .append("g");

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

d3.select(".chartGroup")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("HW_14.csv", function(error, data){
  if (error) throw error;
   data.forEach(function(data){
      data.poverty=+data.poverty;
      data.excellentHealth=+data.excellentHealth;
      data.abbr=data.abbr;
      data.state=data.state;
    });
// Create scale functions
  var yLinearScale = d3.scaleLinear()
  .range([height, 0]);
  var xLinearScale = d3.scaleLinear()
  .range([0, width]);

// Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

// Scale the domain
  xLinearScale.domain([(d3.min(data, function(data) {
    return +data.poverty-1;
  })), (d3.max(data, function(data){
      return +data.poverty+1}))]);

  yLinearScale.domain([(d3.min(data, function(data) {
    return +data.excellentHealth-1;
  })), (d3.max(data, function(data){
      return +data.excellentHealth+1}))]);

// tooltip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data) {
      return (`${d.state}<br>${d[poverty]}<br>${d[excellentHealth]}`);
    });
//chart.call tooltip
  chart.call(toolTip);

  chart.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(data, index) {
      return xLinearScale(data.poverty);
    })
    .attr("cy", function(data, index) {
      return yLinearScale(data.excellentHealth);
    })
    .attr("r", "15")
    .attr("fill", "lightblue")
    .style("opacity", .75)
    .attr("stroke", "black")
    .on("mouseover", function(data) {
      toolTip.show(data);
      toolTip.style("display", null);
    })

//append text
  chart.selectAll("g")
    .data(data)
    .enter()
    .append("text")
    .attr("dx", function(data, index){
      return xLinearScale(data.poverty)-11.5
})
    .attr("dy", function(data){
      return yLinearScale(data.excellentHealth)+4
})
    .text(function (data, index){
      return data.abbr;
});


// onmouseout event
    on("mouseout", function(data, index) {
      toolTip.hide(data);
      toolTip.style("display", "none");
   });


// call the chart to paste SVG and display it, call x axis y axis and add labels

  // call x axis
  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  //call y axis
  chart.append("g")
      .call(leftAxis);
  
  // Append y-axis labels
  chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("% of people in excellent health");

  // Append x-axis labels
  chart.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
    .attr("class", "axisText")
    .text("% of People under poverty line");
  
  chart.append("text")
    .attr("transform","translate(" +(width/2)+"," + (0)+")")
    .attr("class","axisText")
    .text("Poverty vs. Health")


    // important stuff, put all code inside of here, so when you reference the data it gets referenced inside of csv
})




