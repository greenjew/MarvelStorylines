var eventName;
//var KEY = "ts=1&apikey=d92575fb645d421c9199398b0814ee26&hash=81f81b4409078c6f4c68f29fab98978b";
var KEY = "ts=1&apikey=7e704b2ecd024f62dc85df72b021527d&hash=3ea586f112e67bf98358bb2a4737aad2";
var url;
var inputID;

function setup() {
    inputID = document.getElementById('inputID');
    // loadJSON(url, gotData);
}

//Called after inputing text
function FindEvents() {
    eventName = inputID.value;
    url = "https://gateway.marvel.com/v1/public/events?nameStartsWith=" + eventName + "&" + KEY;
    loadJSON(url, gotData)
}

function gotData(data) {

    console.log(data.data)
    //got choosen event
    var cur_image_url = data.data.results[0].thumbnail.path;
    document.getElementById('cur_event').src = cur_image_url + "/standard_xlarge.jpg";

    loadJSON(data.data.results[0].next.resourceURI + "?" + KEY, gotNextEvent);
    loadJSON(data.data.results[0].previous.resourceURI + "?" + KEY, gotPrevEvent);
}

function gotNextEvent(data) {
    console.log("next")
    //got next event
    var next_image_url = data.data.results[0].thumbnail.path;
    document.getElementById('next_event').src = next_image_url + "/standard_xlarge.jpg";

}

function gotPrevEvent(data) {
    console.log("prev")
    //got previous event
    var prev_image_url = data.data.results[0].thumbnail.path;
    document.getElementById('prev_event').src = prev_image_url + "/standard_xlarge.jpg";
}

