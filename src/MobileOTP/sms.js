import request from 'request';
const authkey = 'd4adccd2-8f41-4e4c-8a3a-20740e9d7f52';

export async function sendSMS(mobileNumber, msg) {

    let sender = 'TUKTUK';
    let url = 'http://sms.hspsms.com/sendSMS?username=tuktukride';
    let path = url + '&message=' + msg+ '&sendername=' + sender+'&smstype=TRANS&numbers='+mobileNumber+ '&apikey=' + authkey;
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