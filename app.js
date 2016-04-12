$(document).ready(function() {

    var margin = {top: 30, right: 50, bottom: 30, left: 75},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(7);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(7);

    // Define the line
    var valueline = d3.svg.line()
        .x(function(d) { return x(d.startTime); })
        .y(function(d) { return y(d.sentiment); });
    var frevalueline = d3.svg.line()
        .x(function(d) { return x(d.time); })
        .y(function(d) { return y(d.frequency); });
    var ampvalueline = d3.svg.line()
        .x(function(d) { return x(d.time); })
        .y(function(d) { return y(d.amplitude); });

    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + 3*margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    $("#chart-row").css("height", height + margin.top + margin.bottom);

    // Add the visualization
    //  Inaugural Address
    /*
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

        // Add the x Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // label x
        svg.append("text")      // text label for the x axis
            .attr("x", (width)/2 )
            .attr("y", height + margin.bottom + 20)
            .style("text-anchor", "middle")
            .attr("class", "label")
            .text("Time (seconds)");

        // Add the y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);


        var addLabel = function(text, style, variant) {
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2) + variant)
                .attr("dy", "1em")
                .attr("class", style)
                .text(text);
        }

        addLabel("Sentiment", "sen-label", 80);
        addLabel("Amplitude", "amp-label", -20);
        addLabel("Frequency", "fre-label", -120);
        // label y
    });
*/

    //showFrequency();
    //showSentiment();
    showAmplitude();

    var addLabel = function(text, style, variant) {
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2) + variant)
            .attr("dy", "1em")
            .attr("class", style)
            .text(text);
    }

    function setUpAxis() {
       // Add the x Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // label x
        svg.append("text")      // text label for the x axis
            .attr("x", (width)/2 )
            .attr("y", height + margin.bottom + 20)
            .style("text-anchor", "middle")
            .attr("class", "label")
            .text("Time (seconds)");

        // Add the y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        addLabel("Sentiment", "sen-label", 80);
        addLabel("Amplitude", "amp-label", -20);
        addLabel("Frequency", "fre-label", -120);
    }

    function showSentiment() {
        d3.json("data/jfk_speech.json", function(error, data) {
            x.domain(d3.extent(data, function(d) { return d.startTime; }));
            y.domain(d3.extent(data, function(d) { return d.sentiment; }));
            svg.append("path")
                .attr("class", "line")
                .attr("class", "path_sen")
                .attr("d", valueline(data));

            svg.selectAll("dot")
                .data(data)
                .enter().append("circle")
                .attr("r", 3.5)
                .attr("cx", function(d) { return x(d.startTime); })
                .attr("cy", function(d) { return y(d.sentiment); })
                .on('mouseover', function(d) {
                    $("#speechbox").text(d.text);
                });

            setUpAxis();
        });   
    }

    function showFrequency() {
        d3.json("data/jfk_features.json", function(error, data) {
            x.domain(d3.extent(data, function(d) { return d.time; }));
            y.domain(d3.extent(data, function(d) { return d.frequency; }));
            svg.append("path")
                .attr("class", "line")
                .attr("class", "path_fre")
                .attr("d", frevalueline(data));

            svg.selectAll("dot")
                .data(data)
                .enter().append("circle")
                .attr("r", 0)
                .attr("cx", function(d) { return x(d.time); })
                .attr("cy", function(d) { return y(d.frequency); 
                });

            setUpAxis();
        });
    }

    function showAmplitude() {
        d3.json("data/jfk_features.json", function(error, data) {
            // http://stackoverflow.com/questions/2445756/how-can-i-calculate-audio-db-level
            // https://www.cablechick.com.au/blog/why-does-my-amplifier-use-negative-db-for-volume/
            data.forEach(function(d) {
                d.amplitude = +d.amplitude;

                var val = d.amplitude / 32768.0;
                var dB = 20 * Math.log(val);
                console.log(Math.log(val))
                d.amplitude = dB;
            });
            range = d3.extent(data, function(d) { return d.amplitude; });
            range[1] += 00100;
            x.domain(d3.extent(data, function(d) { return d.time; }));
            y.domain(range);
            svg.append("path")
                .attr("class", "line")
                .attr("class", "path_amp")
                .attr("d", ampvalueline(data));

            svg.selectAll("dot")
                .data(data)
                .enter().append("circle")
                .attr("r", 0)
                .attr("cx", function(d) { return x(d.time); })
                .attr("cy", function(d) { return y(d.amplitude); 
                });

            setUpAxis();
        });
    }

    //showAmplitude();
        //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
});