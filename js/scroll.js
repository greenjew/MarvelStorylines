$(window).scroll(function scrollHeader() {
    var st = $(this).scrollTop();

    $("#finder").css({
        "transform": "translate(0%,-" + st/10 + "%"
    });
});
