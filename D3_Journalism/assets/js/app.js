//  Set up chart

var svgWidth = 800;
var svgHeight =  500;

var margin = {
    top: 40,
    right: 50,
    bottom: 100,
    left: 100
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

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
function renderAxes(newXScale, xAxis) {
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
  
    else {
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


// Create SVG wrapperm append a SVG Group that will hold our chart. Shift it by the left and top margins

var svg = d3.select('#scatter')
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

d3.csv("assets/data/data.csv").then(function(censusData){

    // parse thru data
    censusData.forEach(function(data){
        data.poverty = +data.poverty;
        data.healthcate = +data.healthcare;
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.income = +data.income;
        data.obesity = data.obesity;


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



}).catch(function(error){
    console.log(error);
});