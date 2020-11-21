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
var chosenYaxis = "obesity";

// function to update x-scale variable when clicking on axis label
function xScale(censusData, chosenXAxis){

    // Create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) * .08,
            d3.max(censusData, d[chosenYaxis]) * 1.2
    ])
    .range([0, chartWidth]);

    return xLinearScale

}

// function to update y-scale variable when clicking on axis label
function yScale(censusData, chosenYAxis){

    // create scales
    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) *1.1
])
    .range([chartHeight,0])
    return yLinearScale;
}



// Create SVG wrapperm append a SVG Group that will hold our chart. Shift it by the left and top margins

var svg = d3.select('#scatter')
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

d3.csv("assets/data/data.csv").then(function(censusData){

    console.log(censusData)



})