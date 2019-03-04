let dataset;
let w = 900;
let h = 500;
let svg;
let svgGroup;
let cScale;

let lWidth = 400;
let lHeight = 30;
let legendLowText, legendHighText;
let legend, legendRect;
let cStop1, cStop2, cStop3, cStop4, cStop5, cStop6;

let co2Button = document.querySelector("#co2");
let ghgsButton = document.querySelector("#ghgs");
let hfcsButton = document.querySelector("#hfcs");
let ch4Button = document.querySelector("#ch4");
let n2oButton = document.querySelector("#n2o");
let sf6Button = document.querySelector("#sf6");

let yearSlider = document.querySelector("#yearSlider");
let yearSpan = document.querySelector("#year");

// Countries loaded in from geojson
let countries;
let key = d => d.properties.name;
let currentYear = 1990;
let currentEmissionType = "co2";
let emissions = {};
let minEmission, maxEmission;

// Row conversion function
function rowConverter(d) {
  return d;
}

function initGraph() {
  // create svg
  svg = d3
    .select("#mapContainer")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svgGroup = svg.append("g");

  let projection = d3.geoMercator();

  let path = d3.geoPath().projection(projection);

  // Import and parse emmissions csv
  d3.csv("greenhouse-edited2.csv", data => {
    dataset = data;

    // Iterate through emissions data items
    for (let i = 0; i < dataset.length; i++) {
      let country = dataset[i]["country_or_area"];
      let year = dataset[i].year;
      let emissionValue = parseFloat(dataset[i].value);
      let category = dataset[i].category;

      emissions[category] = emissions[category] || {};
      emissions[category][country] = emissions[category][country] || {};
      emissions[category][country][year] = emissionValue;
      emissions[category].allValues = emissions[category].allValues || [];
      emissions[category].allValues.push(emissionValue);
    }

    // Find minimum and maximum value of emissions for the current emissions type
    minEmission = 0;
    maxEmission =
      Math.round(
        Math.max(...emissions[currentEmissionType].allValues) / 100000
      ) *
        100000 +
      100000;

    cScale = d3
      .scaleLinear()
      .domain([
        minEmission,
        maxEmission * 0.2,
        maxEmission * 0.4,
        maxEmission * 0.6,
        maxEmission * 0.8,
        maxEmission
      ])
      .range([
        "#4d9221",
        "#a1d76a",
        "#e6f5d0",
        "#fde0ef",
        "#e9a3c9",
        "#c51b7d"
      ]);

    legend = svg
      .append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    // ['##8c510a','#d8b365','#f6e8c3','#c7eae5','#5ab4ac','#01665e']
    // ['#4d9221', '#a1d76a', '#e6f5d0', '#fde0ef', '#e9a3c9', '#c51b7d']

    cStop1 = legend
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#4d9221")
      .attr("stop-opacity", 1);

    cStop2 = legend
      .append("stop")
      .attr("offset", "20%")
      .attr("stop-color", "#a1d76a")
      .attr("stop-opacity", 1);

    cStop3 = legend
      .append("stop")
      .attr("offset", "40%")
      .attr("stop-color", "#e6f5d0")
      .attr("stop-opacity", 1);

    cStop4 = legend
      .append("stop")
      .attr("offset", "60%")
      .attr("stop-color", "#fde0ef")
      .attr("stop-opacity", 1);

    cStop5 = legend
      .append("stop")
      .attr("offset", "80%")
      .attr("stop-color", "#e9a3c9")
      .attr("stop-opacity", 1);

    cStop6 = legend
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#c51b7d")
      .attr("stop-opacity", 1);

    legendRect = svg
      .append("rect")
      .attr("width", lWidth)
      .attr("height", lHeight)
      .style("fill", "url(#gradient)")
      .style("stroke", "black")
      .attr(
        "transform",
        `translate( ${w / 2 - lWidth / 2}, ${h - lHeight - 10})`
      );

    legendLowText = svg
      .append("text")
      .attr("x", w / 2 - lWidth / 2 + 5)
      .attr("y", h - lHeight - 5)
      .attr("dominant-baseline", "hanging")
      .attr("fill", "black")
      .style("font-weight", "bold")
      .text(`${minEmission} kt`);

    legendHighText = svg
      .append("text")
      .attr("x", w / 2 + lWidth / 2 - 5)
      .attr("y", h - lHeight - 5)
      .attr("dominant-baseline", "hanging")
      .attr("text-anchor", "end")
      .attr("fill", "black")
      .style("font-weight", "bold")
      .text(`${maxEmission} kt`);

    d3.json("world-110m.geojson", function(err, geojson) {
      countries = geojson.features;

      svgGroup
        .append("g")
        .attr("id", "countries")
        .selectAll("path")
        .data(countries, key)
        .enter()
        .append("svg:path")
        .attr("d", d => path(d))
        .attr("id", d => d.properties.name)
        .style("fill", d => {
          let country = d.properties.name;
          // Check if emissions data exists for the emission type and country
          if (emissions[currentEmissionType][country]) {
            // Check if emissions data exists for the current year
            if (emissions[currentEmissionType][country][currentYear]) {
              // Set the country's fill color to match its emission level at the current year and emission type
              let emission =
                emissions[currentEmissionType][country][currentYear];
              return cScale(emission);
            }
          }
          // Set fill to black if no emissions data is available
          return "black";
        })
        .style("stroke", "black");
    });
  });
}

