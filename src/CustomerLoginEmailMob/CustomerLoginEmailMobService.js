import * as CustomerLoginEmailMobileDao from "./CustomerLoginEmailMobileDao";
import CustomerLoginEmailMobModel from "./CustomerLoginEmailMobModel";
import * as HttpStatus from "http-status-codes/index";
import bookshelf from "../db";
import crypto from "crypto";
import microtime from "microtime";
import ReferalModel from "../SignUpWithEmailVerification/ReferalModel";



export async function  login(deviceType, version, reqData, deviceToken, res) {
    console.log("reqData  "+ JSON.stringify(reqData));
    let customerData = await CustomerLoginEmailMobModel.fetchCustomerDetailByEmailOrMobile(reqData.userID);
    console.log(JSON.stringify(reqData)+"    customerData "+JSON.stringify(customerData[0]));
    if (customerData[0].length < 1) {
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Customer not exists'};
    }
    if (customerData[0][0].password != reqData.Password) {
        return {errorCode: HttpStatus.UNAUTHORIZED, message: 'Incorrect password'};
    }
    if(customerData[0].length == 1) {
        const token = generateToken(reqData.userID);
        await bookshelf.transaction(async (t) => {
            await CustomerLoginEmailMobileDao.updateRow(customerData[0][0].customer_id, {device_id: deviceToken,token: token, last_login: new Date(), login_via: deviceType}, t);
        });
        let customerDetails = await CustomerLoginEmailMobModel.fetchCustomerByToken(token);
        res.setHeader('TUKTUK_TOKEN', token);
        return {message: 'Login Successfully',
            CustomerDetails : customerDetails[0][0]};
    }else{
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Already Login'};
    }
}
export async function updateDeviceToken(token, device_id){
    let userData = await CustomerLoginEmailMobModel.fetchCustomerByToken(token);
    if(userData.length < 1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }
    await bookshelf.transaction(async (t) => {
        await CustomerLoginEmailMobileDao.updateRow(userData[0][0].customer_id, {
            device_id: device_id,
            updated_on: new Date()
        }, t);
    });
    return {message: 'Updated Successfully'};
}

export function generateToken(userid) {
    let dbhash = microtime.now().toString() + userid;
    return crypto.createHash('md5').update(dbhash).digest('hex');
}

export async function getReferalCount(token){
    let customerData = await CustomerLoginEmailMobModel.fetchCustomerByToken(token);
    if(customerData[0].length<1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message: 'Invalid Token'};
    }
    let referalCount = await ReferalModel.fetchReferalCountByCustomerId(customerData[0][0].customer_id);
    return {
        referalCount: referalCount[0][0].count
    }
}