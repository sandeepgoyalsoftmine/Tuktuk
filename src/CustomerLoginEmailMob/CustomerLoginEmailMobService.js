import * as CustomerLoginEmailMobileDao from "./CustomerLoginEmailMobileDao";
import CustomerLoginEmailMobModel from "./CustomerLoginEmailMobModel";
import * as HttpStatus from "http-status-codes/index";
import bookshelf from "../db";
import crypto from "crypto";
import microtime from "microtime";


export async function  login(deviceType, version, reqData, res) {
    let customerData = await CustomerLoginEmailMobModel.fetchCustomerDetailByEmailOrMobile(reqData.userid);
    console.log("customerData "+JSON.stringify(customerData[0]));
    if (customerData[0].length < 1) {
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Customer not exists'};
    }
    if (customerData[0][0].password != reqData.password) {
        return {errorCode: HttpStatus.UNAUTHORIZED, message: 'Incorrect password'};
    }
    if(customerData[0].length == 1) {
        const token = generateToken(reqData.userid);
        await bookshelf.transaction(async (t) => {
            await CustomerLoginEmailMobileDao.updateRow(customerData[0][0].customer_id, {token: token, last_login: new Date(), login_via: deviceType}, t);
        });
        let customerDetails = await CustomerLoginEmailMobModel.fetchCustomerByToken(token);
        res.setHeader('TUKTUK_TOKEN', token);
        return {message: 'Login Successfully',
            CustomerDetails : customerDetails[0][0]};
    }else{
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Already Login'};
    }
}

export function generateToken(userid) {
    let dbhash = microtime.now().toString() + userid;
    return crypto.createHash('md5').update(dbhash).digest('hex');
}