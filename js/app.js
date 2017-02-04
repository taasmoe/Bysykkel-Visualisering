$(function () {

    // TODO Se om vi klarer fikse dette.
    /*
    var data = $.getJSON("stations.json", function (json) {
        return json["responseJSON"];
    });
    */

    //console.log(data);

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
            var kanter = [
                [["246"], ["210"]],
                [["246"], ["214"]],
                [["246"], ["295"]],
                [["246"], ["173"]],
                [["246"], ["257"]],
                [["246"], ["226"]],
                [["295"], ["163"]],
                [["295"], ["157"]],
                [["246"], ["191"]],
                [["246"], ["196"]],
                [["210"], ["262"]],
                [["210"], ["229"]],
                [["295"], ["281"]],
                [["226"], ["228"]],
                [["257"], ["179"]],
                [["295"], ["236"]],
                [["191"], ["243"]],
                [["295"], ["175"]],
                [["295"], ["186"]],
                [["295"], ["211"]],
                [["191"], ["294"]],
                [["295"], ["288"]],
                [["196"], ["271"]],
                [["228"], ["235"]],
                [["196"], ["233"]],
                [["295"], ["277"]],
                [["196"], ["172"]],
                [["226"], ["208"]],
                [["226"], ["222"]],
                [["186"], ["306"]],
                [["214"], ["266"]],
                [["210"], ["251"]],
                [["257"], ["265"]],
                [["236"], ["181"]],
                [["226"], ["197"]],
                [["257"], ["255"]],
                [["228"], ["248"]],
                [["236"], ["247"]],
                [["266"], ["200"]],
                [["226"], ["164"]],
                [["295"], ["297"]],
                [["306"], ["160"]],
                [["175"], ["201"]],
                [["306"], ["301"]],
                [["197"], ["291"]],
                [["163"], ["204"]],
                [["181"], ["272"]],
                [["248"], ["162"]],
                [["200"], ["242"]],
                [["164"], ["206"]],
                [["164"], ["287"]],
                [["208"], ["238"]],
                [["297"], ["274"]],
                [["164"], ["198"]],
                [["246"], ["237"]],
                [["181"], ["279"]],
                [["164"], ["227"]],
                [["257"], ["177"]],
                [["236"], ["249"]],
                [["291"], ["221"]],
                [["291"], ["161"]],
                [["201"], ["194"]],
                [["238"], ["192"]],
                [["287"], ["280"]],
                [["279"], ["220"]],
                [["164"], ["185"]],
                [["281"], ["285"]],
                [["291"], ["273"]],
                [["247"], ["278"]],
                [["238"], ["234"]],
                [["164"], ["167"]],
                [["198"], ["267"]],
                [["238"], ["199"]],
                [["301"], ["302"]],
                [["287"], ["190"]],
                [["221"], ["217"]],
                [["291"], ["268"]],
                [["220"], ["253"]],
                [["238"], ["195"]],
                [["221"], ["176"]],
                [["257"], ["213"]],
                [["179"], ["212"]],
                [["237"], ["159"]],
                [["287"], ["275"]],
                [["201"], ["188"]],
                [["217"], ["184"]],
                [["285"], ["245"]],
                [["253"], ["202"]],
                [["273"], ["269"]],
                [["268"], ["203"]],
                [["268"], ["283"]],
                [["157"], ["239"]],
                [["195"], ["292"]],
                [["203"], ["218"]],
                [["202"], ["232"]],
                [["268"], ["299"]],
                [["268"], ["189"]],
                [["283"], ["170"]],
                [["232"], ["219"]],
                [["275"], ["261"]],
                [["202"], ["290"]],
                [["275"], ["260"]],
                [["267"], ["298"]],
                [["159"], ["183"]],
                [["299"], ["178"]],
                [["232"], ["264"]],
                [["183"], ["231"]],
                [["283"], ["284"]],
                [["203"], ["254"]],
                [["219"], ["240"]],
                [["219"], ["241"]],
                [["178"], ["174"]],
                [["268"], ["209"]],
                [["241"], ["293"]],
                [["241"], ["252"]],
                [["240"], ["205"]],
                [["205"], ["256"]]
            ];

            var edges = [];

            for (var j = 0; j < kanter.length; j++) {
                var id1 = kanter[j][0];
                var id2 = kanter[j][1];

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