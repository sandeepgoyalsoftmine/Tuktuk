$(document).ready(function() {
    $("#form1").submit(function (e) {
        e.preventDefault();
        var ajaxCall = $.ajax(
            {
                type: 'POST',
                url: '/create',
                data: $('#form1').serialize(),
                async: false,
                success: function (data, textStatus, request) {
                    console.log(data);
                    if(data.statusCode == 409 || data.statusCode=== '409'|| data.statusCode == 200 ) {
                        alert(data.data.message);
                        document.getElementById("form1").reset();
                    }
                },
                error: function (error) {
                    console.log(error);
                    alert(error.responseJSON.message);
                }
            });
    });
});

var flag=false;
var marker;
var interval
var lastTracks =0;
function getTrackData(userid){
    if(lastTracks !=0)
        document.getElementById(lastTracks).style.background='rgb(248, 248, 248)';
    lastTracks = userid;
    document.getElementById(userid).style.background='rgb(167, 197, 247)';
    clearInterval(interval);
    {$.ajax(
        {
            type: "GET",
            url: "/tracking/track/"+userid,
            success: function(response)
            {
                if(flag) {
                    removeMarker();
                    flag = false;
                }
                console.log("data  "+JSON.stringify(response.data.locations));
                var myLatLng = {lat: parseFloat(response.data.locations.lat) , lng: parseFloat(response.data.locations.lng)};
                addMArker(myLatLng, response.data.locations.created_on);
            }
        })}
    interval = window.setTimeout(function(){$.ajax(
        {
            type: "GET",
            url: "/tracking/track/"+userid,
            success: function(response)
            {
                if(flag) {
                    removeMarker();
                    flag = false;
                }
                console.log("data  "+response.data.locations.emailid);
                var myLatLng = {lat: parseFloat(response.data.locations.lat) , lng: parseFloat(response.data.locations.lng)};

                addMArker(myLatLng, response.data.locations.created_on);
            }
        })}, 10000);


}

function addMArker(myLatLng, created_on){
    flag = true;

    marker = new google.maps.Marker({
        center: myLatLng,
        position: myLatLng,
        map: map,zoom: 14,
        title: 'Last updated on : '+created_on

    });
    map.setCenter(myLatLng);
    geocoder.geocode({'latLng': myLatLng}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                var address = results[0].formatted_address;
                infowindow = new google.maps.InfoWindow({
                    content: address+
                    '<br>Last Updated : ' + created_on
                });
            }
        }else{
            infowindow = new google.maps.InfoWindow({
                content: ''
            });
        }
    });
    google.maps.event.addListener(marker, 'mouseover', function () {
        infowindow.open(map, this);
    });
}

function removeMarker(){
    marker.setMap(null);
}