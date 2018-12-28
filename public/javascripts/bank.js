$(document).ready(function() {
    $("#form1").submit(function (e) {
        e.preventDefault();
        var form = $('#form1')[0];
        var ajaxCall = $.ajax(
            {
                type: 'POST',
                url: '../../bank/create',
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

function setBankDetails(bankid){
    $.ajax(
        {
            type: "GET",
            url: "../bank/view/" + bankid,
            headers: {
                "userID": localStorage.getItem("TUKTUK_TOKEN")
            },
            success: function (response) {
                document.getElementById('bank_id').value = response.data.BankDetails[0].bankid;
                document.getElementById('name').value = response.data.BankDetails[0].name;
                document.getElementById('mobile_number').value = response.data.BankDetails[0].mobile_no;
                document.getElementById('email').value = response.data.BankDetails[0].emailid;
                document.getElementById('bank_name').value = response.data.BankDetails[0].bank_name;
                document.getElementById('account_holder').value = response.data.BankDetails[0].account_holder;
                document.getElementById('account_no').value = response.data.BankDetails[0].account;
                document.getElementById('ifsc_code').value = response.data.BankDetails[0].ifsc_code;
            }
        });

}

function UpdateBankDetails(){
    document.getElementById('update').disabled = true;
    alert(id);
    var ajaxCall = $.ajax(
        {
            type: 'PUT',
            url: '../bank/edit/'+id,
            data: $('#form2').serialize(),
            async: false,
            success: function (response) {
                if(response.statusCode==200){
                    alert(response.data.message);
                    closeModal();
                }
                window.location.href = "/bank/getBankDetails";
            },
            error: function (error) {
                console.log(error.responseJSON)

                alert(error.responseJSON.message);
                document.getElementById('update').disabled = false;


            }
        });
}
function closeModal(){
    $('#bankEditModal').modal('hide');
}