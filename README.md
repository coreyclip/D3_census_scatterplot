# D3_Census_explorer

## About 
This project utilizes D3.js to create an interactive scatterplot for 
exploring relationships between different health stats and health outcomes 

Users can click on each axis to re orient the chart, on-hover events bring up more detailed information. 


# assets/app.js
Handles the actual D3 code 


## Setting up the Chart's size 

These variables are later fed into attributes of the D3 chart


```javascript
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
  .attr('padding-bottom', 1)

let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
```


## Loading and transforming the data

D3 can load data from a csv in a callback, when parsing the numbers + tells D3 to load the data points as numbers
```javascript

d3.csv('data/data.csv', function(err, CensusData){
    if (err) throw err;

    //log csv data
    console.log("raw data: ", CensusData)

    //Parse Data as numbers
    CensusData.forEach(function(data){
        data.percentDepressed = +data.percentDepressed;
        data.medianIncome = +data.medianIncome;
        data.blindness = +data.blindness;
        data.Arthritis = +data.Arthritis;
        data.healthcare_unaffordable = +data.healthcare_unaffordable;
        data.unemployment = +data.unemployment
        //data.states = string(data.states);
    });
    
....

})
```


## Creating our scale functions and adding the circles of our scatter plot 

Due to D3's more low level nature we need to explicitly tell the library how to bound our data points 
within the context our chart. our xScale and yScales ensures that D3 doesn't try to plot things outside of the 
height and width of our chart 

Setting the Domain of the chart, tells D3 how to scale the axis in relation to the data being passed to it 

The circlesGroup variable shows the basic pattern of creating a D3 object

```javascript

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
                   

    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);

    // Append Axes to the chartGroup
  // ==============================
  // Add bottomAxis
  chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .selectAll('text').remove()
   

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
      .attr("cx", d => xScale(d.medianIncome)) // x position
      .attr("cy", d => yScale(d.percentDepressed)) // y position
      .attr("r", "15") // circle radius aka size
      .attr("fill", "green") // color
      .attr('opacity', "0.60")

```

## Creating the Tooltip 

By default D3 add tooltips to the data object themselves. With some basic css I instead relocated them 
to the right hand corner 

```css 

  .tooltip {
    position: absolute;
    top: 40px!important;
    left: 965px!important;
    text-align: left;
  }
```


Creating the tooltip note the usage of .html(function(d){})

```javascript

  // Initialize tool tip
  // ==============================
  let toolTip = d3.tip()
    .attr("class", "tooltip")
    .html(function(d){
    //console.log(d)
    return (`<div class=panel panel-primary>
    <div class="panel-heading">${d.states}</div>
       <div class="panel-body">
       <ul>
       <li>pop in poverty ${d.povertyPop}%</li>
       <li>median income $ ${d.medianIncome}</li>       
       <li>unemployment ${d.unemployment}%</li>       
       <li>blindness ${d.blindness}%</li>       
       <li>arthritis ${d.Arthritis}%</li>       
       <li>healthcare unaffordable ${d.healthcare_unaffordable}%</li>       
       </ul>
 </div>           
          </div>`)
  });

// Create tooltip in the chartGroup
// ==============================
 chartGroup.call(toolTip);
 
 
 
  //  Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("mouseover", function(d){
      toolTip.show(d);
      d3.select(this).attr('fill', 'orange')
          .attr('opacity', '0.80');
  })
 circlesGroup.on("mouseout", function(d){
     toolTip.hide(d);
     d3.select(this).attr("fill", "green")
         .attr('opacity', "0.60");
  });

```


## Creating the axis data labels and handling on click events 

The final code blocks defines the data labels on the axis and handles on click events to 
transform the data using css classes 

