$(function () {

    $.getJSON("stations.json", function (json) {

        console.log(json["stations"]);

        var lat = json["stations"][1]["center"]["latitude"];
        var long = json["stations"][1]["center"]["longitude"];
        var title = json["stations"][1]["title"];

        console.log(title);

        var latlongArr = [lat, long];

        console.log(latlongArr);

        var map = L.map('map').setView([59.930, 10.757933], 12);

        L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart_graatone&zoom={z}&x={x}&y={y}', {
            attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
        }).addTo(map);

        L.marker(latlongArr, title).addTo(map);
    });
});