import request from 'request';
const authkey = 'd4adccd2-8f41-4e4c-8a3a-20740e9d7f52';


export async function sendSMS(mobileNumber, msg) {
    let sender = 'TUKTUK';
    let url = 'http://sms.hspsms.com/sendSMS?username=tuktukride';
    let path = url + '&message=' + msg+ '&sendername=' + sender+'&smstype=TRANS&numbers='+mobileNumber+ '&apikey=' + authkey;
    let result = await sendSMS1(mobileNumber, msg, path);
    return result;
}

export async function sendSMS1(mobileNumber, msg, path) {
    let message;
    return new Promise((resolve, reject) => {
        request(path, function (error, response, body) {
            if (response.statusCode == 200) {
                let resp = JSON.parse(response.body);
                message = "Message Sent";
            } else {

                message =  error;
            }
            return resolve(message);
        });

    });
}