$(document).ready(function() {

	drawChart();
	$(window).resize(function(){
		drawChart();
		});
	
	/**
	 * Script uses d3 library to draw chart
	 * 
	 * Multiplying factor still needs to be computed to allow proportional scaling of graph
	 * 
	 */
	function drawChart() {

		//creates tooltip markup
		toolTip();

		//Dynamic, random dataset
		var dataset = [];											//Initialize empty array
		var numDataPoints = 50;										//Number of dummy data points to create
		var maxRange = Math.random() * 1000;						//Max range of new values
		for (var i = 0; i < numDataPoints; i++) {					//Loop numDataPoints times
			var newNumber1 = Math.floor(Math.random() * maxRange);	//New random integer
			var newNumber2 = Math.floor(Math.random() * maxRange);	//New random integer
			dataset.push([newNumber1, newNumber2]);					//Add new number to array
		}

			
		//Size of SVG container
		var h = $(".d3-wrapper").height();
		var w = $(".d3-wrapper").width();
		
		//padding to prevents items on the edge from being clipped off
		var padding = 40;

		
		//Creating a scale for values
		//add padding to min value and minus padding from max value
		var xScale = d3.scale.linear()
						.domain([0, d3.max(dataset, function(d) { return d[0]; })])
						.range([padding, w-padding]);

		var yScale = d3.scale.linear()
						.domain([0, d3.max(dataset, function(d) { return d[1]; })])
						.range([h-padding, padding]);
	
		//Setting charts Axis and Passing xScale values to the x axis
		var xAxis = d3.svg.axis()
						.scale(xScale)
						.orient("bottom")
						.ticks(5); //Set rough # of ticks

		//Define Y axis
		var yAxis = d3.svg.axis()
						.scale(yScale)
						.orient("left")
						.ticks(5);
		
		//Setting up drawing area
		var chart = d3.select(".d3-wrapper").append("svg")
					.attr("width", w )
					.attr("height", h )
					.attr("class", "chart");
		
		//Define clipping path
		chart.append("clipPath")
				.attr("id", "chart-area")
				.append("rect")
				.attr("x", padding)
				.attr("y", padding)
				.attr("width", w - padding * 2)
				.attr("height", h - padding * 2);
	
		var g = chart.append("g")
					 //Create new g
					.attr("id", "circles")
					 //Assign ID of 'circles'
					.attr("clip-path", "url(#chart-area)");
					 //Add reference to clipPath
		
		var circle = g.selectAll("circle")
					.data(dataset)
					.enter()
					.append("circle");
		
		//Circle properties---create circles
		circle.attr("r", 5)//using y value to calculate radius scaled size
					.attr("cx", (function(d) { return xScale(d[0]) ; }))
					.attr("cy", (function(d) { return yScale(d[1]) ; }))
					.attr("fill", "orange")
					.attr("stroke", "yellow")
					.attr("stroke-width", "1px")
					.attr("class", "dot");
		
		//Show tool tip on hover
		circle.on('mouseover', function(d) {
					//Get this bar's x/y values, then augment for the tooltip
					var xPosition = parseFloat(d3.select(this).attr("cx"));
					var yPosition = parseFloat(d3.select(this).attr("cy"));
					toolTipShow(d,xPosition,yPosition);
				})
			.on('mouseout', function(d) { toolTipHide(); });
		
		
		
		
		
		//Draw axis
		chart.append("g")
				.attr("class", " x axis") //Assign "axis" class
				.attr("transform", "translate(0," + (h - padding) + ")")
				.call(xAxis);
		
		//Create Y axis
		chart.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(" + padding + ",0)")
				.call(yAxis);
		
		

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
				.text( "(" + Math.round( data[0] * 10 ) / 10 +", "+Math.round( data[1] * 10 ) / 10  + ")");
			
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
				$(".d3-wrapper").append( '<div id="tooltip" class="hidden">'
					            + '<p><strong>Important Label Heading</strong></p>'
					            + '<p><span id="value">100</span></p>'
					            + '</div>');
			};
	}
	
	
});
