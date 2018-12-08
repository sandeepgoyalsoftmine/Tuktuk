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