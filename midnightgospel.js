const url = 'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=cumulative';
d3.csv(url).then(data => {
    console.log(data);
    data.sort(function () { return 0.5 - Math.random(); });
    var slicedData = data.slice(0, 48);
    console.log(slicedData);

    // Bind data to divs, thus generating divs
    var divs = d3.select('.gridcontainer').selectAll('div')
        .data(slicedData)
        .enter()
        .append('div')
        .classed("grid", true);
    // Add an svg element to each div
    var svgs = divs.append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
    // Add text to each svg
    var text = svgs.append("text")
        .attr("x", 10)
        .attr("y", 20)
        .text(function (d) { return d.kepler_name; });
    // Add a circle element to each svg
    var circles = svgs.append('circle')
        .classed("planet", true)
        // Set the radius of the circle to be fraction of the width of the svg
        .attr('r', function () { return d3.select(this.parentNode).node().getBoundingClientRect().width / 3; })
        // Center the circle in the svg
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('stroke', '#81F7F3')
        //.attr('stroke-width', 10)
        //.attr('stroke-width', function (d) { return (Math.log(d.koi_teq) - 3) ** 1.8; })
        .attr('stroke-width', function (d) { return d.koi_teq / 80; })
        .attr('stroke-opacity', 0.5)
        .attr('fill', '#1B0A2A');
    //.attr('fill', 'url(#stripes)');

    // curved edge continents
    /**/
    var continents = svgs.append('path')
        .attr('d', function (d) {
            var svgWidth = d3.select(this.parentNode).attr('width');
            var svgHeight = d3.select(this.parentNode).attr('height');
            var radius = d3.select(this.parentNode).select('circle').attr('r');
            var numPoints = d.koi_period;
            var points = [];

            var cx = parseInt(svgWidth) / 3; // Center x-coordinate
            var cy = parseInt(svgHeight) / 3; // Center y-coordinate

            for (var i = 0; i < numPoints; i++) {
                var angle = Math.random() * 2 * Math.PI;
                var x = radius * Math.cos(angle) + parseInt(radius) + cx;
                var y = radius * Math.sin(angle) + parseInt(radius) + cy;
                points.push([x, y]);
            }
            // Create a curved line generator
            var lineGenerator = d3.line().curve(d3.curveCatmullRomClosed);
            // Generate the curved line path
            var curvedLine = lineGenerator(points);
            return curvedLine;
        })
        //.attr('fill', 'lightblue')
        .attr('fill', function (d) {
            var colorScale = d3.scaleLinear()
                .domain([d3.min(slicedData, function (d) { return d.koi_teq; }), d3.max(slicedData, function (d) { return d.koi_teq; })])
                .range(['#01DFD7', '#E0F8F7']);
            return colorScale(d.koi_teq);
        })
        .attr('fill-opacity', 0.7);
    // straight edge continents
    /* 
    var continents = svgs.append('polygon')
        .attr('points', function (d) {
            //return console.log(d.koi_period);
            var svgWidth = d3.select(this.parentNode).attr('width');
            var svgHeight = d3.select(this.parentNode).attr('height');
            var radius = d3.select(this.parentNode).select('circle').attr('r');
            var numPoints = d.koi_period; //Math.floor(Math.random() * 6) + 3; // Random number of points between 3 and 8
            var points = [];

            var cx = parseInt(svgWidth) / 3; // Center x-coordinate
            var cy = parseInt(svgHeight) / 3; // Center y-coordinate

            for (var i = 0; i < numPoints; i++) {
                var angle = Math.random() * 2 * Math.PI;
                var x = radius * Math.cos(angle) + parseInt(radius) + cx;
                var y = radius * Math.sin(angle) + parseInt(radius) + cy;
                points.push(x + ',' + y);
            }
            return points.join(' ');
        })
        .attr('fill', 'lightblue') 
        .attr('fill-opacity', 0.5);
    */
    
    // Define the pattern
    /* 
    var pattern = svgs.append('defs')
        .append('pattern')
        .attr('id', 'stripes')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 10)
        .attr('height', 10)
    // Add a black rectangle to the pattern
    pattern.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', 'black');
    pattern.append('path')
        //.attr('d', 'M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2') // stripes
        //.attr("d", "M5,5 Q0,2.5 5,0 Q10,2.5 5,5 Q0,7.5 5,10 Q10,7.5 5,5") //swirl
        //.attr("d", "M0,5 C2.5,3 7.5,3 10,5 C12.5,7 17.5,7 20,5") //wave
        .attr("d", "M 0 2 L 2 2 A 3 3, 0, 0, 0, 8 2 L 10 2")
        .attr('stroke', 'lightblue')
        .attr("stroke-width", function (d) { return d.koi_period; });
    */

    var bigx1 = svgs.append("line")
        .attr("x1", '10%')
        .attr("y1", '15%')
        .attr("x2", '90%')
        .attr("y2", '85%')
        .attr("stroke", function (d) {
            return d.koi_disposition === 'FALSE POSITIVE' ? 'red' : 'none';
        })
        .attr("stroke-width", 20);
    var bigx2 = svgs.append("line")
        .attr("x1", '90%')
        .attr("y1", '15%')
        .attr("x2", '10%')
        .attr("y2", '85%')
        .attr("stroke", function (d) {
            return d.koi_disposition === 'FALSE POSITIVE' ? 'red' : 'none';
        })
        .attr("stroke-width", 20);
    var bigred = svgs.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', '100%')
        .attr('height', '100%')
        //.style('fill', 'url(#opacityGradient)');
        .style('fill', 'red')
        .style('fill-opacity', function (d) {
            return d.koi_disposition === 'FALSE POSITIVE' ? 0.5 : 0;
        });
})