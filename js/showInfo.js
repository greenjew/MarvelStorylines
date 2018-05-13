$(document).ready(function () { //ждём

    $(".img").click(function () {//по клику на картинку открываем информацию
        var img = $(this);
        var src = img.attr('src');
        $("#timeline").append("<div class='zoomer'><div class='zoomer_bg'></div><img class='zoomed_img' src='" + src + "'/></div>");
        $(".zoomer").fadeIn(800);
        $(".zoomer").click(function () {
            $(".zoomer").fadeOut(800);
            setTimeout(function () {
                $(".zoomer").remove()
            }, 400)
        });
    })
});