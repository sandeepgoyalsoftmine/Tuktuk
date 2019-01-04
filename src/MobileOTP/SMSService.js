import {sendSMS} from "./sms";
import * as HttpStatus from "http-status-codes/index";
import * as OTPGeneration from "../OtpForEmail/OTPGeneration";
export async function sendotp(reqData, token, req){
    console.log(reqData.mobile_number+"      reqData.mobile_number.length   "+reqData.mobile_number.length)
    if(reqData.mobile_number == undefined || reqData.mobile_number ===""){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'mobile_number should not be blank'};
    }
    if(reqData.mobile_number.length !== 10){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'invalid mobile number'};
    }
    let mobileOtp = await OTPGeneration.otpGenerator();
    let msg = "Your verification code is "+ mobileOtp;
    console.log("otp   "+ msg);
    let resu = await sendSMS(reqData.mobile_number,msg);
    console.log("resulkt     "+ resu);
    return {
        message: "Successfully sent"
    }
}