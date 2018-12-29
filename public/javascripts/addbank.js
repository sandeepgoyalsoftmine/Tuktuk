$(document).ready(function() {
    var combo1 = document.getElementById("bank_name");
    while (combo1.firstChild) {
        combo1.removeChild(combo1.firstChild);
    }
    var option = document.createElement("option");
    option.text = "Loading...";
    combo1.add(option, null);
    $.ajax(
        {
            type: "GET",
            url: "../../banks/getBankList",
            headers: {
                "userID": localStorage.getItem("TUKTUK_TOKEN")
            },
            success: function (response) {
                while (combo1.firstChild) {
                    combo1.removeChild(combo1.firstChild);
                }
                var option = document.createElement("option");
                option.text = "Select";
                combo1.add(option, null);

                for (var j = 0; j < response.data.Banks.length; j++) {
                    var option = document.createElement("option");
                    option.text = response.data.Banks[j].bank_name;
                    option.value = response.data.Banks[j].bank_name;
                    combo1.add(option, null);
                }

            }
        });
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
                        window.location.href = "/bank/getBankDetails";
                    }
                },
                error: function (error) {
                    console.log(error);
                    alert(error.responseJSON.message);
                }
            });
    });
});