$(function () {

    // TODO Se om vi klarer fikse dette.
    /*
    var data = $.getJSON("stations.json", function (json) {
        return json["responseJSON"];
    });
    */

    console.log(data);

    $.getJSON("stations.json", function (json) {

        var map = L.map('map', {
            center: [59.930, 10.747933],
            zoom: 12.5,
            minZoom: 12.5
        });

        L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart_graatone&zoom={z}&x={x}&y={y}', {
            attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
        }).addTo(map);

        function leggTilMarkers() {
            for (var i = 0; i < json["stations"].length; i++) {
                var lat = json["stations"][i]["center"]["latitude"];
                var long = json["stations"][i]["center"]["longitude"];
                var latlongArr = [lat, long];
                var station_title = json["stations"][i]["title"];

                L.marker(latlongArr, {riseOnHover: true, title: station_title}).addTo(map);
            }
        }

        leggTilMarkers();

        $("#visStier").click(function () {
            for (var i = 1; i < json["stations"].length; i++) {
                var latlngs = [
                    [json["stations"][i - 1]["center"]["latitude"],
                        json["stations"][i - 1]["center"]["longitude"]],
                    [json["stations"][i]["center"]["latitude"],
                        json["stations"][i]["center"]["longitude"]]
                ];

                L.polyline(latlngs, {color: "coral"}).addTo(map);
            }
        });

        $("#skjulStier").click(function () {
            fjernAlleStier();
        });

        function fjernAlleStier() {
            for(i in map._layers) {
                if(map._layers[i]._path != undefined) {
                    try {
                        map.removeLayer(map._layers[i]);
                    }
                    catch(e) {
                        console.log("problem with " + e + map._layers[i]);
                    }
                }
            }
        }

        $("#legg-til-sti").click(function () {
            fjernAlleStier();

            var id1 = $("#id1").val();
            var id2 = $("#id2").val();

            var latlngs = [];

            for (var i = 0; i < json["stations"].length; i++) {
                var id = json["stations"][i]["id"];
                if (id == id1 || id == id2) {
                    latlngs.push([json["stations"][i]["center"]["latitude"],
                        json["stations"][i]["center"]["longitude"]]);
                }
            }

            L.polyline(latlngs, {color: "red"}).addTo(map);
        });

        $("#legg-til-tre").click(function () {
            var kanter = [
                [288, 306],
                [288, 186],
                [306, 211],
                [306, 181],
                [181, 208],
                [288, 236],
                [288, 243],
                [243, 191],
                [243, 295],
                [295, 163],
                [295, 157],
                [191, 281],
                [295, 294],
                [191, 175],
                [186, 301],
                [306, 272],
                [211, 247],
                [181, 277],
                [175, 201],
                [186, 229],
                [229, 210],
                [210, 262],
                [262, 214],
                [281, 297],
                [297, 204],
                [297, 274],
                [272, 194],
                [211, 160],
                [288, 226],
                [226, 228],
                [228, 235],
                [228, 233],
                [226, 196],
                [196, 271],
                [271, 255],
                [271, 172],
                [172, 251],
                [172, 248],
                [248, 197],
                [248, 291],
                [197, 221],
                [221, 273],
                [221, 217],
                [291, 162],
                [248, 176],
                [217, 268],
                [268, 161],
                [161, 206],
                [161, 227],
                [161, 167],
                [227, 164],
                [268, 287],
                [287, 280],
                [161, 198],
                [198, 267],
                [164, 185],
                [185, 190],
                [235, 246],
                [221, 179],
                [179, 257],
                [181, 184],
                [246, 222],
                [277, 266],
                [266, 200],
                [266, 242],
                [226, 173],
                [236, 279],
                [279, 220],
                [279, 249],
                [279, 253],
                [253, 195],
                [253, 302],
                [195, 192],
                [192, 238],
                [302, 234],
                [253, 202],
                [253, 199],
                [238, 278],
                [302, 232],
                [232, 219],
                [232, 290],
                [290, 261],
                [202, 275],
                [302, 260],
                [175, 264],
                [261, 218],
                [218, 203],
                [235, 265],
                [246, 292],
                [272, 237],
                [204, 170],
                [170, 283],
                [170, 299],
                [299, 178],
                [283, 298],
                [178, 284],
                [298, 189],
                [283, 174],
                [157, 269],
                [281, 240],
                [163, 159],
                [159, 213],
                [227, 293],
                [293, 241],
                [293, 252],
                [163, 177],
                [195, 285],
                [285, 245],
                [245, 188],
                [197, 183],
                [183, 231],
                [235, 254],
                [191, 209],
                [267, 212],
                [173, 239],
                [229, 205],
                [269, 256],
            ];

            var latlngs = [];

            for (var j = 0; j < kanter.length; j++) {
                var id1 = kanter[j][0];
                var id2 = kanter[j][1];

                for (var i = 0; i < json["stations"].length; i++) {
                    var id = json["stations"][i]["id"];
                    if (id == id1 || id == id2) {
                        latlngs.push([json["stations"][i]["center"]["latitude"],
                            json["stations"][i]["center"]["longitude"]]);
                    }
                }

                L.polyline(latlngs, {color: "red"}).addTo(map);
            }
        });
    });
});