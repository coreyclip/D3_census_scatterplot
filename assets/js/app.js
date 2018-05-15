// D3 Scatterplot 

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// depression dataset


d3.csv('../data/data.csv', function(err, CensusData){
    if (err) throw err;

    console.log(data)

    // Step 1: Parse Data as numbers
    CensusData.forEach(function(data){
        data.depression = +data.depression;
        data.medianIncomeAll = +data.medianIncomeAll;
    });
    
    // Step 2: Create Scale Functions
    let xLinearScale = d3.scaleLinear()
            .domain(1000, d3.max(CensusData, d => d.medianIncomeAll))
            .range([0,width])
    
    let yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(CensusData, d => d.depression)])
            .range([height, 0]);

    // Step 3: Create axis functions
  // ==============================
  let bottomAxis = d3.axisBottom(xScale);
  let leftAxis = d3.axisLeft(yLinearScale);
  // Step 4: Append Axes to the chart
  // ==============================
  // Add bottomAxis
  chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);

  // Add leftAxis to the left side of the display
  chartGroup.append("g").call(leftAxis);

  // Step 5: Create Circles
  // ==============================
  let circlesGroup = chartGroup.selectAll('circle')
      .data(hairData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.medianIncomeAll))
      .attr("cy", d => yLinearScale(d.depression))
      .attr("r", "10")
      .attr("fill", rgb(128, 128, 0))
      .attr("stroke-width", "2")
      .attr("stroke", rgb(128, 128, 0))
      .attr('opacity', '.75')
  // Step 6: Initialize tool tip
  // ==============================
  let toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d){
      return (`${d.locationAbbr} </br> % diagnosed as depressed:${d.depression} </br> Median Income: ${d.medianIncomeAll}`)
    });
  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip)

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("click", function(d){
    toolTip.show(d)
  })
  .on("mouseout", function(d){
    toolTip.hide(d)
  });
  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("% of Respondents Diagnosed with Depression");

  chartGroup.append("text")
    .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Median State Income");  
});