function updateYear() {
  currentYear = yearSlider.value;
  yearSpan.innerText = currentYear;

  updateGraph();
}

function updateEmissionType(num) {
  switch (num) {
    case 1:
      currentEmissionType = "co2";

      // Update min and max emission values for current emission type

      maxEmission =
        Math.round(
          Math.max(...emissions[currentEmissionType].allValues) / 100000
        ) *
          100000 +
        100000;

      // Update color scale
      cScale = d3
        .scaleLinear()
        .domain([
          minEmission,
          maxEmission * 0.2,
          maxEmission * 0.4,
          maxEmission * 0.6,
          maxEmission * 0.8,
          maxEmission
        ])
        .range([
          "#4d9221",
          "#a1d76a",
          "#e6f5d0",
          "#fde0ef",
          "#e9a3c9",
          "#c51b7d"
        ]);

      cStop1 = legend
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#4d9221")
        .attr("stop-opacity", 1);

      cStop2 = legend
        .append("stop")
        .attr("offset", "20%")
        .attr("stop-color", "#a1d76a")
        .attr("stop-opacity", 1);

      cStop3 = legend
        .append("stop")
        .attr("offset", "40%")
        .attr("stop-color", "#e6f5d0")
        .attr("stop-opacity", 1);

      cStop4 = legend
        .append("stop")
        .attr("offset", "60%")
        .attr("stop-color", "#fde0ef")
        .attr("stop-opacity", 1);

      cStop5 = legend
        .append("stop")
        .attr("offset", "80%")
        .attr("stop-color", "#e9a3c9")
        .attr("stop-opacity", 1);

      cStop6 = legend
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#c51b7d")
        .attr("stop-opacity", 1);

      legendHighText
        .transition()
        .duration(1500)
        .text(`${maxEmission} kt`);

      // Update graph colors
      updateGraph();
      break;
    case 2:
      currentEmissionType = "ghg";

      // Update min and max emission values for current emission type
      // console.dir(emissions);

      maxEmission =
        Math.round(
          Math.max(...emissions[currentEmissionType].allValues) / 100000
        ) *
          100000 +
        100000;

      // Update color scale
      cScale = d3
        .scaleLinear()
        .domain([
          minEmission,
          maxEmission * 0.2,
          maxEmission * 0.4,
          maxEmission * 0.6,
          maxEmission * 0.8,
          maxEmission
        ])
        .range([
          "#4d9221",
          "#a1d76a",
          "#e6f5d0",
          "#fde0ef",
          "#e9a3c9",
          "#c51b7d"
        ]);

      cStop1 = legend
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#4d9221")
        .attr("stop-opacity", 1);

      cStop2 = legend
        .append("stop")
        .attr("offset", "20%")
        .attr("stop-color", "#a1d76a")
        .attr("stop-opacity", 1);

      cStop3 = legend
        .append("stop")
        .attr("offset", "40%")
        .attr("stop-color", "#e6f5d0")
        .attr("stop-opacity", 1);

      cStop4 = legend
        .append("stop")
        .attr("offset", "60%")
        .attr("stop-color", "#fde0ef")
        .attr("stop-opacity", 1);

      cStop5 = legend
        .append("stop")
        .attr("offset", "80%")
        .attr("stop-color", "#e9a3c9")
        .attr("stop-opacity", 1);

      cStop6 = legend
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#c51b7d")
        .attr("stop-opacity", 1);

      legendHighText
        .transition()
        .duration(1500)
        .text(`${maxEmission} kt`);

      // Update graph colors
      updateGraph();
      break;
    case 3:
      currentEmissionType = "hfcs";

      // Update min and max emission values for current emission type

      maxEmission =
        Math.round(
          Math.max(...emissions[currentEmissionType].allValues) / 100000
        ) *
          100000 +
        100000;

      // Update color scale
      cScale = d3
        .scaleLinear()
        .domain([
          minEmission,
          maxEmission * 0.2,
          maxEmission * 0.4,
          maxEmission * 0.6,
          maxEmission * 0.8,
          maxEmission
        ])
        .range([
          "#4d9221",
          "#a1d76a",
          "#e6f5d0",
          "#fde0ef",
          "#e9a3c9",
          "#c51b7d"
        ]);

      cStop1 = legend
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#4d9221")
        .attr("stop-opacity", 1);

      cStop2 = legend
        .append("stop")
        .attr("offset", "20%")
        .attr("stop-color", "#a1d76a")
        .attr("stop-opacity", 1);

      cStop3 = legend
        .append("stop")
        .attr("offset", "40%")
        .attr("stop-color", "#e6f5d0")
        .attr("stop-opacity", 1);

      cStop4 = legend
        .append("stop")
        .attr("offset", "60%")
        .attr("stop-color", "#fde0ef")
        .attr("stop-opacity", 1);

      cStop5 = legend
        .append("stop")
        .attr("offset", "80%")
        .attr("stop-color", "#e9a3c9")
        .attr("stop-opacity", 1);

      cStop6 = legend
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#c51b7d")
        .attr("stop-opacity", 1);

      legendHighText
        .transition()
        .duration(1500)
        .text(`${maxEmission} kt`);

      // Update graph colors
      updateGraph();
      break;
    case 4:
      currentEmissionType = "ch4";

      // Update min and max emission values for current emission type

      maxEmission =
        Math.round(
          Math.max(...emissions[currentEmissionType].allValues) / 100000
        ) *
          100000 +
        100000;

      // Update color scale
      cScale = d3
        .scaleLinear()
        .domain([
          minEmission,
          maxEmission * 0.2,
          maxEmission * 0.4,
          maxEmission * 0.6,
          maxEmission * 0.8,
          maxEmission
        ])
        .range([
          "#4d9221",
          "#a1d76a",
          "#e6f5d0",
          "#fde0ef",
          "#e9a3c9",
          "#c51b7d"
        ]);

      cStop1 = legend
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#4d9221")
        .attr("stop-opacity", 1);

      cStop2 = legend
        .append("stop")
        .attr("offset", "20%")
        .attr("stop-color", "#a1d76a")
        .attr("stop-opacity", 1);

      cStop3 = legend
        .append("stop")
        .attr("offset", "40%")
        .attr("stop-color", "#e6f5d0")
        .attr("stop-opacity", 1);

      cStop4 = legend
        .append("stop")
        .attr("offset", "60%")
        .attr("stop-color", "#fde0ef")
        .attr("stop-opacity", 1);

      cStop5 = legend
        .append("stop")
        .attr("offset", "80%")
        .attr("stop-color", "#e9a3c9")
        .attr("stop-opacity", 1);

      cStop6 = legend
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#c51b7d")
        .attr("stop-opacity", 1);

      legendHighText
        .transition()
        .duration(1500)
        .text(`${maxEmission} kt`);

      // Update graph colors
      updateGraph();
      break;
    case 5:
      currentEmissionType = "n2o";

      // Update min and max emission values for current emission type

      maxEmission =
        Math.round(
          Math.max(...emissions[currentEmissionType].allValues) / 100000
        ) *
          100000 +
        100000;

      // Update color scale
      cScale = d3
        .scaleLinear()
        .domain([
          minEmission,
          maxEmission * 0.2,
          maxEmission * 0.4,
          maxEmission * 0.6,
          maxEmission * 0.8,
          maxEmission
        ])
        .range([
          "#4d9221",
          "#a1d76a",
          "#e6f5d0",
          "#fde0ef",
          "#e9a3c9",
          "#c51b7d"
        ]);

      cStop1 = legend
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#4d9221")
        .attr("stop-opacity", 1);

      cStop2 = legend
        .append("stop")
        .attr("offset", "20%")
        .attr("stop-color", "#a1d76a")
        .attr("stop-opacity", 1);

      cStop3 = legend
        .append("stop")
        .attr("offset", "40%")
        .attr("stop-color", "#e6f5d0")
        .attr("stop-opacity", 1);

      cStop4 = legend
        .append("stop")
        .attr("offset", "60%")
        .attr("stop-color", "#fde0ef")
        .attr("stop-opacity", 1);

      cStop5 = legend
        .append("stop")
        .attr("offset", "80%")
        .attr("stop-color", "#e9a3c9")
        .attr("stop-opacity", 1);

      cStop6 = legend
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#c51b7d")
        .attr("stop-opacity", 1);

      legendHighText
        .transition()
        .duration(1500)
        .text(`${maxEmission} kt`);

      // Update graph colors
      updateGraph();
      break;
    case 6:
      currentEmissionType = "sf6";

      // Update min and max emission values for current emission type
      maxEmission =
        Math.round(
          Math.max(...emissions[currentEmissionType].allValues) / 1000
        ) *
          1000 +
        1000;

      // Update color scale
      cScale = d3
        .scaleLinear()
        .domain([
          minEmission,
          maxEmission * 0.2,
          maxEmission * 0.4,
          maxEmission * 0.6,
          maxEmission * 0.8,
          maxEmission
        ])
        .range([
          "#4d9221",
          "#a1d76a",
          "#e6f5d0",
          "#fde0ef",
          "#e9a3c9",
          "#c51b7d"
        ]);

      cStop1 = legend
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#4d9221")
        .attr("stop-opacity", 1);

      cStop2 = legend
        .append("stop")
        .attr("offset", "20%")
        .attr("stop-color", "#a1d76a")
        .attr("stop-opacity", 1);

      cStop3 = legend
        .append("stop")
        .attr("offset", "40%")
        .attr("stop-color", "#e6f5d0")
        .attr("stop-opacity", 1);

      cStop4 = legend
        .append("stop")
        .attr("offset", "60%")
        .attr("stop-color", "#fde0ef")
        .attr("stop-opacity", 1);

      cStop5 = legend
        .append("stop")
        .attr("offset", "80%")
        .attr("stop-color", "#e9a3c9")
        .attr("stop-opacity", 1);

      cStop6 = legend
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#c51b7d")
        .attr("stop-opacity", 1);

      legendHighText
        .transition()
        .duration(1500)
        .text(`${maxEmission} kt`);

      // Update graph colors
      updateGraph();
      break;
    default:
      break;
  }
}

function updateGraph() {
  svgGroup
    .selectAll("path")
    .data(countries, key)
    .transition()
    .duration(300)
    .style("fill", d => {
      let country = d.properties.name;
      // Check if emissions data exists for the emission type and country
      if (emissions[currentEmissionType][country]) {
        // Check if emissions data exists for the current year
        if (emissions[currentEmissionType][country][currentYear]) {
          // Set the country's fill color to match its emission level at the current year and emission type
          let emission = emissions[currentEmissionType][country][currentYear];
          return cScale(emission);
        }
      }
      // Set fill to black if no emissions data is available
      return "black";
    })
    .style("stroke", "black");
}

window.onload = function() {
  initGraph();
  co2Button.addEventListener("click", () => updateEmissionType(1));
  ghgsButton.addEventListener("click", () => updateEmissionType(2));
  hfcsButton.addEventListener("click", () => updateEmissionType(3));
  ch4Button.addEventListener("click", () => updateEmissionType(4));
  n2oButton.addEventListener("click", () => updateEmissionType(5));
  sf6Button.addEventListener("click", () => updateEmissionType(6));
  yearSlider.addEventListener("change", updateYear);
};
