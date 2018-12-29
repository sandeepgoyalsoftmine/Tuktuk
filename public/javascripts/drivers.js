function editDoc(form){
    var data = new FormData(form);
    var driver_id = document.getElementById("driver_id").value;
    var ajaxCall = $.ajax(
        {
            type: 'PUT',
            url: '/editDoc/'+driver_id,
            data: data,
            dataType: 'json',
            cache: false,
            processData: false,
            contentType: false,
            success: function (data, textStatus, request) {
                console.log(data);
                if(data.statusCode == 200 ) {
                    alert(data.data.message);

                }
            },
            error: function (error) {
                console.log(error);
                if(data.statusCode == 409 || data.statusCode=== '409' || data.statusCode == 400 || data.statusCode=== '400')
                    alert(error.responseJSON.message);
                if(data.statusCode == 404 || data.statusCode=== '404')
                    alert(error.responseJSON.message);
            }
        });
}

function showPicBlog(){
    document.getElementById("profileDiv").style.display="block";
}
function savePicBlog() {
    document.getElementById("profileDiv").style.display="none";
    var form = $('#editDriverPic')[0];
    editDoc(form);
}
function showDrivingLicenseBlog(){
    document.getElementById("drivingLicenseDiv").style.display="block";
}
function saveDrivingLicenseBlog() {
    document.getElementById("drivingLicenseDiv").style.display="none";
    var form = $('#editDLPic')[0];
    editDoc(form);
}
function showPancardBlog(){
    document.getElementById("pancardDiv").style.display="block";

}
function savePancardBlog() {
    document.getElementById("pancardDiv").style.display="none";
    var form = $('#editPancarPic')[0];
    editDoc(form);

}
function showRCBlog(){
    document.getElementById("registrationCertificateDiv").style.display="block";
}
function saveRCBlog() {
    document.getElementById("registrationCertificateDiv").style.display="none";
    var form = $('#editRcPic')[0];
    editDoc(form);
}

function saveMotorBlog() {
    document.getElementById("motorInsurenceDiv").style.display="none";
    var form = $('#editMotorPic')[0];
    editDoc(form);
}
function showMotorBlog(){
    document.getElementById("motorInsurenceDiv").style.display="block";
}
function showPoliceVerificationBlog(){
    document.getElementById("policeVerificationDiv").style.display="block";
}
function savePoliceVerificationBlog() {
    document.getElementById("policeVerificationDiv").style.display="none";
    var form = $('#editPVPic')[0];
    editDoc(form);
}

function showAdharBlog(){
    document.getElementById("adharCardDiv").style.display="block";
}
function saveAdharBlog() {
    document.getElementById("adharCardDiv").style.display="none";
    var form = $('#editAdharPic')[0];
    editDoc(form);
}

function updatePic(input, field) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#'+field)
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function addBankDetails(userid){
    window.location.href = "bank/addBank/"+userid;
}