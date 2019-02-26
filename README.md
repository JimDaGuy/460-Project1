# World Emissions Data

Project 1 for IGME 460.

## Process

### 1. Acquire and Clean Data Set

- Acquired information about International Greenhouse Gas Emissions from https://www.kaggle.com/unitednations/international-greenhouse-gas-emissions/home
- Found example of D3 mapping at http://bl.ocks.org/piwodlaiwo/31568d3a31014ff4be9922d07cb99d19
- Downloaded geojson from example. Hosted at http://enjalot.github.io/wwsd/data/world/world-110m.geojson
- Opened both datasets in Open Refine
- Renamed some countries in the first set to match the geojson names such as United States of America to USA and United Kingdom to England
- Removed emissions data for countries not listed in geojson
- Removed emissions categories with very few results
- Simplified emissions category names

### 2. Analyze Dataset

- Some countries are missing from the list, predominantly in South America, Africa, and Asia.
- The United States is by far the leader in emissions among the countries listed in the data.
- CO2 is the largest contributor to greenhouse gas emissions in the data.

### 3. Develop Visualization

- Drew world map using geojson
- Set fill color for each country based on co2 emissions in 1990

### 4. Iterate

- Implemented slider for changing year values from 1990-2014
- Implemented buttons for changing type of emissions (co2, ghg, hfcs, ch4, n2o, sf6)
- Added some styling to the pages (lightblue map background, centering elements, style buttons)
- Added Color Scale Key to bottom of the map
-

### 5. Tell the Story

-
