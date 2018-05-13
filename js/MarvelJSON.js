var eventName;
//var KEY = "ts=1&apikey=d92575fb645d421c9199398b0814ee26&hash=81f81b4409078c6f4c68f29fab98978b";
var KEY = "?ts=1&apikey=7e704b2ecd024f62dc85df72b021527d&hash=3ea586f112e67bf98358bb2a4737aad2";
var url;
var events;
var inputID;

function setup() {
    inputID = document.getElementById('inputID');
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
    eventName = inputID.value;
    url = "https://gateway.marvel.com/v1/public/events" + KEY + "nameStartsWith=" + eventName;
    loadJSON(url, gotRequest);
}

function gotRequest(data) {
    events = data.data;
    for (var i = 0; i < 3; i++) {
        if (events.results[i])
            gotMoreData(events.results[i], i);
        else
            nothingFound(i);

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

//начинаем работать с ивентами
var next_event;
var prev_event;
var cur_event;

function choosenEvent(num) {
    for (var i = 0; i < 3; i++) {
        document.getElementsByClassName('found')[i].style.visibility = 'hidden';
        document.getElementsByClassName('found')[i].style.display = "none";
        document.getElementsByClassName('found')[i].style.height = '120px';
    }
    cur_event = events.results[num];
    document.getElementById('cur_event').src = cur_event.thumbnail.path + "/standard_large.jpg";

    if (events.results[num].next.resourceURI)
        loadJSON(events.results[num].next.resourceURI + KEY, nextEvent);
    //todo придумать else
    if (events.results[num].previous.resourceURI)
        loadJSON(events.results[num].previous.resourceURI + KEY, previousEvent);
    //todo придумать else

    document.getElementById('cur_event').src = events.results[num].thumbnail.path + "/standard_fantastic.jpg";
}

function nextEvent(data) {
    next_event = data.data;
    document.getElementById('next_event').src = next_event.results[0].thumbnail.path + "/standard__fantastic.jpg";
}

function previousEvent(data) {
    prev_event = data.data;
    document.getElementById('prev_event').src = prev_event.results[0].thumbnail.path + "/standard_fantastic.jpg";
}

var chosen_event;
var char_pic;
$(document).ready(function () { //ждём клика

    $(".event").click(function () {//по клику на картинку открываем информацию
        var src = $(this).children(".img").attr('src');
        var name = $(this).children(".title").text();
        $("#timeline").append(
            "<div class='zoomer'>" +
            "<h1 class='zoomed_title' >" + name + "</h1>" +
            "<img class='zoomed_img' src='" + src + "'/>" +
            "<p class='zoomed_description'>" + chosen_event.description + "</p>")
        //после картинки добавляем персонажей
        $(".zoomer").append("<div class='grid'>");
        $(".zoomer").children(".grid").append("<div class='col-1-1'>");
        $(".zoomer").children(".grid").children(".col-1-1").append("<div class='characters'>" +
            "<h1 class='zoomed_title' style='margin-top: 10px'> Characters </h1>");

        for (var i = 0; i < chosen_event.characters.available; i++) {
            loadJSON(chosen_event.characters.items[i].resourseURI + KEY, getPicture);
            $(".characters").append("<div class='character'>" +
                "<img src=" + char_pic + ">" +
                "<h3 class='character_name'></h3></div> "
            )
        }
        $(".zoomer").children(".grid").children(".col-1-1").append("</div>");
        $(".zoomer").children(".grid").append("</div>");
        $(".zoomer").append("</div>");
        $("body").append("</div>");
        $(".zoomer").fadeIn(1000);

        $(".zoomer").click(function () {
            $(".zoomer").fadeOut(1000);
            setTimeout(function () {
                $(".zoomer").remove()
            }, 1000)
        });
    })
});

function getPicture(data) {
    char_pic = data.data.results[0].thumbnail.path + "/standard_medium.jpg";
}