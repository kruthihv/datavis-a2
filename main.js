// Waiting until document has loaded
window.onload = () => {

d3.csv("cars.csv", d3.autoType).then(data => {
    const cleanData = data.filter(d =>
    d["Retail Price"] > 0 && d["Retail Price"] < 1000000 &&
    d["Horsepower(HP)"] > 0 && d["Horsepower(HP)"] < 1500 &&
    d["City Miles Per Gallon"] > 0 && d["City Miles Per Gallon"] < 100
    );
    console.log(data.length, cleanData.length);
    cleanData.sort((a, b) => b["Horsepower(HP)"] - a["Horsepower(HP)"]);

    // Chart size, with margins for the axes
    const margin = { top: 20, right: 150, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;



    // Create the SVG and a group shifted inside the margins
    const svg = d3.select("#scatterplot")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // The six attributes shown in the details panel
    const detailAttrs = ["Type", "Retail Price", "City Miles Per Gallon",
                     "Horsepower(HP)", "Engine Size (l)", "Highway Miles Per Gallon"];

    function resetSelection() {
    svg.selectAll(".dot")
        .attr("stroke", "white").attr("stroke-width", 1)
        .attr("fill-opacity", 0.8);
    d3.select("#details").html("Click a dot to see details");
    }

    // x: Retail Price → horizontal pixels
    const x = d3.scaleLinear()
    .domain(d3.extent(cleanData, d => d["Retail Price"]))  // data range
    .range([0, width])                                     // pixel range
    .nice();

    // y: City MPG → vertical pixels
    const y = d3.scaleLinear()
    .domain(d3.extent(cleanData, d => d["City Miles Per Gallon"]))
    .range([height, 0])
    .nice();

    // Invisible background: clicking empty space clears the selection
    svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "transparent")
    .on("click", resetSelection);

    // Draw the axes
    svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

    svg.append("g")
    .call(d3.axisLeft(y)); 

    const color = d3.scaleOrdinal()
    .domain(["Sedan", "SUV", "Sports Car", "Wagon", "Minivan"])
    .range(["#0072B2", "#E69F00", "#CC79A7", "#009E73", "#56B4E9"]);

     // z: Horsepower → circle radius (sqrt, so area ∝ HP)
    const z = d3.scaleSqrt()
    .domain([0,d3.max(cleanData, d => d["Horsepower(HP)"])])
    .range([0, 8])

    svg.selectAll(".dot")
    .data(cleanData)
    .enter()
    .append("circle")
        .attr("class", "dot")    
        .attr("cx", d => x(d["Retail Price"]))
        .attr("cy", d => y(d["City Miles Per Gallon"]))
        .attr("r", d => z(d["Horsepower(HP)"]))
        .attr("fill", d => color(d.Type))
        .attr("stroke", "white").attr("stroke-width", 1)
        .attr("fill-opacity", 0.8)
        .style("cursor", "pointer")
        .on("click", function (d) {
        // 1. Reset all dots, then highlight the clicked one
            svg.selectAll(".dot")
                .attr("stroke", "white").attr("stroke-width", 1)
                .attr("fill-opacity", 0.3);              // fade the others
            d3.select(this)
                .attr("stroke", "black").attr("stroke-width", 2)
                .attr("fill-opacity", 1)
                .raise();                                 // move it to the top layer

            // 2. Fill the details panel
            d3.select("#details").html(
                `<h3>${d.Name}</h3>
                <table>
                ${detailAttrs.map(a => `<tr><td>${a}</td><td>${d[a]}</td></tr>`).join("")}
                </table>`
        ); });

    // x-axis label
    svg.append("text")
    .attr("x", width / 2)            // horizontally centred under the plot
    .attr("y", height + 40)          // below the axis numbers
    .attr("text-anchor", "middle")   // centre the text on that point
    .text("Retail Price (USD)");

    // y-axis label
    svg.append("text")
    .attr("x", -height/2)            
    .attr("y", -35)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)") // below the axis numbers
    .text("City Miles per Gallon");

    // Color legend: one row per car type

    const legend = svg.append("g")
    .attr("transform", `translate(${width + 20}, 40)`);  // just right of the plot

    legend.append("text")
    .attr('x', 0)
    .attr('y', -20)
    .text("Car Type")

    legend.selectAll("circle")
    .data(color.domain())
    .enter()
    .append("circle")
        .attr("cx", 0)
        .attr("cy", (d, i) => i * 20)   // i = 0, 1, 2… so each row is 20 px lower
        .attr("r", 6)
        .attr("dominant-baseline", "middle")
        .attr("fill", d => color(d))

    legend.selectAll(".legend-label")
    .data(color.domain())
    .enter()
    .append("text")
        .attr("class", "legend-label")   
        .attr("x", 20)
        .attr("y", (d, i) => i * 20)   
        .attr("dominant-baseline", "middle")
        .text(d => d)
        .attr("font-size", 12);

    // Size legend: example horsepower values, drawn with the same z scale as the dots
    const sizeLegend = svg.append("g")
    .attr("transform", `translate(${width + 20}, 190)`);   // below the color legend

    sizeLegend.append("text")
    .attr("y", -20)
    .text("Horsepower");

    const hpExamples = [100, 250, 450];

    sizeLegend.selectAll(".size-dot")
    .data(hpExamples)
    .enter()
    .append("circle")
        .attr("class", "size-dot")
        .attr("cx", 0)
        .attr("cy", (d, i) => i * 25)
        .attr("r", d => z(d))          // same scale as the chart → sizes match exactly
        .attr("fill", "#999")
        .attr("stroke", "white");

    sizeLegend.selectAll(".size-label")
    .data(hpExamples)
    .enter()
    .append("text")
        .attr("class", "size-label")
        .attr("x", 20)
        .attr("y", (d, i) => i * 25)
        .attr("dominant-baseline", "middle")
        .attr("font-size", 12)
        .text(d => d + " hp");
})

};
