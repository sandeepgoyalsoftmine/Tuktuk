import * as CustomerLoginEmailMobileDao from "./CustomerLoginEmailMobileDao";
import CustomerLoginEmailMobModel from "./CustomerLoginEmailMobModel";
import * as HttpStatus from "http-status-codes/index";
import bookshelf from "../db";
import crypto from "crypto";
import microtime from "microtime";
import * as UsersDao from "../dao/users";
import Users from "../models/Users";


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