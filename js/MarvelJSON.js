var eventName;
//var KEY = "ts=1&apikey=d92575fb645d421c9199398b0814ee26&hash=81f81b4409078c6f4c68f29fab98978b";
var KEY = "ts=1&apikey=7e704b2ecd024f62dc85df72b021527d&hash=3ea586f112e67bf98358bb2a4737aad2";
var url;
var inputID;

function setup() {
    inputID = document.getElementById('inputID');
}

//Called after inputing text
function FindEvents() {
    eventName = inputID.value;
    url = "https://gateway.marvel.com/v1/public/events?nameStartsWith=" + eventName + "&" + KEY;
    loadJSON(url, gotRequest)
}

function gotRequest(data) {
    //got choosen event
    console.log(data.data.results[0]);
    var cur_image_url = data.data.results[0].thumbnail.path;
    document.getElementById('thumb-1').src = cur_image_url + "/standard_small.jpg";
    document.getElementById('description-1').innerText = data.data.results[0].description;
    document.getElementsByClassName('found')[0].style.visibility = 'visible';

    loadJSON(data.data.results[0].next.resourceURI + "?" + KEY, gotSecondRequest);
    loadJSON(data.data.results[0].previous.resourceURI + "?" + KEY, gotThirdRequest);
}

function gotSecondRequest(data) {
    //got next event
    console.log(data.data.results[0]);
    var next_image_url = data.data.results[0].thumbnail.path;
    document.getElementById('thumb-2').src = next_image_url + "/standard_small.jpg";
    document.getElementById('description-2').innerText = data.data.results[0].description;
    document.getElementsByClassName('found')[1].style.visibility = 'visible';
}

function gotThirdRequest(data) {
    //got previous event
    console.log(data.data.results[0]);
    var prev_image_url = data.data.results[0].thumbnail.path;
    document.getElementById('thumb-3').src = prev_image_url + "/standard_small.jpg";
    document.getElementById('description-3').innerText = data.data.results[0].description;
    document.getElementsByClassName('found')[2].style.visibility = 'visible';
}

