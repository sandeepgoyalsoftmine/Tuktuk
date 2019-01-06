import otpGenrator from 'otp-generator';
import UserModel from "../SignUpWithEmailVerification/UserModel";
import * as HttpStatus from "http-status-codes/index";

import * as UsersDao from "../SignUpWithEmailVerification/UserDao";
import bookshelf from "../db";

export async function otpGenerator(){
    return otpGenrator.generate(6, {alphabets :false, upperCase: false, specialChars: false });
}
export async function otpVerifyForEmail(reqData, token, devicetype, version, res){
    console.log("reqData   ")
    let otpVerifier = await UserModel.fetchOtpForEmail(token, reqData.otp);
    console.log("after query  "+JSON.stringify(otpVerifier[0]));
    if(otpVerifier[0].length<1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message: 'OTP for email is not valid'};
    }
    await bookshelf.transaction(async (t) => {
        await UsersDao.updateRow(otpVerifier[0][0].customer_id, {email_verified: "1"}, t);
    });
    return {
        message: "Otp successfully verified for email"
    }
}
export async function otpVerifyForMobile(reqData, token, devicetype, version, res){
    console.log("reqData   ")
    let otpVerifier = await UserModel.fetchOtpForMobile(token, reqData.otp);
    console.log("after query  "+JSON.stringify(otpVerifier[0]));
    if(otpVerifier[0].length<1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message: 'OTP for email is not valid'};
    }
    await bookshelf.transaction(async (t) => {
        await UsersDao.updateRow(otpVerifier[0][0].customer_id, {mobile_verified: "1"}, t);
    });
    return {
        message: "Otp successfully verified for mobile"
    }
}
