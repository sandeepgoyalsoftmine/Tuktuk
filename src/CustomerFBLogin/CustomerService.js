import CustomerModel from "./CustomerModel";
import * as CustomerDAO from "./CustomerDAO";
import bookshelf from "../db";
import crypto from "crypto";
import microtime from "microtime";

export async function registerFbUser(reqData,res)
{
    let duplicate = await checkDuplicateEmail(reqData.user);
    console.log("duplicate value "+duplicate);
    if(!duplicate)
    {

        let result= await createCustomer(reqData.user,res);
        return result;
    }
    else
    {
        let result= await loginEmail(reqData.user,res);
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

export async function createCustomer(user,res) {
    console.log("token test");
    let token = generateToken(user.userid);
    console.log("token "+token)
    let newUserId = await bookshelf.transaction(async(t) => {
        let newUsers = await CustomerDAO.createRow({
            user_id : user.userid,
            name : user.name,
            email_id : user.email,
            gender : user.gender,
            last_login : new Date(),
            created_on: new Date(),
            photo_url: user.photos,
            token : token
        }, t);
        return newUsers.userid;
    });
    res.setHeader('TUKTUK_TOKEN', token);
    let usersDetails = await CustomerModel.fetchCustomerDetailByUserID(user.userid);
    return ({
        CustomerDetails : usersDetails[0][0],
        message : 'User Created'
    });
}

export async function loginEmail(user, res) {
    const token = generateToken(user.userid);
    await bookshelf.transaction(async(t) => {
        await CustomerDAO.updateRow(user.userid, {last_login: new Date(), token : token}, t);
    });
    let usersDetails = await CustomerModel.fetchCustomerDetailByUserID(user.userid);

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