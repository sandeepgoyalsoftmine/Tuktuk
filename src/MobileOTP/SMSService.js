import {sendSMS} from "./sms";
import * as HttpStatus from "http-status-codes/index";
import * as OTPGeneration from "../OtpForEmail/OTPGeneration";
import CustomerLoginEmailMobModel from "../CustomerLoginEmailMob/CustomerLoginEmailMobModel";
export async function sendotp(reqData, token, req){
    let customerData = await CustomerLoginEmailMobModel.fetchCustomerByToken(token);
    if(customerData[0].length<1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message: 'token is not valid'};
    }
    console.log(customerData[0][0].mobile_no+"      reqData.mobile_number.length   "+customerData[0][0].mobile_no.length)
    // if(reqData.mobile_number == undefined || reqData.mobile_number ===""){
    //     return {errorCode: HttpStatus.UNAUTHORIZED, message : 'mobile_number should not be blank'};
    // }
    // if(reqData.mobile_number.length !== 10){
    //     return {errorCode: HttpStatus.UNAUTHORIZED, message : 'invalid mobile number'};
    // }
    let mobileOtp = await OTPGeneration.otpGenerator();
    let msg = `Use ${mobileOtp}  as your login OTP. OTP is confidential. TUKTUK-Ride never calls you asking for OTP. Sharing it with anyone gives them access to your Account.`;
    console.log("otp   "+ msg);
    let resu = await sendSMS(reqData.mobile_number,msg);
    console.log("resulkt     "+ resu);
    return {
        message: "Successfully sent"
    }
}