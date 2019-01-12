import CustomerModel from "./CustomerModel";
import * as CustomerDAO from "./CustomerDAO";
import bookshelf from "../db";
import crypto from "crypto";
import microtime from "microtime";
import * as HttpStatus from "http-status-codes/index";
import CustomerLoginEmailMobModel from "../CustomerLoginEmailMob/CustomerLoginEmailMobModel";
import {rideStatus} from '../Constants/enum';
export async function registerFbUser(device_type, version, reqData,deviceToken,res)
{
    let duplicate = await checkDuplicateEmail(reqData.user);
    console.log("duplicate value "+duplicate);
    if(!duplicate)
    {

        let result= await createCustomer(device_type,version, reqData.user,deviceToken,res);
        return result;
    }
    else
    {
        let result= await loginEmail(device_type, version, reqData.user,deviceToken,res);
        return result;
    }
}

export async function checkDuplicateEmail(user) {
    console.log("userInfo "+user.userid);
    let data = await CustomerModel.fetchCustomerDetailByUserID(user);
    if (data[0].length > 0) {
        return true;
    }
    return false;
}

export async function createCustomer(device_type,version, user,deviceToken, res) {
    console.log("token test");
    let token = generateToken(user.userid);
    console.log("token "+token)
    let newUserId = await bookshelf.transaction(async(t) => {
        let newUsers = await CustomerDAO.createRow({
            user_id : user.userid,
            name : user.name,
            email_id : user.email,
            login_via: device_type,
            gender : user.gender,
            last_login : new Date(),
            created_on: new Date(),
            photo_url: user.photos,
            device_id: deviceToken,
            token : token
        }, t);
        return newUsers.userid;
    });
    res.setHeader('TUKTUK_TOKEN', token);
    let usersDetails = await CustomerModel.fetchCustomerDetailByUserID(user);
    return ({
        CustomerDetails : usersDetails[0][0],
        message : 'User Created'
    });
}

export async function loginEmail(device_type,version, user,deviceToken, res) {
    let data = await CustomerModel.fetchCustomerDetailByUserID(user);
console.log("customer fetch details  "+ JSON.stringify(data[0][0]));
    const token = generateToken(user.userid);
    await bookshelf.transaction(async(t) => {
        await CustomerDAO.updateRow(data[0][0].customer_id, {device_id: deviceToken,last_login: new Date(), token : token, login_via : device_type, user_id: user.userid}, t);
    });
    let usersDetails = await CustomerModel.fetchCustomerDetailBycustomer_ID(data[0][0].customer_id);

    res.setHeader('TUKTUK_TOKEN', token);

    return ({
        CustomerDetails : usersDetails[0][0],
        message : 'Login Successfully'
    });
}

export async function customerHistory(token){
    let userData = await CustomerLoginEmailMobModel.fetchCustomerByToken(token);
    if (userData[0].length < 1) {
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }
    let customerHistory = await CustomerLoginEmailMobModel.fetchCustomerHistory(userData[0][0].customer_id);
    for(let i=0; i< customerHistory[0].length;i++){
        if(customerHistory[0][i].status == 4){
            delete customerHistory[0][i].status;
            customerHistory[0][0].status = rideStatus.RideCompleted;
        }
        if(customerHistory[0][i].status == 3){
            delete customerHistory[0][i].status;
            customerHistory[0][0].status = rideStatus.RideProcessing;
        }
        if(customerHistory[0][i].status == 2){
            delete customerHistory[0][i].status;
            customerHistory[0][0].status = rideStatus.RideBooked;
        }
        let paymentDetails = {
            payment_method : customerHistory[0][i].payment_method,
            final_amount: customerHistory[0][i].final_cost,
            total_amount: customerHistory[0][i].total_cost,
            discount: customerHistory[0][i].discount,
            gst: customerHistory[0][i].gst
        }
        let driverDetails = {
            driver_id: customerHistory[0][i].userid,
            name: customerHistory[0][i].name,
            driver_pic:customerHistory[0][i].driver_pic,
            rating: customerHistory[0][i].Rating,
            vehicle_company: customerHistory[0][i].Company,
            vehicle_model:customerHistory[0][i].model,
            vehicle_number: customerHistory[0][i].vehicle_number
        }
        customerHistory[0][i].payment_details = paymentDetails;
        customerHistory[0][i].driver_details = driverDetails;
        delete customerHistory[0][i].Company;
        delete customerHistory[0][i].model;
        delete customerHistory[0][i].vehicle_number;
        delete customerHistory[0][i].payment_method;
        delete customerHistory[0][i].final_cost;
        delete customerHistory[0][i].total_cost;
        delete customerHistory[0][i].discount;
        delete customerHistory[0][i].userid;
        delete customerHistory[0][i].name;
        delete customerHistory[0][i].driver_pic;
        delete customerHistory[0][i].Rating;

    }
    return {
        customerHistory : customerHistory[0]
    }
}

export function generateToken(userid) {
    let dbhash = microtime.now().toString() + userid;
    return crypto.createHash('md5').update(dbhash).digest('hex');
}

export async function getCustomers(){

}