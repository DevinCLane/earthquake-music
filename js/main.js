
// fetch data from USGS
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
  .then(response => response.json()) // parse the response as JSON
  .then(data => {
        // log what we have to the console
        console.log(data)



    });

/*
to do:
- convert time into seconds
- place each earthquake on a timeline between 0 and 60 seconds
- reverse their order
*/