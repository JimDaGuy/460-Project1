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
let colorStart, colorEnd;

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
      .domain([minEmission, maxEmission])
      .range(["white", "red"]);

    legend = svg
      .append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    colorStart = legend
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "white")
      .attr("stop-opacity", 1);

    colorEnd = legend
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "red")
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
        .domain([minEmission, maxEmission])
        .range(["white", "red"]);

      colorEnd
        .transition()
        .duration(1500)
        .attr("stop-color", "red")
        .attr("offset", "100%");

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
      console.dir(emissions);

      maxEmission =
        Math.round(
          Math.max(...emissions[currentEmissionType].allValues) / 100000
        ) *
          100000 +
        100000;

      // Update color scale
      cScale = d3
        .scaleLinear()
        .domain([minEmission, maxEmission])
        .range(["white", "blue"]);

      colorEnd
        .transition()
        .duration(1500)
        .attr("stop-color", "blue")
        .attr("offset", "100%");

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
        .domain([minEmission, maxEmission])
        .range(["white", "orange"]);

      colorEnd
        .transition()
        .duration(1500)
        .attr("stop-color", "orange")
        .attr("offset", "100%");

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
        .domain([minEmission, maxEmission])
        .range(["white", "green"]);

      colorEnd
        .transition()
        .duration(1500)
        .attr("stop-color", "green")
        .attr("offset", "100%");

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
        .domain([minEmission, maxEmission])
        .range(["white", "teal"]);

      colorEnd
        .transition()
        .duration(1500)
        .attr("stop-color", "teal")
        .attr("offset", "100%");

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
        .domain([minEmission, maxEmission])
        .range(["white", "purple"]);

      colorEnd
        .transition()
        .duration(1500)
        .attr("stop-color", "purple")
        .attr("offset", "100%");

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
