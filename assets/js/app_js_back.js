// @TODO: YOUR CODE HERE!
// Step 1: Setup the paramaters of you chart
// ===============================================
// Define the size/area of how big your chart/canvas is going to be
var svgWidth = 960; //1440
var svgHeight = 600; //900

// define the margins of the chart

var margin = {
    top : 20,
    right : 40,
    bottom : 80, 
    left : 100
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

// ===================================================== //
// =============== INSERT SWITCHING DATA =============== //
// ===================================================== //

var chosenXAxis = "age";
var chosenYAxis = "smokes";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
    // create scales

    var xScaleLinear = d3.scaleLinear()
    // trying to scale it so the data points aren't all on right side
    // took the min for the domain and subtracted one to keep scatter
    // plot on the canvas and not overlapping on y axis
    .domain([(d3.min(censusData, cdata => cdata[chosenXAxis])) - 1, 
        d3.max(censusData, cdata => cdata[chosenXAxis])])
    .range([0, width])
    .nice();
    console.log(width);

    return xScaleLinear;

}

// function used for updating y-scale var upon click on axis label
function yScale(censusData, chosenYAxis){
    // create scales

    var yScaleLinear = d3.scaleLinear()
    .domain([(d3.min(censusData, cdata => cdata[chosenYAxis])) - 1 , 
            d3.max(censusData, cdata => cdata[chosenYAxis])])
    .range([height, 0])
    .nice();

    return yScaleLinear;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis){
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;

}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis){
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;

}

// function used for updating circles group with 
// a tranistion to new circles

function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", cdata => newXScale(cdata[chosenXAxis]))
        .attr("cy", cdata => newYScale(cdata[chosenYAxis]));

    return circlesGroup;
}

// function used for updating cirlces group with new tooltip

function updateToolTip (chosenXAxis, chosenYAxis, circlesGroup){

    if (chosenXAxis === "age") {
        var xlabel = "Age:";
    }
    else {
        var xlabel = "Poverty";
    }

    if (chosenYAxis === "smokes"){
        var ylabel = "Smokes:";
    }
    else {
        var ylabel = "Healthcare:";

    }
    
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (cdata){
            return (`${cdata.state}<br>${xlabel}${cdata[chosenXAxis]}
                    <br>${ylabel}${cdata[chosenYAxis]}`);
        });
    

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(cdata){
        // "this allows the toolTip to show up on the mouseover and
        // not off to the side"
        toolTip.show(cdata, this);
    })

    // onmouseout event
        .on("mouseout", function (cdata, index){
            toolTip.hide(cdata, this);
        });
    
    return circlesGroup;



}

// ===================================================== //
// =============== ABOVE ALL NEW =============== //
// ===================================================== //

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
        cdata.healthcare = +cdata.healthcare; // y-axis call in data for healthcare
        cdata.age = +cdata.age; // x-axis call in data for age 
        cdata.poverty = +cdata.obesity; // y-axis call in data for obesity
        cdata.smokes = +cdata.smokes; // y- axis call in data from smokers
        cdata.poverty = +cdata.poverty; // x-axis call in data for poverty 
        cdata.income = +cdata.income;  // x-axis call in data for income
    });

        // Step 5: Create Scales
    // ==============================
// xScale moved above to test for transition btw data
    // var xScaleLinear = d3.scaleLinear()
    //     // trying to scale it so the data points aren't all on right side
    //     // took the min for the domain and subtracted one to keep scatter
    //     // plot on the canvas and not overlapping on y axis
    //     .domain([(d3.min(censusData, cdata => cdata.age)) - 1, d3.max(censusData, cdata => cdata.age)])
    //     .range([0, width]);
    //     console.log(width);

    //NEW CODE

        var xScaleLinear = xScale(censusData, chosenXAxis);
        var yScaleLinear = yScale(censusData, chosenYAxis);

