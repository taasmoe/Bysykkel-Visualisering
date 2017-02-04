$(function () {
    $.getJSON("stations.json", function (json) {
        console.log(json["stations"]);

        var map = L.map('map').setView([59.930, 10.757933], 12);

        L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart_graatone&zoom={z}&x={x}&y={y}', {
            attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
        }).addTo(map);

        for (var i = 0; i < json["stations"].length; i++) {
            var lat = json["stations"][i]["center"]["latitude"];
            var long = json["stations"][i]["center"]["longitude"];
            var latlongArr = [lat, long];
            var title = json["stations"][i]["title"];

            L.marker(latlongArr, [title]).addTo(map);
        }

        for (var i = 1; i < json["stations"].length; i++) {
            var latlngs = [
                [json["stations"][i - 1]["center"]["latitude"],
                    json["stations"][i - 1]["center"]["longitude"]],
                [json["stations"][i]["center"]["latitude"],
                    json["stations"][i]["center"]["longitude"]]
            ];

            L.polyline(latlngs, {color: "red"}).addTo(map);
        }
    });
});