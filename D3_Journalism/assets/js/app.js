//  Set up chart

var svgWidth = 800;
var svgHeight =  600;

var margin = {
    top: 40,
    right: 50,
    bottom: 100,
    left: 100
};

console.log("it works")

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Create SVG wrapperm append a SVG Group that will hold our chart. Shift it by the left and top margins

var svg = d3.select('#scatter')
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

// Initial Parameters
var chosenXAxis = "age";
var chosenYAxis = "obesity";

// function to update x-scale variable when clicking on axis label
function xScale(censusData, chosenXAxis){

    // Create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) * .08,
            d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, chartWidth]);

    return xLinearScale

}

// function to update y-scale variable when clicking on axis label
function yScale(censusData, chosenYAxis){

    // create scales
    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.9,
    d3.max(censusData, d => d[chosenYAxis]) * 1.1
])
    .range([chartHeight,0])
    return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  // function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

// function used for updating circles group with a transition to
// new circles

function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis){
    circlesGroup.selectAll("circle").transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    circlesGroup.selectAll("text").transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));

    return circlesGroup;

    }

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    if (chosenXAxis === "age") {
        var xLabel = "Median Age";
    }
  
    else if (chosenXAxis === "income") {
        var xLabel = "Median Household Income";
    }
  
    else {
        var xLabel = "Poverty Rate";
    }
  
    if (chosenYAxis === "obesity") {
        var yLabel = "% Obese";
    }
  
    else if (chosenYAxis === "smokes") {
        var yLabel = "% Smokes";
    }
  
    else if (chosenYAxis === "healthcare"){
        var yLabel = "% Lacking Healthcare";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${xLabel} ${d[chosenXAxis]} <br>${yLabel} ${d[chosenYAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data,this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }

d3.csv("assets/data/data.csv").then(function(censusData){

    // parse thru data
    censusData.forEach(function(data){
        data.poverty = parseFloat(data.poverty);
        data.healthcate = parseFloat(data.healthcare);
        data.age = parseFloat(data.age);
        data.smokes = parseFloat(data.smokes);
        data.income = +data.income;
        data.obesity = parseFloat(data.obesity);


    });

    // create scale functions
    // xscale
    var xLinearScale = xScale(censusData, chosenXAxis);

    // y scale
    var yLinearScale = yScale(censusData, chosenYAxis);

    // create Axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    
    // ADD AXES TO CHART

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .attr("transform", `translate(0, 0)`)
    .call(leftAxis);

    // CREATE CIRCLES
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("g");

    circlesGroup.append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", "15")
        .attr("opacity", "0.75")
        .attr("fill","lightblue")
        .classed("stateCircle", true);

        circlesGroup.append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("dy",6)
        .classed("stateText", true)
        .attr("text-anchor", "middle")
        .style("font-size",1.5)
        .style("fill", "white")
        .style("font", "10px sans-serif")
        .style("font-weight", "bold")
        .text(d => d.abbr);

// create group for all 3 x-axis labels
    var xLabelsGroup = chartGroup.append("g")
                   .attr("transform", `translate(${chartWidth /2}, ${chartHeight + 20})`);

    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 25)
        .attr("value", "age")
        .classed("active", true)
        .text("Age (Median)");

    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");

    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 75)
        .attr("value", "poverty")
        .classed("inactive", true)
        .text("In Poverty(%)");

// create group for all 3 y-axis labels

var yLabelsGroup = chartGroup.append("g")
                .attr("transform", `translate(${-margin.left}, ${chartHeight / 2}) rotate(-90)`);
        
    var obesityLabel = yLabelsGroup.append("text")
        .attr("y", 5)
        .attr("x", 0)
        .attr("dy", "1em")
        .attr("value", "obesity")
        .classed("axis-text", true)
        .classed("active", true)
        .text("Obese (%)");
        
    var smokesLabel = yLabelsGroup.append("text")
        .attr("y", 30)
        .attr("x", 0)
        .attr("dy", "1em")
        .attr("value", "smokes")
        .classed("axis-text", true)
        .classed("inactive", true)
        .text("Smoke (%)");
        
    var healthcareLabel = yLabelsGroup.append("text")
        .attr("y", 55)
        .attr("x", 0)
        .attr("dy", "1em")
        .attr("value", "healthcare")
        .classed("axis-text", true)
        .classed("inactive", true)
        .text("Lack Healthcare (%)");

    // update tooltip
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // X-Axis Event Listener
    xLabelsGroup.selectAll("text")
        .on("click", function(){
        var xValue = d3.select(this).attr("value");
        if (xValue !== chosenXAxis){

            // replace chosenxaxis with value clicked upon clicking
            chosenXAxis = xValue;

            // Update scaling to reflect new chosen data
            // updating xScale
            xLinearScale = xScale(censusData, chosenXAxis);

            // update xaxis with the transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // Update Circles with new values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // update tool tips with new data
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // change bold txt in active axis
            xLabelsGroup.selectAll("text")
                .classed("inactive", true)
                .classed("active", false);

            var labelMap = {
                income: incomeLabel,
                age: ageLabel,
                poverty: povertyLabel
            }

            labelMap[chosenXAxis].classed("active", true)
                                 .classed("inactive", false);
        }

        });

    // Y-Axis Event Listender
    yLabelsGroup.selectAll("text")
    .on("click", function(){
    var yValue = d3.select(this).attr("value");
    if (yValue !== chosenYAxis){

        // replace chosenxaxis with value clicked upon clicking
        chosenYAxis = yValue;

        // Update scaling to reflect new chosen data
        // updating xScale
        yLinearScale = yScale(censusData, chosenYAxis);

        // update xaxis with the transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // Update Circles with new values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // update tool tips with new data
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // change bold txt in active axis
        yLabelsGroup.selectAll("text")
            .classed("inactive", true)
            .classed("active", false);

        var labelMap = {
            obesity: obesityLabel,
            smokes: smokesLabel,
            healthcare: healthcareLabel
        }

        labelMap[chosenYAxis].classed("active", true)
                             .classed("inactive", false);
    }

        });

}).catch(function(error){
    console.log(error);
});