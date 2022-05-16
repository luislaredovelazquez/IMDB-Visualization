function DirectorBarPlot(parentId) {
	this._parent = parentId;
	var yearValues = [];
	
	for(var i=1920; i <= 2020; i+=10)
		yearValues.push(i);
	
	this.svg = d3.select(this._parent)
				.append("svg")
					.attr("width", 380)
					.attr("height", 380)
				.append("g")
					.attr("transform", "translate(50, 50)");
	
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

	// Create y axis : number of movies	
	this.yScale = d3.scaleLinear()
		.range ([280, 0])
		.domain([0, 10]);
		
	this.svg.append("g")
	  .call(d3.axisLeft(this.yScale));
	  
	 // Add header
	this.svg.append("text")
		.attr("class", "director-name")
		.attr("transform", "translate(-" + 20 + " ,-" + 33 + ")")
		.attr("text-anchor", "start")
		.style("font-size", "16px")
		.text("Other movies by ");
	  
	// Add tooltip for when mouse hovers over bar
	this.tooplTipDiv = d3.select("body").append("div")
					.attr("class", "tooltip")
					.attr("id", "directorTooltip")
					.style("opacity", 0);
}

DirectorBarPlot.prototype.update = function(directorName, data) {	
	var self = this;
	
	let bars = this.svg.selectAll(".bars")
					.data(data, function(d){ return [0]});
	
	// Update header to include director name
	let title = this.svg.selectAll(".director-name");
	title.text("Other movies by " + directorName);
					
	// Update the bar chart to reflect the new data
	bars
	  .enter()
	  .append("rect")
		.attr('class', 'bars')
		.attr("x", function(d) { return self.xScale(d[0]); })
		.attr("y", function(d) { return self.yScale(0); })
		.attr("width", self.xScale.bandwidth())
		.attr("height", 0)
		.attr("fill", "#1976D2")
		.on('mouseover', function(d) {
			// console.log(d[2]);
			var tooltipDiv = d3.select("#directorTooltip"); 
			tooltipDiv.transition()
				.duration(500);
			tooltipDiv.html("<strong>Decade : </strong> " + d[0] + "<br />" + d[2].join("<br />"))
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
};