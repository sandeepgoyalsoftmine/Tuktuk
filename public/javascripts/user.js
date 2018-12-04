function getData()
{
    var combo = document.getElementById("writers");
    while (combo.firstChild) {
        combo.removeChild(combo.firstChild);
    }
    var option = document.createElement("option");
    option.text = "Loading...";
    combo.add(option, null);
    $.ajax(
        {
            type: "GET",
            url: "/user/unauthorizedAuthor",
            headers: {
                "userID":localStorage.getItem("userID")
            },
            success: function(response)
            {
                while (combo.firstChild) {
                    combo.removeChild(combo.firstChild);
                }
                var option = document.createElement("option");
                option.text = "Select";
                combo.add(option, null);
                for (var j = 0; j < response.length; j++) {
                    var option = document.createElement("option");
                    option.text = response[j].author;
                    option.value = response[j].author;
                    combo.add(option, null);
                }
            }
        });
}

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
}

function removeMarker(){
    marker.setMap(null);
}