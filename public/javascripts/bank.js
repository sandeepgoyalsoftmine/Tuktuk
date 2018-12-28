var driverArray = [];
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
                        closeModal1();
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
                document.getElementById('bankid').value = response.data.BankDetails[0].bankid;
                document.getElementById('nameD').value = response.data.BankDetails[0].name;
                document.getElementById('mobilenumber').value = response.data.BankDetails[0].mobile_no;
                document.getElementById('emailid').value = response.data.BankDetails[0].emailid;
                document.getElementById('bankname').value = response.data.BankDetails[0].bank_name;
                document.getElementById('accountholder').value = response.data.BankDetails[0].account_holder;
                document.getElementById('accountno').value = response.data.BankDetails[0].account;
                document.getElementById('ifsccode').value = response.data.BankDetails[0].ifsc_code;

            }
        });

}

function UpdateBankDetails(){
    document.getElementById('update').disabled = true;
    var id = document.getElementById('bankid').value;
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
$(document).ready(function() {
    var combo = document.getElementById("user_id");
    while (combo.firstChild) {
        combo.removeChild(combo.firstChild);
    }
    var option = document.createElement("option");
    option.text = "Loading...";
    combo.add(option, null);
    $.ajax(
        {
            type: "GET",
            url: "../getDriverList",
            headers: {
                "userID": localStorage.getItem("TUKTUK_TOKEN")
            },
            success: function (response) {
                while (combo.firstChild) {
                    combo.removeChild(combo.firstChild);
                }
                var option = document.createElement("option");
                option.text = "Select";
                combo.add(option, null);
                for (var j = 0; j < response.data.driverList.length; j++) {
                    var option = document.createElement("option");
                    option.text = response.data.driverList[j].name + "  (" + response.data.driverList[j].mobile_no + ")";
                    option.value = response.data.driverList[j].userid;
                    combo.add(option, null);
                    let ob = {};
                    ob.userid = response.data.driverList[j].userid;
                    ob.name = response.data.driverList[j].name;
                    ob.mobile_no= response.data.driverList[j].mobile_no;
                    ob.emailid = response.data.driverList[j].emailid;
                    driverArray.push(ob);
                }

            }
        });
});
function setDriverValues(){
    var user_id=document.getElementById('user_id').value;
    for(let j=0;j< driverArray.length;j++){
        if(user_id == driverArray[j].userid){
            document.getElementById('name').value=driverArray[j].name;
            document.getElementById('mobile_number').value=driverArray[j].mobile_no;
            document.getElementById('email').value=driverArray[j].emailid;
            document.getElementById('name').value=driverArray[j].name;
        }
    }
}
function closeModal(){
    $('#bankEditModal').modal('hide');
}
function closeModal1(){
    $('bankAddModal').modal('hide');
}