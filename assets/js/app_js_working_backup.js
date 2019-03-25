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
var file = "assets/data/data.csv";

/***
  d3.csv works similar to d3.json. The callback functions still takes two position arguments: (error, response).
****/ 
console.log("---- Testing Reading CSV ----");
d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error){
    throw error;
}

function successHandle(censusData) {
    censusData.forEach(function(cdata){
        cdata.healthcare = +cdata.healthcare;
        cdata.age = +cdata.age;
        cdata.poverty = +cdata.obesity;
        cdata.smokes = + cdata.smokes;
    });

        // Step 5: Create Scales
    // ==============================

    var xScaleLinear = d3.scaleLinear()
        // trying to scale it so the data points aren't all on right side
        // took the min for the domain and subtracted one to keep scatter
        // plot on the canvas and not overlapping on y axis
        .domain([(d3.min(censusData, cdata => cdata.age)) - 1, d3.max(censusData, cdata => cdata.age)])
        .range([0, width]);
        console.log(width);

    var yScaleLinear = d3.scaleLinear()
        .domain([(d3.min(censusData, cdata => cdata.smokes)) - 1 , d3.max(censusData, cdata => cdata.smokes)])
        .range([height, 0]);
    
    // Step 6: Create Axes
    // =================================

    var bottomAxis = d3.axisBottom(xScaleLinear);
    var leftAxis = d3.axisLeft(yScaleLinear);

    // Step 7: Append the axes to chartGroup 
    // =========================================

    // Add bottomAxis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    chartGroup.append("g")
        .call(leftAxis);
        

    
    // Step 8: Set up scatter generator and append two SVG paths
    // ==============================================
    // Scatter generators for each line

    // append circles to data points, add transitions
    // Hint:  You may have to alter this code for the transition on page load
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", cdata => xScaleLinear(cdata.age))
    .attr("cy", cdata => yScaleLinear(cdata.smokes))
    .attr("r", "10")
    .attr("fill", "red")
    .attr("opacity", ".5");

    var circlesGroup = chartGroup.selectAll()
        .data(censusData)
        .enter()
        .append("text")
        .attr("x", cdata => xScaleLinear(cdata.age))
        .attr("y", cdata => yScaleLinear(cdata.smokes))
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .style("fill","blue")
        .text(cdata => (cdata.abbr));
    //  Append tooltips

  

    // Create axes labels

    chartGroup.append("text")
        .attr("class", "axisLabel")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("fill", "black")
        .text("Age");

    chartGroup.append("text")
        .attr("class", "axisLabel")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("fill", "black")
        .text("Smokes");



}

console.log("----- End Reading app.js -----");
