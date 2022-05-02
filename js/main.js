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

    // this is where we'll place the earthquake data in the DOM
    const earthquakeDisplay = document.getElementById('earthquake-data');

    // Create a synth using tone.js and connect it to the main output (computer speakers)
    const synth = new Tone.Synth().toDestination();
    // the notes that we will play through
    const notes = ["C4", "D4", "E4", "G4", "A4", "C5"];
    // set up a counter variable
    let i = 0;
    // loop over the array
    for (const feature of features) {
        // calculate the time since the first earthquake
        const diffFromStart = feature.properties.time - features[0].properties.time;
        
        feature.playtime = diffFromStart / (24 * 60 * 1000)
        console.log(feature.playtime);

        setTimeout(
            (noteValue) => {
                const li = document.createElement('li');
                li.innerText = feature.properties.place;
                earthquakeDisplay.appendChild(li);
                window.scrollTo(0, document.body.scrollHeight);
                console.log(feature);
                console.log(noteValue);
                console.log(notes[noteValue % notes.length]);
                // play a note
                synth.triggerAttackRelease(notes[noteValue % notes.length], '32n');
            },
            feature.playtime * 1000,
            i
        );
        i++;
    }
}

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

// show a marker on the map
L.marker({lon: 0, lat: 0}).bindPopup('The center of the world').addTo(map);

/* to do
map magnitude to the font size
map the magnitude to change volume
think about a different synth
think about different notes
think about effects
display the earthquakes on the map
map pitch to data
*/