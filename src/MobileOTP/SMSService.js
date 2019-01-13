import {sendSMS} from "./sms";
import * as HttpStatus from "http-status-codes/index";
import * as OTPGeneration from "../OtpForEmail/OTPGeneration";
import * as mailUtil from '../OtpForEmail/mail'
import * as customerDAO from '../SignUpWithEmailVerification/UserDao'
import UserModel from '../SignUpWithEmailVerification/UserModel'
import * as UsersDao from "../dao/users";
import bookshelf from "../db";

export async function sendotp(reqData, token, req){
      if(reqData.mobile_number == undefined || reqData.mobile_number ===""){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'mobile_number should not be blank'};
    }
    if(reqData.mobile_number.length !== 10){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'invalid mobile number'};
    }

    let customerData = await UserModel.fetchCustomerwithToken(token);
    if(customerData[0].length<1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }

    let mobileOtp = await OTPGeneration.otpGenerator();
    let msg = `Use ${mobileOtp}  as your login OTP. OTP is confidential. TUKTUK-Ride never calls you asking for OTP. Sharing it with anyone gives them access to your Account.`;
    console.log("otp   "+ msg);
    let resu = await sendSMS(reqData.mobile_number,msg);
    await bookshelf.transaction(async (t) => {
        await customerDAO.updateRow(customerData[0][0].customer_id, {mobile_otp: mobileOtp,updated_on: new Date()}, t);
    });
    return resu;
}

export async function sendotpEmail(reqData, token, req){
    if(reqData.email === undefined || reqData.email ===""){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'mobile_number should not be blank'};
    }
    let customerData = await UserModel.fetchCustomerwithToken(token);
    if(customerData[0].length<1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }
    let emailOtp = await OTPGeneration.otpGenerator();
    let msg = `Use ${emailOtp}  as your login OTP. OTP is confidential. TUKTUK-Ride never calls you asking for OTP. Sharing it with anyone gives them access to your Account.`;
    console.log("otp   "+ msg);
    let emailSubject = 'TUKTUK: OTP for email Verification.';

    mailUtil.sendMail(emailSubject, msg, reqData.email);

    await bookshelf.transaction(async (t) => {
        await customerDAO.updateRow(customerData[0][0].customer_id, {email_otp: emailOtp,updated_on: new Date()}, t);
    });
    return {
        message:"Otp successfully sent on Email."
    };
}