// Waiting until document has loaded
window.onload = () => {

d3.csv("cars.csv", d3.autoType).then(data => {
    const cleanData = data.filter(d =>
    d["Retail Price"] > 0 && d["Retail Price"] < 1000000 &&
    d["Horsepower(HP)"] > 0 && d["Horsepower(HP)"] < 1500 &&
    d["City Miles Per Gallon"] > 0 && d["City Miles Per Gallon"] < 100
    );
    console.log(data.length, cleanData.length);

    // Chart size, with margins for the axes
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create the SVG and a group shifted inside the margins
    const svg = d3.select("#scatterplot")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

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

    // Draw the axes
    svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

    svg.append("g")
    .call(d3.axisLeft(y)); 

    svg.selectAll("circle")
    .data(cleanData)
    .enter()
    .append("circle")
        .attr("cx", d => x(d["Retail Price"]))
        .attr("cy", d => y(d["City Miles Per Gallon"]))
        .attr("r", 4)
        .attr("fill", "steelblue")
        .attr("opacity", 0.7);

})

};
