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
function addUser(){
    $(document).ready(function() {
        $("#form1").submit(function (e) {
            e.preventDefault();
            var ajaxCall = $.ajax(
                {
                    type: 'POST',
                    url: $('#form1').attr('action'),
                    data: $('#form1').serialize(),
                    async: false,
                    success: function (data, textStatus, request) {
                        alert(data.message);
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
        });
    });
}
var flag=false;
var marker;
var interval
function getTrackData(userid){
    // document.getElementById(userid).style.background="red";
    clearInterval(interval);
    interval = window.setInterval(function(){$.ajax(
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
                addMArker(myLatLng);
            }
        })}, 10000);


}
function addMArker(myLatLng){
    flag = true;
    marker = new google.maps.Marker({
        center: myLatLng,
        position: myLatLng,
        map: map,
        title: 'Hello World!',
        zoom: 4
    });
    map.setCenter(myLatLng);
}

function removeMarker(){
    marker.setMap(null);
}