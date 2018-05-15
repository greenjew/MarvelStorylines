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
    for (var i = 2; i >= 0; i--) {
        document.getElementsByClassName('found')[i].style.visibility = 'hidden';
        document.getElementsByClassName('found')[i].style.display = "none";
        document.getElementsByClassName('found')[i].style.height = '120px';
        document.getElementsByClassName('thumb')[i].src = "";
        document.getElementsByClassName('description')[i].innerText = "";
        document.getElementsByClassName('title')[i].innerText = "";
    }
    document.getElementById('findMore').style.display = 'none';
    if (inputID.value === "")
        return;
    document.getElementById('loader').style.display = 'inline-block';
    document.getElementById('loader').style.visibility = 'visible';
    eventName = inputID.value;
    url = "https://gateway.marvel.com/v1/public/events" + KEY + "&nameStartsWith=" + eventName;
    (loadJSON(url, gotRequest));
}


function gotRequest(data) {
    events = data.data;
    for (var i = 0; i < 4; i++) {
        if (events.results[i]) {
            if (i > 2) {
                document.getElementById('findMore').style.display = 'block';
                document.getElementById('findMore').style.visibility = 'visible';
                break;
            }
            gotMoreData(events.results[i], i);
        }
        else {
            if (i < 3)
                nothingFound(i);
            break;
        }
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

$(document).ready(function () {

    $("#findMore").click(
        function showAllFound() {
            for (var i = 0; i < 4; i++) {
                document.getElementsByClassName('found')[i].style.visibility = 'hidden';
                document.getElementsByClassName('found')[i].style.display = "none";
                document.getElementsByClassName('found')[i].style.height = '120px';
            }
            $("main").append("<section id='moreEvents'><div class='grid'><div class='col-1-1' style='position: relative'></div></div></section>");
            var workspace = $("main").children("#moreEvents").children(".grid").children(".col-1-1");

            for (var i = 0; i < events.total; i++) {
                var eventThumbnail = events.results[i].thumbnail.path + "/standard_medium.jpg";
                workspace.append("<div class= 'event' style= '" +
                    " width: 30%; border: black solid 2px; margin: 2% 2% 0 0;'  onclick='chosenEvent(" + i + ")'>" +
                    "<img class='thumb' style='float: left; margin: 10px' src=" + eventThumbnail + ">" +
                    "<h5 class='title' style='font-weight: bold'>" + events.results[i].title + "</h5>" +
                    "<p class ='description'>" + events.results[i].description + "</p></div>"
                );
            }
            // $("#moreEvents").children('.event').click(function () {
            //     $("#moreEvents").fadeOut(500);
            //     setTimeout(function () {
            //         $("#moreEvents").remove()
            //     }, 500)
            // });
        });
});

;

//начинаем работать с ивентами
var next_event;
var prev_event;
var cur_event;

function chosenEvent(num) {
    $("#moreEvents").remove()
    for (var i = 0; i < 3; i++) {
        document.getElementsByClassName('found')[i].style.visibility = 'hidden';
        document.getElementsByClassName('found')[i].style.display = "none";
        document.getElementsByClassName('found')[i].style.height = '120px';
    }

    document.getElementById('timeline').style.display = 'block';
    document.getElementsByClassName('events')[0].style.display = 'block';
    loadJSON(events.results[num].resourceURI + KEY, currentEvent);
    if (events.results[num].next.resourceURI)
        loadJSON(events.results[num].next.resourceURI + KEY, nextEvent);
    //todo придумать else
    if (events.results[num].previous.resourceURI)
        loadJSON(events.results[num].previous.resourceURI + KEY, previousEvent);
    //todo придумать else
}

function previousEvent(data) {
    prev_event = data.data;
    document.getElementById('prev_event').src = prev_event.results[0].thumbnail.path + "/standard_fantastic.jpg";
    document.getElementsByClassName('event_title')[0].innerText = prev_event.results[0].title;
}

function currentEvent(data) {
    cur_event = data.data;
    document.getElementById('cur_event').src = cur_event.results[0].thumbnail.path + "/standard_fantastic.jpg";
    document.getElementsByClassName('event_title')[1].innerText = cur_event.results[0].title;
}

function nextEvent(data) {
    next_event = data.data;
    document.getElementById('next_event').src = next_event.results[0].thumbnail.path + "/standard_fantastic.jpg";
    document.getElementsByClassName('event_title')[2].innerText = next_event.results[0].title;
}

var chosen_event;
var char_pic;

$(document).ready(function () {

    $(".event").click(
        function showIinfo() {//по клику на cобытие на таймлайне открываем информацию
            var src = $(this).children(".thumbnail").attr('src');
            var name = $(this).children(".event_title").text();
            $("#timeline").append(
                "<div class='zoomer'>" +
                "<h1 class='zoomed_title' >" + name + "</h1>" +
                "<img class='zoomed_img' src='" + src + "'/>" +
                "<p class='zoomed_description'>" + chosen_event.results[0].description + "</p>" +
                "</div>");
            //после картинки добавляем персонажей
            $(".zoomer").append(
                "<div class='grid'>" +
                "<div class='col-1-1'>" +
                "<div class='characters'>" +
                "<h1 class='zoomed_title' style='margin-top: 10px'> Characters </h1>" +
                "</div></div></div>");

            for (var i = 0, offset = 0; i < chosen_event.results[0].characters.available; i++) {
                if (i == 20) {
                    offset = offset + i;
                    i = 0;
                }
                loadJSON(chosen_event.results[0].characters.items[i].resourceURI + KEY + "&offset=" + offset, getCharacter);
            }
            //

            $(".zoomer").fadeIn(1000);
            $(".zoomer").click(function () {
                $(".zoomer").fadeOut(1000);
                setTimeout(function () {
                    $(".zoomer").remove()
                }, 1000)
            });
        });
})
;

//получаем ссылку на необходимого персонажа из json файла и выводим его в поле для персонажей
function getCharacter(data) {
    char_pic = data.data.results[0].thumbnail.path + "/standard_medium.jpg";
    $(".characters").append("<div class='character'>" +
        "<img src=" + char_pic + ">" +
        "<h3 class='character_name'>" + data.data.results[0].name + "</h3></div> ");
}