$(document).ready(function() {
    $("#login-form").submit(function (e) {
        e.preventDefault();
        var ajaxCall = $.ajax(
            {
                type: 'POST',
                url: $('#login-form').attr('action'),
                data: $('#login-form').serialize(),
                async: false,
                success: function (data, textStatus, request) {
                    if(data.statusCode==400){
                        alert(data.message)
                    }
                    if(data.statusCode==200) {
                        localStorage.setItem("TUKTUK_TOKEN", request.getResponseHeader('TUKTUK_TOKEN'));
                        window.location.href = "/tracking";
                    }

                },
                error: function (error) {
                    console.log("in errrorrrr")
                    console.log(error);
                    alert(error.responseJSON.message);
                }
            });
    });
});