```javascript 

// Create axes labels

// y labels
chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 1.5))
  .attr("dy", "1em")
  .attr("class", "y-axis-text")
  .classed("active", true)
  .attr("csv-column-name", "percentDepressed")  
  .text("% Depressed");

chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 20)
  .attr("x", 0 - (height / 1.5))
  .attr("dy", "1em")
  .attr("class", "y-axis-text")
  .classed("inactive", true)
  .attr("csv-column-name", "blindness")  
  .text("% Blind or Trouble Seeing");

chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 0)
  .attr("x", 0 - (height / 1.5))
  .attr("dy", "1em")
  .attr("class", "y-axis-text")
  .classed("inactive", true)
  .attr("csv-column-name", "Arthritis")  
  .text("% Arthritic");



  // x labels
chartGroup.append("text")
  .attr("transform", `translate(${width/2}, ${height + margin.top + 15})`)
  .attr("class", "x-axis-text")
  .attr("csv-column-name", "medianIncome")
  .classed("active", true)  
  .text("Median Income");

chartGroup.append("text")
  .attr("transform", `translate(${width/2}, ${height + margin.top + 35})`)
  .attr("class", "x-axis-text")
  .attr("csv-column-name", "healthcare_unaffordable")
  .classed("inactive", true)
  .text("Healthcare Unaffordable");

chartGroup.append("text")
  .attr("transform", `translate(${width/2}, ${height + margin.top + 55})`)
  .attr("class", "x-axis-text")
  .attr("csv-column-name", "unemployment")   
  .classed("inactive", true)
  .text("Unemployment Rate");



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
d3.selectAll(".x-axis-text").on('click', function(){

    let clickedSelection = d3.select(this);
    ClickedXaxis = clickedSelection.attr('csv-column-name')
    console.log("this has been clicked: ", clickedSelection)

    // get current y axis
    let CurrentYaxis = d3.selectAll(".y-axis-text").filter(".active").attr('csv-column-name')
    console.log("current y axis status",CurrentYaxis)

    // get current x axis
    let CurrentXaxis = d3.selectAll(".x-axis-text").filter(".active").attr('csv-column-name')
    console.log("current x axis status", CurrentXaxis)


    if (clickedSelection.classed('inactive')){
        //console.log(CensusData)
        //console.log('current x scale', xScale)
        xScale.domain([
                      d3.min(CensusData, d => d[ClickedXaxis])
                      - d3.deviation(CensusData, d => d[ClickedXaxis]) / 2,
                      d3.max(CensusData, d => d[ClickedXaxis])
                      ]);
        console.log("New X scale", xScale)
        //  define axis functions
        let xAxis = d3.axisBottom(xScale);
        // adjust x-axis
        svg.select(".x-axis")
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .call(xAxis)
            d3.selectAll("circle")
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("cx", function (d) {
                console.log('New circle x corr',  d[ClickedXaxis])
                return xScale(d[ClickedXaxis]);
                //return d[ClickedXaxis];
            })
            // adjust abbreviations
            d3.selectAll(".abbr")
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("x", function (d) {
                return xScale(d[ClickedXaxis]);
            })

            labelChangeX(clickedSelection);
    };


});


// on click y-axis
d3.selectAll(".y-axis-text").on('click', function(){

  
  let clickedSelection = d3.select(this);
    ClickedYaxis = clickedSelection.attr('csv-column-name')
    console.log("this has been clicked: ", clickedSelection)

    // get current x axis
    let CurrentXaxis = d3.selectAll(".x-axis-text").filter(".active").attr('csv-column-name')
    console.log("current x axis status",CurrentXaxis)


    if (clickedSelection.classed('inactive')){
        //console.log(CensusData)
        
        //console.log('current x scale', xScale)
        yScale.domain([
                      d3.min(CensusData, d => d[ClickedYaxis])
                      - d3.deviation(CensusData, d => d[ClickedYaxis]) / 2,
                      d3.max(CensusData, d => d[ClickedYaxis])
                      ]);
          
        //console.log("New X scale", xScale)
        
        //  define axis functions
        let yAxis = d3.axisLeft(yScale);
          
        // adjust x-axis
        svg.select(".y-axis")
            .transition()
            .duration(600)
            .ease(d3.easeLinear)
            .call(yAxis);
        
            d3.selectAll("circle")
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("cy", function (d) {
                console.log('New circle x corr',  d[ClickedYaxis])
                return yScale(d[ClickedYaxis]);
               
            })
            
          
            // adjust abbreviations
            d3.selectAll(".abbr")
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("y", function (d) {
                return yScale(d[ClickedYaxis]);
            })

            labelChangeY(clickedSelection);
    };
})


```
