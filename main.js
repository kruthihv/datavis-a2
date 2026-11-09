// Waiting until document has loaded
window.onload = () => {

d3.csv("cars.csv", d3.autoType).then(data => {
    console.log(data.filter(d => d["City Miles Per Gallon"] > 100));
    console.log(data.filter(d => d["Highway Miles Per Gallon"] < 0));
});

};
