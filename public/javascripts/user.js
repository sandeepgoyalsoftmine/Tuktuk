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

function setEditEmployee(userid){
    $.ajax(
        {
            type: "GET",
            url: "/view/"+userid,
            headers: {
                "userID":localStorage.getItem("TUKTUK_TOKEN")
            },
            success: function(response)
            {
                if(response.data.UserDetails[0].user_type == 1){
                    alert("Can not edit Admin");
                    closeModal();
                }else {
                    if(response.data.UserDetails[0].gender===null){
                        document.getElementById('sex').value = 'Select';
                    }else{
                        document.getElementById('sex').value = response.data.UserDetails[0].gender;
                    }
                    console.log(response);
                    document.getElementById('user_id').value = response.data.UserDetails[0].userid;
                    document.getElementById('name').value = response.data.UserDetails[0].name;
                    document.getElementById('age').value = response.data.UserDetails[0].dob;
                    document.getElementById('mobile_number').value = response.data.UserDetails[0].mobile_no;
                    document.getElementById('user_type').value = response.data.UserDetails[0].user_type;
                    document.getElementById('city').value = response.data.UserDetails[0].city;
                    document.getElementById('email').value = response.data.UserDetails[0].emailid;
                }

            }
        });
}

function UpdateEmployee(){
    document.getElementById('update').disabled = true;
    var id = document.getElementById('user_id').value;
    var ajaxCall = $.ajax(
        {
            type: 'PUT',
            url: '../userEdit/'+id,
            data: $('#form2').serialize(),
            async: false,
            success: function (response) {
                if(response.statusCode==200){
                    alert(response.data.message);
                    closeModal();
                }
                window.location.href = "/getUsers";
            },
            error: function (error) {
                console.log(error.responseJSON)
                if(error.responseJSON.statusCode==409 || error.responseJSON.statusCode==500){
                    alert(error.responseJSON.message);
                    document.getElementById('update').disabled = false;
                }

            }
        });
}

function closeModal(){
    $('#userEditModal').modal('hide');
}