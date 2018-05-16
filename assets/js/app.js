// D3 Scatterplot 

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.
let svgWidth = 960;
let svgHeight = 500;

let margin = {
  top: 30,
  right: 40,
  bottom: 100,
  left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our Chart, and shift the latter by left and top margins.
let svg = d3.select(".Chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

let Chart = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.select(".Chart").append("div").attr("class", "tooltip").style("opacity", 0);


// Now that the Chart parameters are set up we move to actually plotting the data

d3.csv('../data/data.csv', function(err, CensusData){
    if (err) throw err;

    //log csv data
    console.log(CensusData)

    // Step 1: Initialize tool tip
    // ==============================
    let toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d){
      return (`${d.stateAbbr} </hr> Median Income: ${d.medianIncomeAll}`)
    });

    // Step 2: Create tooltip in the Chart
    // ==============================
    Chart.call(toolTip)


    // Step 3: Parse Data as numbers
    CensusData.forEach(function(data){
        data.depression = +data.depression;
        data.medianIncomeAll = +data.medianIncomeAll;
    });
    
    // Step 4: Create Scale Functions
    let xScale = d3.scaleLinear().range([0,width]);
    let yScale = d3.scaleLinear().range([height, 0]);

    // Step 5: define axis functions
    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);

    // these variables store the min and max values in a column in data.csv
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    // functions to find Min and Max of each csv column
    // this is needed to create appropriate axis

    function findMinAndMaxX(dataColumnX) {
      xMin = d3.min(CensusData, function (d) { return d[dataColumnX] * 0.7 });
      xMax = d3.max(CensusData, function (d) { return d[dataColumnX] * 1.5 });
   };

   function findMinAndMaxY(dataColumnY) {
      yMin = d3.min(CensusData, function (d) { return d[dataColumnY] * 0.7 });
      yMax = d3.max(CensusData, function (d) { return d[dataColumnY] * 1.5 });
    };

  
  // call the findMinAndMax() on the default X Axis
  findMinAndMaxX(defaultAxisLabelX)
  findMinAndMaxY(defaultAxisLabelY)

  // set the domain of the axes
  xScale.domain([xMin, xMax]);
  yScale.domain([yMin, yMax])

  // set the default x-axis
  var defaultAxisLabelX = "Median Income"

  // set the default y-axis
  var defaultAxisLabelY = "% of Respondents with Depression"
  
    // Step 6: Append Axes to the Chart
  // ==============================
  // Add bottomAxis
  Chart.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);

  // Add leftAxis to the left side of the display
  Chart.append("g").call(yAxis);

  // Step 7: Create Circles
  // ==============================
  let circlesGroup = Chart.selectAll('circle')
      .data(CensusData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.medianIncome))
      .attr("cy", d => yScale(d.percentDepressed))
      .attr("r", "10")
      .attr("fill", "rgb(128, 128, 0)")
      .attr("stroke-width", "2")
      .attr("stroke", "rgb(128, 128, 0)")
      .attr('opacity', 0.75)
      
  

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("mouseover", function(d){
    toolTip.show(d)
  })
  .on("mouseout", function(d){
    toolTip.hide(d)
  });
  // Create axes labels
  Chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 30)
    .attr("x", 0 - (height / 1.2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("% of Respondents Diagnosed with Depression");

  Chart.append("text")
    .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Median State Income");  

  // Step 9 add state labels
  circlesGroup.selectAll("text")
    .data(CensusData)
    .enter()
    .append('text')
    .text(d => d.stateAbbr)
    .attr("x", d => xScale(d.medianIncome))
    .attr("y", d => yScale(d.percentDepressed))
    .attr("font-size", "12px")
    .attr("text-anchor", "middle")
    .attr("class","abbr")
    // display tooltip on click
    .on("mouseover", function (d) {
      toolTip.show(d);
  })
  // hide tooltip on mouseout
  .on("mouseout", function (d, i) {
      toolTip.hide(d);
  })

  // Step 10 add other axis labels
  // create x-axis
  Chart.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0,${height})`)
  .call(xAxis);

// create y-axis
Chart.append("g")
  .attr("class", "y-axis")
  .call(yAxis)


// Append axes titles

// add main x-axis title
Chart.append("text")
  .attr("transform", `translate(${width - 40},${height - 5})`)
  .attr("class", "axis-text-main")
  .text("Development Indicators")

Chart.append("text")
  .attr("transform", `translate(15,60 )rotate(270)`)
  .attr("class", "axis-text-main")
  .text("Health Problems")

// add x-axis titles
Chart.append("text")
  .attr("transform", `translate(${width / 2},${height + 40})`)
  // This axis label is active by default
  .attr("class", "axis-text-x active")
  .attr("data-axis-name", "percentBelowPoverty")
  .text("In Poverty (%)");

Chart.append("text")
  .attr("transform", `translate(${width / 2},${height + 60})`)
  // This axis label is active by default
  .attr("class", "axis-text-x inactive")
  .attr("data-axis-name", "medianIncome")
  .text("Household Income (Median)");

Chart.append("text")
  .attr("transform", `translate(${width / 2},${height + 80})`)
  // This axis label is active by default
  .attr("class", "axis-text-x inactive")
  .attr("data-axis-name", "ageDependencyRatio")
  .text("Age Dependency Ratio");


// add y-axis titles 
Chart.append("text")
  .attr("transform", `translate(-40,${height / 2})rotate(270)`)
  .attr("class", "axis-text-y active")
  .attr("data-axis-name", "smokers")
  .text("Smokes (%)");


Chart.append("text")
  .attr("transform", `translate(-60,${height / 2})rotate(270)`)
  .attr("class", "axis-text-y inactive")
  .attr("data-axis-name", "alcoholConsumption")
  .text("Alcohol Consumption (%)");


Chart.append("text")
  .attr("transform", `translate(-80,${height / 2})rotate(270)`)
  .attr("class", "axis-text-y inactive")
  .attr("data-axis-name", "physicallyActive")
  .text("Physically Active (%)");

// change the x axis's status from inactive to active when clicked and change all active to inactive
function labelChangeX(clickedAxis) {
  d3.selectAll(".axis-text-x")
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

  clickedAxis.classed("inactive", false).classed("active", true);
}

// change the y axis's status from inactive to active when clicked and change all active to inactive
function labelChangeY(clickedAxis) {
  d3.selectAll(".axis-text-y")
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

  clickedAxis.classed("inactive", false).classed("active", true);
}

// on click events for the x-axis
d3.selectAll(".axis-text-x").on("click", function () {

  // assign the variable to the current axis
  var clickedSelection = d3.select(this);
  var isClickedSelectionInactive = clickedSelection.classed("inactive");
  console.log("this axis is inactive", isClickedSelectionInactive)
  var clickedAxis = clickedSelection.attr("data-axis-name");
  console.log("current axis: ", clickedAxis);

  if (isClickedSelectionInactive) {
      currentAxisLabelX = clickedAxis;

      findMinAndMaxX(currentAxisLabelX);

      xScale.domain([xMin, xMax]);

      // create x-axis
      svg.select(".x-axis")
          .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .call(xAxis);

      d3.selectAll("circle")
          .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .on("start", function () {
              d3.select(this)
                  .attr("opacity", 0.50)
                  .attr("r", 20)

          })
          .attr("cx", function (d) {
              return xScale(d[currentAxisLabelX]);
          })
          .on("end", function () {
              d3.select(this)
                  .transition()
                  .duration(500)
                  .attr("r", 15)
                  .attr("fill", "#4380BA")
                  .attr("opacity", 0.75);
          })

      d3.selectAll(".stateText")
              .transition()
              .duration(1000)
              .ease(d3.easeLinear)
              .attr("x", function (d) {
                  return xScale(d[currentAxisLabelX]);
              })
              
      

      labelChangeX(clickedSelection);
  }
});

// On click events for the y-axis
d3.selectAll(".axis-text-y").on("click", function () {

  // assign the variable to the current axis
  var clickedSelection = d3.select(this);
  var isClickedSelectionInactive = clickedSelection.classed("inactive");
  console.log("this axis is inactive", isClickedSelectionInactive)
  var clickedAxis = clickedSelection.attr("data-axis-name");
  console.log("current axis: ", clickedAxis);

  if (isClickedSelectionInactive) {
      currentAxisLabelY = clickedAxis;

      findMinAndMaxY(currentAxisLabelY);

      yScale.domain([yMin, yMax]);

      // create y-axis
      svg.select(".y-axis")
          .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .call(yAxis);

      d3.selectAll("circle")
          .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .on("start", function () {
              d3.select(this)
                  .attr("opacity", 0.50)
                  .attr("r", 20)

          })
          .attr("cy", function (data) {
              return yScale(data[currentAxisLabelY]);
          })
          .on("end", function () {
              d3.select(this)
                  .transition()
                  .duration(500)
                  .attr("r", 15)
                  .attr("fill", "#4380BA")
                  .attr("opacity", 0.75);
          })

      d3.selectAll(".stateText")
          .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .attr("y", function (d) {
              return yScale(d[currentAxisLabelY]);
          })

      labelChangeY(clickedSelection);

  }

});

});