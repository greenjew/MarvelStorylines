var eventName;
//var KEY = "ts=1&apikey=d92575fb645d421c9199398b0814ee26&hash=81f81b4409078c6f4c68f29fab98978b";
var KEY = "ts=1&apikey=7e704b2ecd024f62dc85df72b021527d&hash=3ea586f112e67bf98358bb2a4737aad2";
var url;

function setup() {

}

//Called after inputing text
function FindEvents() {
    for (var i = 0; i < 3; i++) {
        document.getElementsByClassName('found')[i].style.visibility = 'hidden';
        document.getElementsByClassName('found')[i].style.display = "none";
        document.getElementsByClassName('found')[i].style.height = '120px';
        document.getElementsByClassName('thumb')[i].src = "";
        document.getElementsByClassName('description')[i].innerText = "";
        document.getElementsByClassName('title')[i].innerText = "";
    }
    if (inputID.value === "")
        return;
    document.getElementById('loader').style.display = 'block';
    document.getElementById('loader').style.visibility = 'visible';
    eventName = document.getElementById('inputID').value;
    url = "https://gateway.marvel.com/v1/public/events?nameStartsWith=" + eventName + "&" + KEY;
    loadJSON(url, gotRequest)
}

function gotRequest(data) {
    for (var i = 0; i < 3; i++) {
        if (data.data.total === i)
            nothingFound(i);
        else
            gotMoreData(data.data.results[i], i);
    }
    document.getElementById('loader').style.display = 'none';
    document.getElementById('loader').style.visibility = 'hidden';
}

//found event - showed it
function gotMoreData(data, num) {
    var image_url = data.thumbnail.path;
    document.getElementsByClassName('thumb')[num].src = image_url + "/standard_medium.jpg";
    document.getElementsByClassName('description')[num].innerText = data.description;
    document.getElementsByClassName('title')[num].innerText = data.title;
    document.getElementsByClassName('found')[num].style.display = 'inline-block';
    document.getElementsByClassName('found')[num].style.visibility = 'visible';
}

//if there no more events
function nothingFound(num) {
    document.getElementsByClassName('title')[num].innerText = 'Nothing else found';
    document.getElementsByClassName('found')[num].style.height = '35px';
    document.getElementsByClassName('found')[num].style.display = 'inline-block';
    document.getElementsByClassName('found')[num].style.visibility = 'visible';
    document.getElementById('loader').style.display = 'none';
    document.getElementById('loader').style.visibility = 'hidden';
}







