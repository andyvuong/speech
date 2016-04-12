$(document).ready(function() {


    var speakers = {
        jfk: 'John F. Kennedy',
        reagan: 'Ronald Reagan',
        fdr: 'Franklin D. Roosevelt'
    }

    var speeches = [
        'jfk_speech.json',
        'jfkberliner_speech.json',
        'fdrpearlharbor_speech.json',
        'reganchallenger_speech.json'
    ];

    var features = [
        'jfk_features.json',
        '',
        '',
        ''
    ];

    var currentSpeechFile = speeches[0];
    var currentFeatureFile = features[0];

    /**
     * Set up the chart layout
     */
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

    function addLayer() {
        svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + 3*margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    }

    // reloads
    function init(file) {
        d3.selectAll("#chart > *").remove();
        addLayer();
        showSentiment(file);
    }

    /**
     * Click handlers
     */

    $('#click-sen').on('click', function() {
        d3.selectAll("#chart > *").remove();
        addLayer();
        showSentiment(currentSpeechFile);
    });

    $('#click-fre').on('click', function() {
        console.log(currentFeatureFile);
        d3.selectAll("#chart > *").remove();
        addLayer();
        showFrequency(currentFeatureFile);
    });

    $('#click-amp').on('click', function() {
        d3.selectAll("#chart > *").remove();
        addLayer();
        showAmplitude(currentFeatureFile);
    });

    $('#speaker-list li > a').on('click', function(){
        console.log(this.text);
        var choice = this.text;
        if (choice === 'JFK 1') {
            currentSpeechFile = speeches[0];
            currentFeatureFile = features[0];
            init(currentSpeechFile);
        }
        else if (choice === 'JFK 2') {
            currentSpeechFile = speeches[1];
            currentFeatureFile = features[1];
            console.log(currentSpeechFile);
            init(currentSpeechFile);
        }
        else if (choice === 'FDR') {
            currentSpeechFile = speeches[2];
            currentFeatureFile = features[2];
            init(currentSpeechFile);
        }
        else if (choice === 'Reagan') {
            currentSpeechFile = speeches[3];
            currentFeatureFile = features[3];
            init(currentSpeechFile);
        }
        else {
            console.log("Error occured");
        }
    });

    // start
    init(currentSpeechFile);

    function setSpeaker(name) {
         $("#info-by").text(name);
    }

    function setTitle(name) {
         $("#info-title").text(name);
    }

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

    function showSentiment(file) {
        d3.json("data/" + file, function(error, data) {
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

    function showFrequency(file) {
        d3.json("data/" + file, function(error, data) {
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

    function showAmplitude(file) {
        d3.json("data/" + file, function(error, data) {
            // http://stackoverflow.com/questions/2445756/how-can-i-calculate-audio-db-level
            // https://www.cablechick.com.au/blog/why-does-my-amplifier-use-negative-db-for-volume/
            data.forEach(function(d) {
                d.amplitude = +d.amplitude;

                var val = d.amplitude / 32768.0;
                var dB = 20 * Math.log(val);
                //console.log(Math.log(val))
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

});