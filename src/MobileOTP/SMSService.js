import {sendSMS} from "./sms";
import * as HttpStatus from "http-status-codes/index";
import * as OTPGeneration from "../OtpForEmail/OTPGeneration";
export async function sendotp(reqData, token, req){
    if(reqData.mobile_number == undefined || reqData.mobile_no ===""){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'mobile_number should not be blank'};
    }

    let mobileOtp = await OTPGeneration.otpGenerator();
    let msg = "Your verification code is "+ mobileOtp;
    console.log("otp   "+ msg);
    let resu = await sendSMS(reqData.mobile_number,msg);
    console.log("resulkt     "+ resu);
    return {
        message: resu
    }
}