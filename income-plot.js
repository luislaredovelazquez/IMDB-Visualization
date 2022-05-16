function IncomePlot() {
	var yearValues = [];
	
	for(var i=1920; i <= 2020; i+=10)
		yearValues.push(i);
	
	this.svg = d3.select("#income-plot")
				.append("svg")
					.attr("width", 380)
					.attr("height", 380)
				.append("g")
					.attr("transform", "translate(80, 50)");
	
	// Create x axis : decades
	this.xScale = d3.scaleBand()
		.range ([0, 280])
		.domain(yearValues)
		.padding(0.4);
		
	this.svg.append("g")
		.attr("transform", "translate(0,280)")
		.call(d3.axisBottom(this.xScale))
		.selectAll("text")
		.attr("transform", "translate(-10,0)rotate(-45)")
		.style("text-anchor", "end");

	// Create y axis : gross income	
	this.yScale = d3.scaleLinear()
		.range ([280, 0])
		.domain([0, 470000000]); //Max gross income in excel is 936,662,225
		
	this.svg.append("g")
	  .call(d3.axisLeft(this.yScale));
	  
}

IncomePlot.prototype.update = function(directorName, incomeMovies, incomes) {	
    // console.log(directorName)
    console.log(incomeMovies)
    console.log(incomes)
    var maxIncome = Math.max(incomes)
    console.log(maxIncome)

    var self = this;
    let bars = this.svg.selectAll(".bars")
					.data(incomeMovies, function(d){ return [0]});

    // Update the bar chart to reflect the new data
	bars
    .enter()
    .append("rect")
      .attr('class', 'bars')
      .attr("x", function(d) { return self.xScale(d[0]); })
      .attr("y", function(d) { return self.yScale(d[1]); })
      .attr("width", self.xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", "#FBC02D")
      .on('mouseover', function(d) {
          var tooltipDiv = d3.select("#directorTooltip"); 
          tooltipDiv.transition()
              .duration(500);
          tooltipDiv.html("<strong>Title : </strong> " + d[2] + "<br /><strong>Gross income : </strong>$" + d[3]+"<br /><strong>Decade : </strong>"+ d[0])
              .style('top', d3.event.pageY - 12 + 'px')
              .style('left', d3.event.pageX + 25 + 'px')
              .style("opacity", 0.9);
      })
      .on('mouseout', function(d) {
          var tooltipDiv = d3.select("#directorTooltip"); 
          tooltipDiv.transition()        
              .duration(500)      
              .style("opacity", 0);
      })
      .merge(bars)
      .transition()
      .delay(100)
      .duration(1000)
      .attr("y", function(d) { return self.yScale(d[1]); })
      .attr("height", function(d) { return 280 - self.yScale(d[1]); });

    bars.exit()
        .transition()
        .duration(1000)
        .attr("height", 0)
        .remove();

}