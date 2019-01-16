$(document).ready(function() {
    $("#form1").submit(function (e) {
        e.preventDefault();
        var form = $('#form1')[0];
        var data = new FormData(form);
        var ajaxCall = $.ajax(
            {
                type: 'POST',
                url: '/vehicles/create',
                data: data,
                dataType: 'json',
                cache: false,
                processData: false,
                contentType: false,
                success: function (data, textStatus, request) {
                    console.log(data);
                    if(data.statusCode == 409 || data.statusCode=== '409'|| data.statusCode == 200 ) {
                        alert(data.data.message);
                        window.location.href = "/vehicles";
                    }
                },
                error: function (error) {
                    console.log(error);
                    alert(error.responseJSON.message);
                }
            });
    });
});
function setVehicleDetails(vehicleId){
    alert(vehicleId);
    $.ajax(
        {
            type: "GET",
            url: "../vehicles/view/"+vehicleId,
            headers: {
                "userID": localStorage.getItem("TUKTUK_TOKEN")
            },
            success: function (response) {
                console.log("response"+ response);
                document.getElementById('vehicle_Type').value = response.data.VehicleDetails[0].vehicle_type;
                document.getElementById('make').value = response.data.VehicleDetails[0].make;
                document.getElementById('model').value = response.data.VehicleDetails[0].model;
                document.getElementById('vehicle_number').value = response.data.VehicleDetails[0].vehicle_number;
                document.getElementById('rc_no').value = response.data.VehicleDetails[0].rc_no;
                document.getElementById('permitNo').value = response.data.VehicleDetails[0].permit_no;
                document.getElementById('insuranceNo').value = response.data.VehicleDetails[0].insurance_no;
                document.getElementById('driverName').value = response.data.VehicleDetails[0].name;
                document.getElementById('vehicle_id').value = response.data.VehicleDetails[0].vehicle_id;
            }
        });
}

function UpdateVehicle(){

    document.getElementById('update').disabled = true;
    var id = document.getElementById('vehicle_id').value;
    var ajaxCall = $.ajax(
        {
            type: 'PUT',
            url: '../vehicles/editVehicle/'+id,
            data: $('#form2').serialize(),
            async: false,
            success: function (response) {
                if(response.statusCode==200){
                    alert(response.data.message);
                    closeEditModal();
                }
                window.location.href = "/vehicles/getVehicle";
            },
            error: function (error) {
                console.log(error.responseJSON)

                alert(error.responseJSON.message);
                document.getElementById('update').disabled = false;


            }
        });
}

function closeEditModal(){
    $('#vehcileEditModal').modal('hide');
}