// @TODO: YOUR CODE HERE!
// Step 1: Setup the paramaters of you chart
// ===============================================
// Define the size/area of how big your chart/canvas is going to be
var svgWidth = 600; //1440
var svgHeight = 400; //900

// define the margins of the chart

var margin = {
    top : 20,
    right : 40,
    bottom : 60, 
    left : 50
};

// Create the width and height svg margins 
// and parameters to fit chart within the canvas

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Step 2:  Create an SVG Wrapper
// append an SVG group that will hold our chart/canvas,
// and shift the latter by left and top margins.
// Give the canvas width and height calling the predifined variables.
// ===================================================


var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);


// Create the chartGroup that will contain the data
// Use transform attribute to fit it within the canvas

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


// Step 3:  Import data from data.csv file
// ========================================
//var file = "assets/data/data.csv";

/***
  d3.csv works similar to d3.json. The callback functions still takes two position arguments: (error, response).
****/ 
console.log("----- Reading CSV -----");
d3.csv("assets/data/data.csv", function(error, censusData) {
    if (error) throw error;

    console.log("------- Log -------");
    console.log(censusData);
    console.log("------- Log -------");

    // Step 4: Parse the data 

    censusData.forEach(function(cdata){
        cdata.healthcare = +cdata.healthcare;
        cdata.age = +cdata.age;
        cdata.poverty = +cdata.obesity;
        cdata.smokes = + cdata.smokes;
    });

    // Step 5: Create Scales
    // ==============================

    var xScaleLinear = d3.scaleLinear()
        .domain([0, d3.max(cdata.age)])
        .range([0, width]);

    var yScaleLinear = d3.scaleLinear()
        .domain([0, d3.max(cdata.smokes)])
        .range([height, 0]);
    
    // Step 6: Create Axes
    // =================================

    var bottomAxis = d3.axisBottom(xScaleLinear);
    var leftAxis = d3.axisLeft(yScaleLinear);

    // Step 7: Append the axes to chartGroup 
    // =========================================

    // Add bottomAxis
    chartGroup.append("g")
        .attr(transform, `translate(0, ${height})`)
        .call(bottomAxis);
    chartGroup.append("g")
        .call(leftAxis);
        

    
    // Step 8: Set up scatter generator and append two SVG paths
    // ==============================================
    // Scatter generators for each line

    // append circles to data points, add transitions
    // Hint:  You may have to alter this code for the transition on page load
    var circlesGroup = chartGroup.selectAll("circle")
    .data(cdata)
    .enter()
    .append("circle")
    .attr("cx", (cdata, i) => xScale(i))
    .attr("cy", cdata => yScale(cdata))
    .attr("r", "10")
    .attr("fill", "red");

        
        


});