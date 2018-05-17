(function render() {
    var Renderer = function (canvas) {
        var canvas = $(canvas).get(0);
        var ctx = canvas.getContext("2d");
        var particleSystem;
        var changed;
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
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                $("#findButton").click(function () {
                    changed = true;
                });

                particleSystem.eachEdge(	//отрисуем каждую грань
                    function (edge, pt1, pt2) {
                        ctx.strokeStyle = "rgba(0,0,0,1)";
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(pt1.x, pt1.y);
                        ctx.lineTo(pt2.x, pt2.y);
                        ctx.stroke();
                    });

                particleSystem.eachNode(	//теперь каждую вершину
                    function (node, pt) {
                        if (node.data.image) {
                            node.data.imageob = new Image()
                            node.data.imageob.src = node.data.image
                        }
                        var imageob = node.data.imageob;
                        ctx.drawImage(imageob, pt.x, pt.y, 20, 20);
                        ctx.fillStyle = "red";
                        ctx.font = 'italic 13px sans-serif';
                        ctx.fillText(node.name, pt.x + 8, pt.y + 8); //пишем имя у каждой точки
                    });
            },

            initMouseHandling: function () {	//события с мышью
                var dragged = null;			//вершина которую перемещают
                var handler = {
                    clicked: function (e) {	//нажали
                        var pos = $(canvas).offset();
                        _mouseP = arbor.Point(e.pageX - pos.left, e.pageY - pos.top);
                        dragged = particleSystem.nearest(_mouseP);
                        if (dragged && dragged.node !== null) {
                            dragged.node.fixed = true;	//фиксируем её
                        }
                        $(canvas).bind('mousemove', handler.dragged);
                        $(window).bind('mouseup', handler.dropped);
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
    };
    var events = [];
    var concurrences = [];
    var chars = [[]];
    var edges = [];
    var file;
    var temp = 0;
    $(document).ready(function () {
        $.getJSON("src/marvel_events.json",
            function (data) {
                file = data;
                var date = null;
                for (var i = 0; i < 74 * 74; i++)
                    edges[i] = {};
                for (var i = 0; i < 74; i++) {
                    concurrences[i] = {};
                    events[i] = {title: data[i].title};
                    chars[i] = data[i].characters.items;
                }
            })
    })
    $(document).ready(function () {
        $("#findButton").click(
            function buildGraph() {
                var name = document.getElementById("inputID").value;
                var end = new Date(document.getElementById("end_year").selectedIndex);
                var start = new Date(document.getElementById("start_year").selectedIndex);

                //проходим по всем возможным парам без повторений
                for (var i = 0; i < 74; i++) {
                    for (var j = i; j < 74; j++) {
                        concurrences[i][file[j].title] = [];
                        //ищем совпадения по персонажам и проверяем временные рамки
                        chars[i].forEach(function (char1) {
                            chars[j].forEach(function (char2) {
                                // //если есть дата
                                // if (start && end) {
                                //     if (file[i].end && file[j].start && (new Date(file[i].end.substr(0, 10)) < end)
                                //         && (new Date(file[j].start.substr(0, 10)) > start) &&
                                //         (char1.name.trim() == char2.name.trim())) {
                                //         edges[temp++] = {
                                //             from: events[i].title,
                                //             to: events[j].title
                                //         };
                                //         concurrences[i][file[j].title] = char1.name;
                                //     }
                                //
                                // }
                                // // нет даты
                                // else
                                    if (char1.name.trim() == char2.name.trim()) {
                                    edges[temp++] = {
                                        from: events[i].title,
                                        to: events[j].title
                                    };
                                    console.log(char1.name.trim())
                                    concurrences[i][file[j].title] = char1.name;
                                }
                            });
                        });
                    }
                }

                sys = arbor.ParticleSystem(100000); // создаём систему
                sys.parameters({gravity: false, dt: 0.2, stiffness: 600});
                sys.renderer = Renderer("#viewport");

                events.forEach(function (event, i, events) {
                    sys.addNode(event.title, {
                        id: i,
                        image: file[i].thumbnail.path + "/standard_small.jpg"
                    });//добавляем вершину
                })

                edges.forEach(function (edge) {
                    sys.addEdge(sys.getNode(edge.from), sys.getNode(edge.to));	//добавляем грань
                });
            }
        )

    })
    ;
})(this.jQuery);