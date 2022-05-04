// Leaflet map
// initialize map
let map = L.map('map').setView([30, -98], 4);

// add the OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

// show the scale bar on the lower left corner
L.control.scale({imperial: true, metric: true}).addTo(map);

// stop everything
function stop() {
    window.location.reload();
}

// use an async function to minimize nesting
async function start() {
    // request the earthquakes 
    const url =
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
    
    // use destructuring assignment to get the features property
    const { features } = await fetch(url).then((res) => res.json()); // parse response as JSON

    // reverse the features array to get them in chronological order
    features.reverse();
    console.log(features);

    // Create a synth using tone.js and connect it to the main output (computer speakers)
    const synth = new Tone.Synth().toDestination();

    // loop over the array
    for (const feature of features) {
        // calculate the time since the first earthquake
        const diffFromStart = feature.properties.time - features[0].properties.time;
        // calculate where in our timeline of one minute to play each earthquake
        feature.playtime = diffFromStart / (24 * 60 * 1000)
        console.log(feature.playtime);

        // scale data function (we're converting earthquake magnitudes (~0-10) into a musical range of pitches (~40-900hz))
        // thanks to https://writingjavascript.com/scaling-values-between-two-ranges
        const scaleData = function scale(value, inMin, inMax, outMin, outMax) {
            const result = (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
          
            if (result < outMin) {
              return outMin;
            } else if (result > outMax) {
              return outMax;
            }
          
            return result;
          }
        // add this property to our object
        feature.scaledTone = scaleData(feature.properties.mag, 0, 10, 40, 900)
        console.log(feature.scaledTone)
        
        // create a timer for playing the notes
        setTimeout(
            () => {
                // create geoJSON layer
                var myLayer = L.geoJSON(feature).addTo(map);
                // add the coordinates of the earthquake to the map
                myLayer.addData(feature.geometry.coordinates);
                console.log(feature);
                // play a note
                synth.triggerAttackRelease(feature.scaledTone, '32n');
            },
            feature.playtime * 1000,
        );
    }
}


/* to do
map magnitude to the font size
map the magnitude to change volume
think about a different synth
think about different notes
think about effects
display the earthquakes on the map
map pitch to data


2.5 or less 	Usually not felt, but can be recorded by seismograph. 	Millions
2.5 to 5.4 	Often felt, but only causes minor damage. 	500,000
5.5 to 6.0 	Slight damage to buildings and other structures. 	350
6.1 to 6.9 	May cause a lot of damage in very populated areas. 	100
7.0 to 7.9 	Major earthquake. Serious damage. 	10-15
8.0 or greater 	Great earthquake. Can totally destroy communities near the epicenter. 	One every year or two



take numbers between 0 and
*/