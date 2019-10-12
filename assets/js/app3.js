// @TODO: YOUR CODE HERE!
// Import Data
var file = "assets/data/data.csv"
d3.csv(file).then(successHandle, errorHandle)

// Set the svg size params
var svgWidth = 900
var svgHeight = 600

// Set svg margins 
var margin = {
  top: 40,
  right: 40,
  bottom: 80,
  left: 90
}

// Make the dvg canvas dimensions
var width = svgWidth - margin.left - margin.right
var height = svgHeight - margin.top - margin.bottom

// find the tag for the plot
var svg = d3.select("#plot")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

// add the grouop in the chart for 
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)




// get the smoking and poverty data
function successHandle(statesData) {

  statesData.map(data => {
    data.poverty = +data.poverty
    data.smokes = +data.smokes
    data.smokes = +data.obesity
  })

//Scale the axis
  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(statesData, d => d.poverty)])
    .range([0, width])

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(statesData, d => d.smokes)])
    .range([height, 0])

//Create the acis

  var bottomAxis = d3.axisBottom(xLinearScale)
    // 7 ticks gives even number only, which looks good
    .ticks(7)
  var leftAxis = d3.axisLeft(yLinearScale)

//Draw the axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis)
  chartGroup.append("g")
    .call(leftAxis)

  // axis labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Smoking (%)")

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)")


  // bubble for the plot
  var circlesGroup = chartGroup.selectAll("circle")
    .data(statesData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "13")
    .attr("fill", "#788dc2")
    .attr("opacity", ".75")

  // State abbreviation in bubble

  var circlesGroup = chartGroup.selectAll()
    .data(statesData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.smokes))
    .style("font-size", "13px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr))

  // tooltips
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html( d => {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Smoking: ${d.smokes}% `)
    })

  // Put the tooltip on the bubble
  chartGroup.call(toolTip)

  // event listener for tooltip
  // ==============================
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this)
  })
    // onmouseout event
    .on("mouseout", function (data) {
      toolTip.hide(data)
    })

  }


//error handling
function errorHandle(error) {
  throw err
}