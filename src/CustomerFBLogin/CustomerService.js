import CustomerModel from "./CustomerModel";
import * as CustomerDAO from "./CustomerDAO";
import bookshelf from "../db";
import crypto from "crypto";
import microtime from "microtime";
import * as HttpStatus from "http-status-codes/index";

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

export function generateToken(userid) {
    let dbhash = microtime.now().toString() + userid;
    return crypto.createHash('md5').update(dbhash).digest('hex');
}