//Main code taken from: Tia Gottlieb - https://morioh.com/p/86a515eb6629 
let height = 800;
let width = 1300;
let margin = ({top: 0, right: 40, bottom: 34, left: 40});


// Data structure describing chart scales
let Scales = {
    lin: "scaleLinear",
};

// Data structure describing volume of displayed data
let Count = {
    score: "Meta_score",
};

// Data structure describing legend fields value
let Legend = {
    score: "Score",
};

let chartState = {};

chartState.measure = Count.score;
chartState.scale = Scales.lin;
chartState.legend = Legend.score;

let colors = d3.scaleOrdinal()
    .domain(["Action", "Adventure", "Animation", "Biography", "Crime", "Drama", "Family", "Fantasy", "Film-Noir", "Horror", "Mystery", "Thriller", "Western"])
    .range(['#D81B60','#1976D2','#388E3C','#FBC02D','#455A64','#D81B69','#1976D9','#388E39','#FBC029','#E64A10','#455A69','#E64A17','#455A63']);

    d3.select("#actionColor").style("color", colors("Action"));
    d3.select("#adventureColor").style("color", colors("Adventure"));
    d3.select("#animationColor").style("color", colors("Animation"));
    d3.select("#biographyColor").style("color", colors("Biography"));
    d3.select("#crimeColor").style("color", colors("Crime"));
    d3.select("#dramaColor").style("color", colors("Drama"));
    d3.select("#familyColor").style("color", colors("Family"));
    d3.select("#fantasyColor").style("color", colors("Fantasy"));
    d3.select("#film-noirColor").style("color", colors("Film-Noir"));
    d3.select("#horrorColor").style("color", colors("Horror"));
    d3.select("#mysteryColor").style("color", colors("Mystery"));    
    d3.select("#thrillerColor").style("color", colors("Thriller"));
    d3.select("#westernColor").style("color", colors("Western"));     

let svg = d3.select("#svganchor")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

let xScale = d3.scaleLinear()
    .range([margin.left, width - margin.right]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")");

// Create line that connects circle and X axis
let xLine = svg.append("line")
    .attr("stroke", "rgb(96,125,139)")
    .attr("stroke-dasharray", "1,2");

// Create tooltip div and make it invisible
let tooltip = d3.select("#svganchor").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Load and process data
let contador=0;

d3.tsv('http://localhost:3000/imdb_top_1000_clean.tsv').then(function (data) {

   

    let dataSet = data;

    // Set chart domain max value to the highest score value in data set
    xScale.domain(d3.extent(data, function (d) {
        return +d.Meta_score;
    }));

    redraw();


    
    d3.selectAll(".slidecontainer").on("change", filter);
    d3.selectAll(".genres").on("change", genrefilter);

    function redraw() {

        xScale = d3.scaleLinear().range([ margin.left, width - margin.right ])
        

        xScale.domain(d3.extent(dataSet, function(d) {
            return +d[chartState.measure];
        }));


        let xAxis = d3.axisBottom(xScale)
                .ticks(10, ".1s")
                .tickSizeOuter(0);


        d3.transition(svg).select(".x.axis")
            .transition()
            .duration(1000)
            .call(xAxis);

        // Create simulation with specified dataset
        let simulation = d3.forceSimulation(dataSet)
            // Apply positioning force to push nodes towards desired position along X axis
            .force("x", d3.forceX(function(d) {
                return xScale(+d[chartState.measure]);  // This is the desired position
            }).strength(2))  // Increase velocity
            .force("y", d3.forceY((height / 2) - margin.bottom / 2))  // // Apply positioning force to push nodes towards center along Y axis
            .force("collide", d3.forceCollide(5)) // Apply collision force with radius of 9 - keeps nodes centers 9 pixels apart
            .stop();  // Stop simulation from starting automatically

        // Manually run simulation
        for (let i = 0; i < dataSet.length; ++i) {
            simulation.tick(10);
        }

        // Create movie circles
        let moviesCircles = svg.selectAll(".movies")
            .data(dataSet, function(d) { return d.Series_Title });

        moviesCircles.exit()
            .transition()
            .duration(1000)
            .attr("cx", 0)
            .attr("cy", (height / 2) - margin.bottom / 2)
            .remove();

        moviesCircles.enter()
            .append("circle")
            .attr("class", "movies")
            .attr("cx", 0)
            .attr("cy", (height / 2) - margin.bottom / 2)
            .attr("r", 4)
            .attr("fill", function(d){ return colors(d.Genre)})
            .merge(moviesCircles)
            .transition()
            .duration(2000)
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
 
        // Show tooltip when hovering over circle (data for respective movie)
        d3.selectAll(".movies").on("mousemove", function(d) {
            tooltip.html(`Movie: <strong>${d.Series_Title}</strong><br>
                          Score: 
                          <strong>${d3.format(",")(d[chartState.measure])}</strong><br>
                          Year: <strong>${d.Released_Year}</strong><br>
                          <img src='${d.Poster_Link}'>

                          `)
                .style('top', d3.event.pageY - 12 + 'px')
                .style('left', d3.event.pageX + 25 + 'px')
                .style("opacity", 0.9);

            xLine.attr("x1", d3.select(this).attr("cx"))
                .attr("y1", d3.select(this).attr("cy"))
                .attr("y2", (height - margin.bottom))
                .attr("x2",  d3.select(this).attr("cx"))
                .attr("opacity", 1);

        }).on("mouseout", function(_) {
            tooltip.style("opacity", 0);
            xLine.attr("opacity", 0);
        });

    }

    // Filter data based on which checkboxes are ticked
function genrefilter() {

    function getCheckedBoxes(checkboxName) {

        let checkboxes = d3.selectAll(checkboxName).nodes();
        let checkboxesChecked = [];
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                checkboxesChecked.push(checkboxes[i].defaultValue);
            }
        }
        return checkboxesChecked.length > 0 ? checkboxesChecked : null;
    }

    let checkedBoxes = getCheckedBoxes(".genres");

    let newData = [];

    if (checkedBoxes == null) {
        dataSet = newData;
        redraw();
        return;
    }

    for (let i = 0; i < checkedBoxes.length; i++){
        let newArray = data.filter(function(d) {
            return d.Genre === checkedBoxes[i];
        });
        Array.prototype.push.apply(newData, newArray);
    }

    dataSet = newData;
    redraw();
}

    // Filter data based on which checkboxes are ticked
    function filter() {
        
        let newData = [];
        let sliderValue = document.getElementById("myRange").value;
        let newArray = [];

        if(sliderValue == 2021)
        {
        dataSet = data; 
        document.getElementById("yearTag").innerText = "All years"; 
        redraw(); 
       
        }else
        {
        newArray = data.filter(function(d) {return d.Released_Year <= sliderValue; });
        Array.prototype.push.apply(newData, newArray);
        console.log(sliderValue);
        dataSet = newData;
        document.getElementById("yearTag").innerText = sliderValue; 
        redraw(); 
        }
    }

}).catch(function (error) {
    if (error) throw error;
});




