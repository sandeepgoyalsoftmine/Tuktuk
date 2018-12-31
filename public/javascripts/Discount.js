$(document).ready(function() {

    $("#form1").submit(function (e) {
        e.preventDefault();
        var form = $('#form1')[0];
        var ajaxCall = $.ajax(
            {
                type: 'POST',
                url: '../discount/create',
                data: $('#form1').serialize(),
                async: false,
                success: function (data, textStatus, request) {
                    console.log(data);
                    if(data.statusCode == 409 || data.statusCode=== '409'|| data.statusCode == 200 ) {
                        alert(data.data.message);
                        document.getElementById("form1").reset();
                        closeModal1();
                        window.location.href = "../discount";
                    }
                },
                error: function (error) {
                    console.log(error);
                    alert(error.responseJSON.message);
                }
            });
    });
});

function setRefferal(refferal_id){
    $.ajax(
        {
            type: "GET",
            url: "../discount/view/"+refferal_id,
            headers: {
                "userID": localStorage.getItem("TUKTUK_TOKEN")
            },
            success: function (response) {
                document.getElementById('discount_id').value = response.data.Discount[0].discount_id;
                document.getElementById('status').value = response.data.Discount[0].status;
                document.getElementById('discountridekm').value = response.data.Discount[0].discount_ride_km;

            }
        });

}

function UpdateDiscount(){
    document.getElementById('update').disabled = true;
    var id = document.getElementById('discount_id').value;
    var ajaxCall = $.ajax(
        {
            type: 'PUT',
            url: '../discount/edit/'+id,
            data: $('#form2').serialize(),
            async: false,
            success: function (response) {
                if(response.statusCode==200){
                    alert(response.data.message);
                    closeModal();
                }
                window.location.href = "../discount";
            },
            error: function (error) {
                console.log(error.responseJSON)

                alert(error.responseJSON.message);
                document.getElementById('update').disabled = false;
            }
        });
}
function closeModal1(){
    $('bankAddModal').modal('hide');
}
function closeModal(){
    $('#bankEditModal').modal('hide');
}