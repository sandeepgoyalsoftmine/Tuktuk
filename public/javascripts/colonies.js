function getData()
{
    var combo = document.getElementById("colonyList");
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
// function setuserName(user){
//     // alert(user);
//     document.getElementById("userList").value = user;
// }

$(document).ready(function() {
    $("#form1").submit(function (e) {
        e.preventDefault();
        var ajaxCall = $.ajax(
            {
                type: 'POST',
                url: '../colonyAssignment/create',
                data: $('#form1').serialize(),
                async: false,
                success: function (response) {
                    if(response.statusCode==200){
                        alert(response.data.message);
                        closeModal();
                    }
                    window.location.href = "/colonyAssignment/getSelectedData?selectedUser="+document.getElementById('userName').value;
                },
                error: function (error) {

                    console.log(error);
                }
            });
    });
});



function getSelectedData(){
//alert(document.getElementById('userList').value)
    if(document.getElementById('userList').value ==900){

    }else
        window.location.href = "/colonyAssignment/getSelectedData?selectedUser="+document.getElementById('userList').value;
}
function removeAssignment(id){

    $.ajax(
        {
            type: "POST",
            url: "/colonyAssignment/delete/"+id,
            headers: {
                "userID":localStorage.getItem("userID")
            },
            success: function(response)
            {
                alert("Delete Assignment successfully");
                window.location.href = "/colonyAssignment/getSelectedData?selectedUser="+document.getElementById('userList').value;

            }
        });
}
function closeModal(){
    $('#colonymodal').modal('hide');
}

function setUserName(){
    var user = document.getElementById("userList").value;
    // alert(user)
    if(user==900){

    }else
        document.getElementById("userName").value=user;
}