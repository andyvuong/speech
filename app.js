$(document).ready(function() {

    var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%d-%b-%y").parse;
    //var x = d3.time.scale().range([0, width]);
    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5);

    // Define the line
    var valueline = d3.svg.line()
        .x(function(d) { return x(d.startTime); })
        .y(function(d) { return y(d.sentiment); });

    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    $("#chart-row").css("height", height + margin.top + margin.bottom);

    // Add the visualization
    //  Inaugural Address
    d3.json("data/jfk_speech.json", function(error, data) {
        data.forEach(function(d) {
            d.startTime = +d.startTime;
            d.sentiment = d.sentiment;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.startTime; }));
        y.domain(d3.extent(data, function(d) { return d.sentiment; }));
        //y.domain([0, d3.max(data, function(d) { return d.sentiment; })]);

        // Add the valueline path.
        svg.append("path")
            .attr("class", "line")
            .attr("class", "path_sen")
            .attr("d", valueline(data));

        // Add the scatterplot
        svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.startTime); })
            .attr("cy", function(d) { return y(d.sentiment); })
            .on('mouseover', function(d) {
                $("#speechbox").text(d.text);
            });

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
    });

    d3.json("data/jfk_features.json", function(error, data) {
        x.domain(d3.extent(data, function(d) { return d.time; }));
        y.domain(d3.extent(data, function(d) { return d.frequency; }));
        svg.append("path")
            .attr("class", "line")
            .attr("class", "path_freq")
            .attr("d", valueline(data));

        svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("r", 0)
            .attr("cx", function(d) { return x(d.time); })
            .attr("cy", function(d) { return y(d.frequency); });
    });


        //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
});