import * as UserDao from "./UserDao";
import {generateToken} from "../CustomerFBLogin/CustomerService";
import bookshelf from "../db";
import UserModel from "./UserModel";
import * as HttpStatus from "http-status-codes/index";
import * as OTPGeneration from '../OtpForEmail/OTPGeneration'
import * as mailUtil from '../OtpForEmail/mail';
import * as sms from '../MobileOTP/sms';


export async function createUser(user, device_type,version,res) {
    console.log("token test");
    let token = generateToken(user.userid);
    console.log(JSON.stringify(user)+ "   token " + token);
    let userData = await UserModel.fetchUserWithEmailMobile(user.email, user.mobile_no);

    if (userData[0].length > 0) {
        return {errorCode: HttpStatus.CONFLICT, message: 'Email or mobile already exist'};
    }
    let mobileOtp = await OTPGeneration.otpGenerator();
    let emailOtp = await OTPGeneration.otpGenerator();
    let refe=0;
    if(user.referral_code==="")
        refe = 0;
    else
        refe = parseInt(user.referral_code);
    let newUserId = await bookshelf.transaction(async (t) => {
        let newUsers = await UserDao.createRow({
            user_id: user.userid,
            name: user.name,
            email_id: user.email,
            login_via: device_type,
            gender: user.gender,
            mobile_no: user.mobile_no,
            mobile_otp: mobileOtp,
            email_otp: emailOtp,
            mobile_verified: "0",
            email_verified: "0",
            password: user.passsword,
            refferal: refe,
            last_login: new Date(),
            created_on: new Date(),
            token: token
        }, t);
        return newUsers.userid;
    });
    let body = `Hi ${user.name},<br>Please verify Email with otp, and OTP is ${emailOtp}`;
    // let resu = await sms.sendSMS(user.mobile_no,body);
    let emailSubject = 'TUKTUK: OTP for email Verification.';

    mailUtil.sendMail(emailSubject, body, user.email);
    let usersDetails = await UserModel.fetchUserWithEmailMobile(user.email, user.mobile_no);
    res.setHeader('TUKTUK_TOKEN', token);
    return ({
        CustomerDetails: usersDetails[0][0],
        message: 'OTP is sent to your  Email'
    });

}