// let earthquakes = null;


function start() {
    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
    .then(res => res.json()) // parse response as JSON
    .then(data => {
    console.log(data)
    //   earthquakes = data;
        data.features.reverse();
            //create a synth and connect it to the main output (your speakers)
            const synth = new Tone.Synth().toDestination();
        let notes = ['C4', 'D4', 'E4', 'G4', 'A4', 'C5'];
        let i = 0;
        
        data.features.forEach(feature => {
            let diffFromStart = feature.properties.time - data.features[0].properties.time
            feature.playtime = diffFromStart / (24 * 60 * 1000); // multiplies 24 hours by 60 minutes by 1000 to make it not miliseconds
            console.log(feature.playtime)
            let earthquakeDisplay = document.getElementById('earthquake-data')
            setTimeout((noteValue) => {
                let li = document.createElement('li');
                li.innerText = feature.properties.place;
                earthquakeDisplay.appendChild(li)
                window.scrollTo(0, document.body.scrollHeight)
                console.log(feature)
            //play a middle 'C' for the duration of an 8th note
            console.log(noteValue)
            console.log(notes[noteValue % notes.length])
            synth.triggerAttackRelease(notes[noteValue % notes.length], "32n");
            }, feature.playtime * 1000, i);
            i++
            
            
    })
    console.log(data)

    })
    .catch(err => {
        console.log(`error ${err}`)
    });
}
/* to do
map magnitude to the font size
map the magnitude to change volume
think about a different synth
think about different notes
think about effects
display the earthquakes on the map
map pitch to data

*/