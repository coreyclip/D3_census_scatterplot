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
    })
    
    // Step 2: Create Scale Functions
    let xLinearScale = d3.scaleLinear()
            .domain(1000, d3.max(CensusData, d => d.medianIncomeAll))
            .range([0,width])
    

    }

})