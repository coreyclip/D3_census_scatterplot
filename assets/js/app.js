// D3 Scatterplot 

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.
let svgWidth = 960;
let svgHeight = 600;

let margin = {
  top: 40,
  right: 40,
  bottom: 100,
  left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chartGroup, and shift the latter by left and top margins.
let svg = d3.select("#graph")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Create axes labels

// y labels
chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 1.5))
  .attr("dy", "1em")
  .attr("class", "y-axis-text")
  .text("% Depressed");

chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 20)
  .attr("x", 0 - (height / 1.5))
  .attr("dy", "1em")
  .attr("class", "y-axis-text")
  .text("% Blind or Trouble Seeing");

chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 0)
  .attr("x", 0 - (height / 1.5))
  .attr("dy", "1em")
  .attr("class", "y-axis-text")
  .text("% Arthritic");



  // x labels
chartGroup.append("text")
  .attr("transform", `translate(${width/2}, ${height + margin.top + 20})`)
  .attr("class", "x-axis-text")
  .text("Median Income");

chartGroup.append("text")
  .attr("transform", `translate(${width/2}, ${height + margin.top + 40})`)
  .attr("class", "x-axis-text")
  .text("Healthcare Unaffordable");

chartGroup.append("text")
  .attr("transform", `translate(${width/2}, ${height + margin.top + 60})`)
  .attr("class", "x-axis-text") 
  .text("Unemployment Rate");


// Now that the chartGroup parameters are set up we move to actually plotting the data

d3.csv('data/data.csv', function(err, CensusData){
    if (err) throw err;

    //log csv data
    console.log("raw data: ", CensusData)

    //Parse Data as numbers
    CensusData.forEach(function(data){
        data.depression = +data.depression;
        data.medianIncomeAll = +data.medianIncomeAll;
        //data.states = string(data.states);
    });
    
 
    // Create Scale Functions
    let xScale = d3.scaleLinear().range([0,width]);
    let yScale = d3.scaleLinear().range([height, 0]);

    // set the domain of the axes
    xScale.domain([d3.min(CensusData, d => d.medianIncome)
                   - d3.deviation(CensusData, d => d.medianIncome) / 2,
                   d3.max(CensusData, d => d.medianIncome)]);
    yScale.domain([d3.min(CensusData, d => d.percentDepressed)
                  - d3.deviation(CensusData, d => d.percentDepressed) / 2,
                   d3.max(CensusData, d => d.percentDepressed)]);
    
    //  define axis functions
    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);
      console.log("x axis: ", xAxis);
      console.log("y axis: ", yAxis);
    
    // Append Axes to the chartGroup
  // ==============================
  // Add bottomAxis
  chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

  // Add leftAxis to the left side of the display
  chartGroup.append("g")
            .call(yAxis);

  console.log("ChartGroup: ", chartGroup)
  //  Create Circles
  // ==============================
  let circlesGroup = chartGroup.selectAll('circle')
      .data(CensusData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.medianIncome))
      .attr("cy", d => yScale(d.percentDepressed))
      .attr("r", "10")
      .attr("fill", "green")
      .attr('opacity', "0.75")
      

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

  // Initialize tool tip
  // ==============================
  let toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([80, -60])
  .html(function(d){
    console.log(d)
    return (`<div class=panel-primary>
    <div class="panel-heading">${d.states}</div>
          
          </div>`)
  });

// Create tooltip in the chartGroup
// ==============================
  console.log("chartGroup line 112:", chartGroup);
 chartGroup.call(toolTip);


  //  Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("mouseover", function(d){
    toolTip.show(d)
  })
  .on("mouseout", function(d){
    toolTip.hide(d)
  });

  // change the x axis's status from inactive to active when clicked and change all active to inactive
  function labelChangeX(clickedAxis) {
    d3.selectAll(".x-axis-text")
        .filter(".active")
        .classed("active", false)
        .classed("inactive", true);

    clickedAxis.classed("inactive", false).classed("active", true);
}

// change the y axis's status from inactive to active when clicked and change all active to inactive
function labelChangeY(clickedAxis) {
  d3.selectAll(".y-axis-text")
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

  clickedAxis.classed("inactive", false).classed("active", true);
}

// on click x-axis
d3.selectAll(".x-axis-text").on('click')

});



