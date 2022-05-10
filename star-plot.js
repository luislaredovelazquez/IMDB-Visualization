function StarsPlot(parentId, stars) {
	this._parent = parentId;
	
	this.svg = d3.select(this._parent)
				.append("svg")
					.attr("width", 560)
					.attr("height", 380)
					.attr("viewBox", [0, 0, 560, 380]);

	// Create a dim text for every star name in the list
	 this.svg
		.selectAll(".star")
		.data(stars,  function(d) { return d; })
		.join("text")
		.text(d => d)
		.attr("x", () => ((440 * Math.random()) | 0) + 20)
		.attr("y", () => ((340 * Math.random()) | 0) + 20)
		.style("opacity", "0.1")
		.attr("class", "star")
		.style("font-size", "5px");
	
	// Create header for graph 	
	this.svg.append("text")
		.attr("x", 0)
		.attr("y", 17)
		.attr("text-anchor", "start")
		.style("font-size", "16px")
		.text("Stars featured in film");
}

StarsPlot.prototype.update = function(data) {	
	var self = this;
	
	// Reset all texts back to the dimmed text
	this.svg
		.selectAll(".star")
		.style("opacity", "0.1")
		.style("font-size", "5px");
	
	
	// Take in the star names from selected movie and increase their opacity and font size
	let texts = this.svg.selectAll(".star")
					.data(data, function(d) { return d; });
					
	texts.enter()
		.text(d => d)
		.attr("x", () => ((520 * Math.random()) | 0) + 20)
		.attr("y", () => ((340 * Math.random()) | 0) + 20)
		.merge(texts)
		.transition()
		.delay(100)
		.style("opacity", "1")
		.style("font-size", "15px");
}