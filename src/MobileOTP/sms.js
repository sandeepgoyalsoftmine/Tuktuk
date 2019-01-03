import request from 'request';
const authkey = 'MWJlYjg4ZTFmZDF';

export async function sendSMS(mobileNumber, msg) {

    let sender = 'RNDSMS';
    let type = "1";
    let route = "2";
    let url = 'http://roundsms.com/api/sendhttp.php?';
    let path = url + 'authkey=' + authkey + '&mobiles=' + mobileNumber + '&message=' + msg + '&sender=' + sender + '&type=' + type + '&route=' + route;
    let message;
    return new Promise((resolve, reject) => {
        request(path, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
                var data = body;
                console.log("dataaaaa   " + body.msg_id);
                message = "Message Sent";
            } else {
                message =  error;
            }
        });
        return resolve(message);
    });
}