// yscale moved above to test for transition btw data on y axis
    // var yScaleLinear = d3.scaleLinear()
    //     .domain([(d3.min(censusData, cdata => cdata.smokes)) - 1 , d3.max(censusData, cdata => cdata.smokes)])
    //     .range([height, 0]);
    
    // Step 6: Create Axes
    // =================================

    var bottomAxis = d3.axisBottom(xScaleLinear);
    var leftAxis = d3.axisLeft(yScaleLinear);

    // Step 7: Append the axes to chartGroup 
    // =========================================

    // Add X-Axis (bottomAxis) 

    var xAxis = chartGroup.append("g")
        .data(censusData)
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // and Y-Axis (leftAxis)

    var yAxis = chartGroup.append("g")
        .data(censusData)
        .classed("y-axis", true)
        //.attr("transform", `translate(${height}, 0-${width})`)
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
    .attr("cx", cdata => xScaleLinear(cdata[chosenXAxis]))
    .attr("cy", cdata => yScaleLinear(cdata[chosenYAxis]))
    .attr("r", "13")
    .attr("stroke", "black")
    .attr("fill", "red")
    .attr("opacity", ".5");

    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // Create Group for x- axis labels

    var labelsXGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    
    var ageLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age") // value to grab for event listener
        .classed("active", true)
        .text("Age");
    
    var povertyLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "poverty") // value to grab for event listener
        .classed("inactive", true)
        .text("Poverty");

    var incomeLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income");

    // Create Group for Y- axis labels

    var labelsYGroup = chartGroup.append("g")
        .attr("transform", `translate(${height / 2 - 150}, ${0})`); 
        //.attr("transform", "roatate(-90)");

    var smokesLabel = labelsYGroup.append("text")
        //.attr("transform", "roatate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("value", "smokes") // value to grab for event listener
        .classed("active", true)
        .text("Smokes");
    
    var healthcareLabel = labelsYGroup.append("text")
        //.attr("transform", "roatate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("value", "healthcare") // value to grab for event listener
        .classed("inactive", true)
        .text("Healthcare");
    
    var obesityLabel = labelsYGroup.append("text")
        //.attr("transform", "roatate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obesity");
    
 
    // adding text to the circles

    var circlesGroup = chartGroup.selectAll()
        .data(censusData)
        .enter()
        .append("text")
        .attr("x", cdata => xScaleLinear(cdata[chosenXAxis]))
        .attr("y", cdata => yScaleLinear(cdata[chosenYAxis]))
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .style("fill","blue")
        .text(cdata => (cdata.abbr));

        // Create y - axes labels

    // chartGroup.append("text")
    //     .attr("class", "axisLabel")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 0 - margin.left)
    //     .attr("x", 0 - (height/2))
    //     .attr("dy", "1em")
    //     .attr("text-anchor", "middle")
    //     .attr("font-size", "20px")
    //     .attr("fill", "black")
    //     .text("Smokes");

    //  updateToolTip function above csv import

    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener 

    labelsXGroup.selectAll("text")
    .on("click", function (){

        // get value of selection
        var xvalue = d3.select(this).attr("value");
        if (xvalue !== chosenXAxis) {

            // replaces chosenAxis with value

            chosenXAxis = xvalue;

            // functions here found above csv import
            // updates x scale for new data
            xScaleLinear = xScale(censusData, chosenXAxis);

            // updates x axis with transition
            xAxis = renderXAxes(xScaleLinear, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xScaleLinear, chosenXAxis);


            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // changes class to change bold text

            if (chosenXAxis === "age"){
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }



        }

    });

    // y axis labels event listener 

    labelsYGroup.selectAll("text")
    .on("click", function (){

        // get value of selection
        var yvalue = d3.select(this).attr("value");
        if (yvalue !== chosenYAxis) {

            // replaces chosenAxis with value

            chosenYAxis = yvalue;

            // functions here found above csv import
            // updates y scale for new data
            yScaleLinear = xScale(censusData, chosenYAxis);

            // updates x axis with transition
            yAxis = renderYAxes(yScaleLinear, yAxis);

            // updates circles with new y values
            circlesGroup = renderCircles(circlesGroup, xScaleLinear, chosenXAxis);


            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // changes class to change bold text

            if (chosenYAxis === "smokes"){
                smokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                healthcareLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }



        }

    });

}

console.log("----- End Reading app.js -----");












