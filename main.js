// Waiting until document has loaded
window.onload = () => {

d3.csv("cars.csv", d3.autoType).then(data => {
    const cleanData = data.filter(d =>
    d["City Miles Per Gallon"] > 0 && d["City Miles Per Gallon"] < 100 &&
    d["Retail Price"] > 0 && d["Retail Price"] < 10000000 &&
    d["Horse Power"] > 0 && d["Horse Power"] < 1500
    );

    console.log(data.length, cleanData.length);
});

};
