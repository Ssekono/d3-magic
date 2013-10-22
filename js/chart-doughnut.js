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

		//Size of SVG container
		var h = $(".d3-wrapper").height();
		var w = $(".d3-wrapper").width();
		var diameter = Math.min(h, w);
	
		var dataset = [];
		 //Initialize empty array
		for (var i = 0; i < 6; i++) {
		 //Loop 25 times
		var newNumber = Math.round(Math.random() * 30);
		 //New random number (0-30)
		dataset.push(newNumber);
		 //Add new number to array
		}

		var outerRadius = diameter / 2;
		var innerRadius = outerRadius * 0.6;
		var arc = d3.svg.arc()
						.innerRadius(innerRadius)
						.outerRadius(outerRadius);
		
		var pie = d3.layout.pie();
		
		//Easy colors accessible via a 10-step ordinal scale
		var color = d3.scale.category10();

		//Create SVG element
		var chart = d3.select(".d3-wrapper")
					.append("svg")
					.attr("width", diameter)
					.attr("height", diameter);
		
		//Set up groups
		var arcs = chart.selectAll("g.arc")
					  .data(pie(dataset))
					  .enter()
					  .append("g")
					  .attr("class", "arc")
					  .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
		
		//Draw arc paths
		arcs.append("path")
		    .attr("fill", function(d, i) { return color(i); })
		    .attr("d", arc);
		
		//Effect on mouse over
		arcs.on("mouseover", function(d){ 
				d3.select(this).style('opacity', '0.8');
				//Calculate positioning of 
				var cord = arc.centroid(d);
				var x_cord = ( diameter / 2 ) + cord[0];
				var y_cord = ( diameter / 2 ) + cord[1];
				
				toolTipShow(d.value, x_cord, y_cord);
			})
	    	.on("mouseout", function(d){ 
	    		d3.select(this).style('opacity', '1.0');
	    		toolTipHide();
	    	});
		
		//Labels
		arcs.append("text")
		    .attr("transform", function(d) {
		    	return "translate(" + arc.centroid(d) + ")";
		    })
		    .attr("text-anchor", "middle")
		    .text(function(d) {
		    	return d.value;
		    });
					


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
				.text( Math.round(data * 10) / 10 );
			
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
					            + '<p>Value: <span id="value">100</span></p>'
					            + '</div>');
			};
	}
});
