(function render($) {
    var Renderer = function (canvas) {
        var canvas = $(canvas).get(0);
        var ctx = canvas.getContext("2d");
        var particleSystem;

        var that = {
            init: function (system) {
                //начальная инициализация
                particleSystem = system;
                particleSystem.screenSize(canvas.width, canvas.height);
                particleSystem.screenPadding(80);
                that.initMouseHandling();
            },

            redraw: function () {
                //действия при перересовке
                ctx.fillStyle = "white";	//белым цветом
                ctx.fillRect(0, 0, canvas.width, canvas.height); //закрашиваем всю область

                particleSystem.eachEdge(	//отрисуем каждую грань
                    function (edge, pt1, pt2) {	//будем работать с гранями и точками её начала и конца
                        ctx.strokeStyle = "rgb(0,0,0)";	//грани будут чёрным цветом с некой прозрачностью
                        ctx.lineWidth = 5;	//толщиной в один пиксель
                        ctx.beginPath();		//начинаем рисовать
                        ctx.moveTo(pt1.x, pt1.y); //от точки один
                        ctx.lineTo(pt2.x, pt2.y); //до точки два
                        ctx.stroke();
                    });

                particleSystem.eachNode(	//теперь каждую вершину
                    function (node, pt) {		//получаем вершину и точку где она
                        var w = 10;			//ширина квадрата
                        ctx.fillStyle = "orange";	//с его цветом понятно
                        ctx.fillRect(pt.x - w / 2, pt.y - w / 2, w, w);	//рисуем
                        ctx.fillStyle = "black";	//цвет для шрифта
                        ctx.font = 'italic 13px sans-serif'; //шрифт
                        ctx.fillText(node.name, pt.x + 8, pt.y + 8); //пишем имя у каждой точки
                    });
            },

            initMouseHandling: function () {	//события с мышью
                var dragged = null;			//вершина которую перемещают
                var handler = {
                    clicked: function (e) {	//нажали
                        var pos = $(canvas).offset();	//получаем позицию canvas
                        _mouseP = arbor.Point(e.pageX - pos.left, e.pageY - pos.top); //и позицию нажатия кнопки относительно canvas
                        dragged = particleSystem.nearest(_mouseP);	//определяем ближайшую вершину к нажатию
                        if (dragged && dragged.node !== null) {
                            dragged.node.fixed = true;	//фиксируем её
                        }
                        $(canvas).bind('mousemove', handler.dragged);	//слушаем события перемещения мыши
                        $(window).bind('mouseup', handler.dropped);		//и отпускания кнопки
                        return false;
                    },
                    dragged: function (e) {	//перетаскиваем вершину
                        var pos = $(canvas).offset();
                        var s = arbor.Point(e.pageX - pos.left, e.pageY - pos.top);

                        if (dragged && dragged.node !== null) {
                            var p = particleSystem.fromScreen(s);
                            dragged.node.p = p;	//тянем вершину за нажатой мышью
                        }

                        return false;
                    },
                    dropped: function (e) {	//отпустили
                        if (dragged === null || dragged.node === undefined) return;	//если не перемещали, то уходим
                        if (dragged.node !== null) dragged.node.fixed = false;	//если перемещали - отпускаем
                        dragged = null; //очищаем
                        $(canvas).unbind('mousemove', handler.dragged); //перестаём слушать события
                        $(window).unbind('mouseup', handler.dropped);
                        _mouseP = null;
                        return false;
                    }
                }
                // слушаем события нажатия мыши
                $(canvas).mousedown(handler.clicked);
            },

        }
        return that;
    }

    $(document).ready(
        function buildGraph() {
            $.getJSON("marvel_events.json",
                function (data) {
                    var edges = [];
                    var concurrences = [];
                    for (var i = 0; i < 74; i++) {
                        concurrences[i] = {};
                    }
                    var events = [];
                    //проходим по всем возможным парам без повторений
                    for (var i = 0; i < 74; i++) {
                        // event = JSON.stringify(event);
                        events[i] = {title: data[i].title};
                        for (var j = i + 1; j < 74; j++) {
                            concurrences[i][data[j].title] = [];
                            //ищем совпадения по персонажам
                            var count = 0;
                            for (var k = 0, flag = ""; k < data[i].characters.returned/*available*/; k++)
                                for (var l = 0; l < data[j].characters.returned/*available*/; l++) {
                                    // if (data[i].characters.items[k] == data[j].characters.items[l]) {
                                    edges[count] = {
                                        src: data[i].title,
                                        dest: data[j].title
                                    }
                                    flag = 1;
                                    count++;
                                    concurrences[i][data[j].title] = data[i].characters.items[k] ;
                                    // }
                                }
                        }
                    }
                    sys = arbor.ParticleSystem(100); // создаём систему
                    sys.parameters({gravity: true}); // гравитация вкл
                    sys.renderer = Renderer("#viewport"); //начинаем рисовать в выбраной области


                    events.forEach(function (event, i, events) {
                        sys.addNode(event.title, {data: i});//добавляем вершину
                    })

                    edges.forEach(function (edge, i, edges) {
                        sys.addEdge(sys.getNode(edge.src), sys.getNode(edge.dest), {data: concurrences[i][edge.dest]});	//добавляем грань
                    });
                });
        }
    )

})(this.jQuery)
