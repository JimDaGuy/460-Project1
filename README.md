# World Emissions Data

Project 1 for IGME 460.

## Write Up

### Acquiring and Cleaning the Data Set

- Acquired information about International Greenhouse Gas Emissions from https://www.kaggle.com/unitednations/international-greenhouse-gas-emissions/home
- Found example of D3 mapping at http://bl.ocks.org/piwodlaiwo/31568d3a31014ff4be9922d07cb99d19
- Downloaded worldmap geojson from example. Hosted at http://enjalot.github.io/wwsd/data/world/world-110m.geojson
- Opened both datasets in Open Refine
- Renamed some countries in the greenhouse emissions dataset to match the geojson names such as United States of America to USA and United Kingdom to England
- Removed emissions data for countries not listed in geojson
- Removed emissions categories with very few results
- Simplified emissions category names for my own ease of use

### Analyzing the Dataset

- The greenhouse gas emissions data had four different fields to work with: Country, Year, Emission Type, and Emission Value.
- The data has values from 1990-2014.
- Some countries are missing from the list, predominantly in South America, Africa, and Asia.
- The United States is by far the leader in emissions among the countries listed in the data.
- CO2 is the largest contributor to greenhouse gas emissions in the data.

### Visualizing the Dataset

- I decided that a map would be the best way to display data about many different countries at the same time. Considering most people are familiar with the world map to some degree it should make the reperesentation of my data fairly straight forward.
- To show data for different years, I implemented a year slider.
- To show data for different types of emissions I implemented a few buttons to switch between emissions types.
- After starting with a saturation color scale, I switched to a diverging color scale to better show the difference between emissions values.
- I also added a tooltip to show the exact values for a hovered country.
