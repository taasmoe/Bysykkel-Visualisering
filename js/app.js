$(function () {
    $("#legend").hide();

    function getData(callback) {
        $.getJSON("stations.json", function (data) {
            callback(data);
        });
    }

    getData(function (json) {

    });

    var map = L.map('map', {
        center: [59.923, 10.72933],
        zoom: 13,
        minZoom: 13
    });

    L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart_graatone&zoom={z}&x={x}&y={y}', {
        attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
    }).addTo(map);

    var markers = [];
    var markersLayer;

    function leggTilMarkers() {

        getData(function (json) {
            for (var i = 0; i < json["stations"].length; i++) {

                var lat = json["stations"][i]["center"]["latitude"];
                var long = json["stations"][i]["center"]["longitude"];
                var mark = new L.marker([lat, long], {riseOnHover: true})
                    .bindPopup(json["stations"][i]["title"]);

                markers.push(mark);
            }

            markersLayer = L.layerGroup(markers).addTo(map);
        });
    }

    $("#visStativer").click(function () {

        leggTilMarkers();

        $("#visStativer").attr("disabled", true);
    });


    $("#skjulStativer").click(function () {

        markersLayer.eachLayer(function (layer) {
            markersLayer.removeLayer(layer);
        });

        markers = [];

        $("#visStativer").attr("disabled", false);
        $("#legend").hide();
    });


    $("#visStier").click(function () {

        getData(function (json) {
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
    });


    $("#skjulStier").click(function () {
        fjernAlleStier();
    });


    function fjernAlleStier() {
        for (var i in map._layers) {
            if (map._layers[i]._path != undefined) {
                try {
                    map.removeLayer(map._layers[i]);
                }
                catch (e) {
                    console.log("problem with " + e + map._layers[i]);
                }
            }
        }
    }


    $("#legg-til-sti").click(function () {
        getData(function (json) {
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
    });


    $("#legg-til-tre").click(function () {
        getData(function (json) {
            var edgeData = tree;
            var edges = [];

            for (var i = 0; i < edgeData.length; i++) {
                var id1 = edgeData[i][0];
                var id2 = edgeData[i][1];

                var latlngs = [];

                for (var j = 0; j < json["stations"].length; j++) {
                    var id = json["stations"][j]["id"];
                    if (id == id1 || id == id2) {
                        latlngs.push([json["stations"][j]["center"]["latitude"],
                            json["stations"][j]["center"]["longitude"]]);
                    }
                }
                edges.push(latlngs);
            }
            L.polyline(edges, {color: "blue", weight: "2"}).addTo(map);
        });
    });


    // Hvert stativ fargelegges etter hvor ofte det er start- og endepunkt for en tur
    $("#stationsRatio").click(function () {
        getData(function (json) {
            for (var i = 0; i < forhold["ratios"].length; i++) {
                var station = forhold["ratios"][i]["id"];
                var ratio = forhold["ratios"][i]["ratio"];
                var col;

                if (ratio > forhold["z_1"]) {
                    col = "#FF0000";
                } else if (ratio > forhold["mean"]) {
                    col = "#CCCC00";
                } else if (ratio > forhold["z_-1"]) {
                    col = "#00DD00";
                } else {
                    col = "#00AAA0";
                }

                for (var j = 0; j < json["stations"].length; j++) {
                    var id = json["stations"][j]["id"];
                    if (id == station) {
                        var lat = json["stations"][j]["center"]["latitude"];
                        var long = json["stations"][j]["center"]["longitude"];
                        var mark = new L.circleMarker([lat, long], {color: col})
                            .bindPopup(json["stations"][j]["title"]);
                        markers.push(mark);
                    }
                }
            }

            $("#legend li").each(function() {
                $(this).html(function(i, old) {
                    old = old.replace("z_1", logToRatio(forhold["z_1"]));
                    old = old.replace("z_-1", logToRatio(forhold["z_-1"]));
                    return old.replace("mean", logToRatio(forhold["mean"]));
                });
            });
            markersLayer = L.layerGroup(markers).addTo(map);
        });

        $("#legend").show();
    });
});

function logToRatio(x) {
    if (x < 0) {
        return "1:" + Math.exp(Math.abs(x)).toFixed(2);
    } else {
        return Math.exp(x).toFixed(2) + ":1";
    }
}