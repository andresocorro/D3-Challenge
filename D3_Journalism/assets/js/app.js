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

// Create SVG wrapperm append a SVG Group that will hold our chart. Shift it by the left and top margins

var svg = d3.select('#scatter')
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)