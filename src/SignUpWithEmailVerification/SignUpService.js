import * as UserDao from "./UserDao";
import {generateToken} from "../CustomerFBLogin/CustomerService";
import bookshelf from "../db";
import UserModel from "./UserModel";
import * as HttpStatus from "http-status-codes/index";
import * as OTPGeneration from '../OtpForEmail/OTPGeneration'
import RefferalModel from '../models/RefferalModel';
import * as sms from '../MobileOTP/sms';
import * as ReferalDao from './ReferalDao'


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
    if(user.referral_code===undefined){
        if(user.refferal_code==="")
            refe = 0;
        else
            refe = parseInt(user.refferal_code);
    }
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
            refferal: parseInt('91'+user. mobile_no),
            last_login: new Date(),
            created_on: new Date(),
            token: token
        }, t);
        return newUsers.id;

    });
    console.log("after creation" + newUserId);
    if(refe!=0){
        let discount = await RefferalModel.fetchRefferalByActive();
        let referredBy  =await UserModel.fetchCustomerWithRefferalCode(refe);

        if(referredBy[0].length>0) {
            console.log("reffered by "+ referredBy[0][0].customer_id);
            console.log(" found");
            let refferalID = await bookshelf.transaction(async (t) => {
                let refferal = await ReferalDao.createRow({
                    reffered: newUserId,
                    refferedby: referredBy[0][0].customer_id,
                    discount_id: discount[0][0].discount_id,
                    created_on: new Date()
                })
            });
            refferalID = await bookshelf.transaction(async (t) => {
                let refferal = await ReferalDao.createRow({
                    refferedby: newUserId ,
                    discount_id: discount[0][0].discount_id,
                    created_on: new Date()
                })
            });

        }else{
            console.log("not found");
            let refferalID = await bookshelf.transaction(async (t) => {
                let refferal = await ReferalDao.createRow({
                    refferedby: newUserId ,
                    discount_id: discount[0][0].discount_id,
                    created_on: new Date()
                })
            });
        }
    }
    console.log("all creation");

    let msg = `Use ${mobileOtp}  as your login OTP. OTP is confidential. TUKTUK-Ride never calls you asking for OTP. Sharing it with anyone gives them access to your Account.`;
    let resu = await sms.sendSMS(user.mobile_no,msg);
    // let emailSubject = 'TUKTUK: OTP for email Verification.';
    //
    // mailUtil.sendMail(emailSubject, body, user.email);
    let usersDetails = await UserModel.fetchUserWithEmailMobile(user.email, user.mobile_no);
    res.setHeader('TUKTUK_TOKEN', token);
    return ({
        CustomerDetails: usersDetails[0][0],
        message: 'OTP is sent to your  Mobile'
    });

}