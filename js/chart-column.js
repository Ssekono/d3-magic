$(document).ready(function() {

	drawChart();
	$(window).resize(function(){
		drawChart();
		});
	
	/**
	 * Script uses d3 library to draw chart
	 * 
	 * Multiplying factor still needs to be computed to allow propotional scaling of graph
	 * 
	 */
	function drawChart() {

		//creates tooltip markup
		toolTip();

		var dataset = [];
		 //Initialize empty array
		for (var i = 0; i < 25; i++) {
		 //Loop 25 times
		var newNumber = Math.random() * 30;
		 //New random number (0-30)
		dataset.push(newNumber);
		 //Add new number to array
		}
		
		//Size of SVG container
		var h = $(".d3-wrapper").height();
		var w = $(".d3-wrapper").width();
		
		var xScale = d3.scale.ordinal()
						.domain(d3.range(dataset.length))
						.rangeRoundBands([0, w], 0.05);

		var yScale = d3.scale.linear()
						.domain([0, d3.max(dataset)])
						.range([0, h]);
		
		//Create SVG element
		var chart = d3.select(".d3-wrapper").append("svg")
						.attr("width", w)
						.attr("height", h);
		
		//Create bars
		var rect = chart.selectAll("rect")
							.data(dataset)
							.enter()
							.append("rect");
		
		//Bars' properties
		rect.attr("x", function(d, i) { return xScale(i); })
				.attr("y", function(d) { return h - yScale(d); })
				.attr("width", xScale.rangeBand())
				.attr("height", function(d) { return yScale(d); })
				.attr("fill", "teal");

		//Show tool tip on hover
		rect.on('mouseover', function(d) {
					//Get this bar's x/y values, then augment for the tooltip
					var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
					var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + h / 2;
					toolTipShow(d,xPosition,yPosition);
				})
			.on('mouseout', function(d) { toolTipHide(); });

		/**
		 * @param data
		 * Data that shows in tooltip
		 * 
		 * @param x_cord
		 * X coordinate value
		 * 
		 * @param y_cord
		 * Y coordinate value
		 * 
		 * Function hides tooltip on mouseout
		 */		
		function toolTipShow(data, x_cord, y_cord) {
			//Update the tooltip position and value
			d3.select("#tooltip")
				.style("left", x_cord + "px")
				.style("top", y_cord + "px")
				.select("#value")
				.text( Math.round( data * 10 ) / 10 );
			
			//Show the tooltip
			d3.select("#tooltip").classed("hidden", false);
			};

		/**
		 * @param none
		 * 
		 * Function hides tooltip on mouseout
		 */		
		function toolTipHide() {
			//Hide the tooltip
			d3.select("#tooltip").classed("hidden", true);
			};
		
		/**
		 * @param none
		 * 
		 * Function inserts tooltip markup in the DOM
		 */	
		function toolTip() {
				$("body").append( '<div id="tooltip" class="hidden">'
					            + '<p><strong>Important Label Heading</strong></p>'
					            + '<p><span id="value">100</span>%</p>'
					            + '</div>');
			};
	}
});