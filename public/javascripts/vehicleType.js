$(document).ready(function() {

    $("#form1").submit(function (e) {
        document.getElementById('save').disabled = true;
        e.preventDefault();
        var ajaxCall = $.ajax(
            {
                type: 'POST',
                url: '../vehicle/create',
                data: $('#form1').serialize(),
                async: false,
                success: function (response) {
                    if(response.statusCode==200){
                        alert(response.data.message);
                        closeModal();
                    }
                    window.location.href = "/vehicle";
                },
                error: function (error) {
                        console.log("code "+error.responseJSON)

                            alert(error.responseJSON.message);
                            document.getElementById('save').disabled = false;


                    }
                });
    });
});
function setEditVehicleType(vehicleType_id){
    $.ajax(
        {
            type: "GET",
            url: "/vehicle/view/"+vehicleType_id,
            headers: {
                "userID":localStorage.getItem("OneSS_TOKEN")
            },
            success: function(response)
            {
                console.log(response);
                document.getElementById('vehicle_type_id').value = response.data.VehicleTypes[0].vehicle_id;
                document.getElementById('vehicleType').value = response.data.VehicleTypes[0].vehicle_type;
            }
        });
}
function UpdateVehicleType(){
    document.getElementById('update').disabled = true;
    var id = document.getElementById('vehicle_type_id').value;
    var ajaxCall = $.ajax(
        {
            type: 'PUT',
            url: '../vehicle/edit/'+id,
            data: $('#form2').serialize(),
            async: false,
            success: function (response) {
                if(response.statusCode==200){
                    alert(response.data.message);
                    closeModal();
                }
                window.location.href = "/vehicle";
            },
            error: function (error) {
                console.log(error.responseJSON)

                    alert(error.responseJSON.message);
                    document.getElementById('update').disabled = false;


            }
        });
}
function deleteVehicleType(vehicl_type_id){
    confirm("are you sure you want to delete, related items also will delete itself");

}
function closeModal(){
    $('#boardModal').modal('hide');
}