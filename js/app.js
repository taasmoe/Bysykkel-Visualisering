$(function () {

    // TODO Se om vi klarer fikse dette.
    /*
    var data = $.getJSON("stations.json", function (json) {
        return json["responseJSON"];
    });
    */

    // console.log(data);

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

        $("#visStativer").click(function () {
            leggTilMarkers()
        });

        //TODO gjør det mulig å fjerne markørene

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
            var edgeData = tree;

            var edges = [];

            for (var j = 0; j < edgeData.length; j++) {
                var id1 = edgeData[j][0];
                var id2 = edgeData[j][1];

                var latlngs = [];

                for (var i = 0; i < json["stations"].length; i++) {
                    var id = json["stations"][i]["id"];
                    if (id == id1 || id == id2) {
                        latlngs.push([json["stations"][i]["center"]["latitude"],
                            json["stations"][i]["center"]["longitude"]]);
                    }
                }
                edges.push(latlngs);
            }
            L.polyline(edges, {color: "blue", weight: "2"}).addTo(map);
        });
    });
});