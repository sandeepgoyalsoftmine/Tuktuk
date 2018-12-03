import Users from '../models/Users';
import * as UsersDao from '../dao/users';
import microtime from 'microtime';
import crypto from 'crypto';
import bookshelf from '../db';
import * as HttpStatus from "http-status-codes/index";
import  * as LoginHistoryDao from '../dao/LoginHistoryDao';

export async function  login(reqData, res) {
    let userData = await Users.checkLogin(reqData.userID);
    console.log("userDatsa "+JSON.stringify(userData[0]))
    if (userData[0].length < 1) {
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'User not exists'};
    }
    if (userData[0][0].password != reqData.password) {
        return {errorCode: HttpStatus.UNAUTHORIZED, message: 'Incorrect password'};
    }
    if(userData[0].length == 1 ) {
        const token = generateToken(reqData.userid);
        await bookshelf.transaction(async (t) => {
            await UsersDao.updateRow(userData[0][0].userid, {token: token, last_login: new Date()}, t);
        });
        let newUserId = await bookshelf.transaction(async(t) => {
            let newUsers = await LoginHistoryDao.createRow({
                emailid : reqData.userID,
                in_time: new Date(),
                userid: userData[0][0].userid
            }, t);

            return newUsers.id;
        });
        res.setHeader('TUKTUK_TOKEN', token);
        return {message: 'Login Successfully'};
    }else{
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Already Login'};
    }
}

export async function getAttendance(token,req)
{
    let userData = await Users.fetchUserByToken(token);
    if(userData[0] < 1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }
    let att = userData[0][0].status == 1? userData[0][0].in_time :userData[0][0].out_time

    let obj = {
        emialid: userData[0][0].emailid,
        attendance: userData[0][0].status,
        time:att
    }
    return obj;

}
export async function markAttendance(reqData, token){
    let userData = await Users.fetchUserByToken(token);
    if (userData[0].length < 1) {
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }
    if(parseInt(userData[0][0].status) == parseInt(reqData.attendance)){
        if(parseInt(userData[0][0].status) == 1)
            return {errorCode: HttpStatus.CONFLICT, message : 'Already punch in'};
        else
            return {errorCode: HttpStatus.CONFLICT, message : 'Already punch out'};
    }
    if(parseInt(reqData.attendance)==1) {
        await bookshelf.transaction(async (t) => {
            await UsersDao.updateRow(userData[0][0].userid, {in_time: new Date(), status : 1}, t);
        });
    }else{
        await bookshelf.transaction(async (t) => {
            await UsersDao.updateRow(userData[0][0].userid, {out_time: new Date(), status: 0}, t);
        });

    }
    let userData1 = await Users.fetchUserByToken(token);
    if(userData1[0] < 1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }
    let att = userData1[0][0].status == 1? userData1[0][0].in_time :userData1[0][0].out_time

    let obj = {
        emialid: userData1[0][0].emailid,
        attendance: userData1[0][0].status,
        time:att
    }
    return obj;
}

export async function getUserByEmail(email) {
    let userDetails =await Users.getUserByEmail(email,"");
    return userDetails[0];
}


export async function registerFbUser(reqData,res)
{
    let duplicate = await checkDuplicateEmail(reqData.user);
    console.log("duplicate value "+duplicate);
    if(!duplicate)
    {

        let result= await createUser(reqData.user,res);
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
    let data = await Users.fetchUserDetail(user);
    if (data[0].length > 0) {
        return true;
    }

    return false;
}

export async function getCounts(token,req)
{
    let userID = await Users.fetchUserByToken(token);
    let counts = await Users.fetchCountsByUSerID(userID[0][0].userid);
    return ({
        message : '',
        Counts : counts[0]
    });

}

export async function createUser(user, created_by, token, res) {
    let email1 = '', token1 = '';
    if(user.emailid===undefined)
        token1 = token;
    else
        email1 = user.emailid;
    let userr, createdBy;
    if(created_by===undefined) {
        userr = await Users.fetchUserByToken(token);
        createdBy = userr[0][0].emailid;
    }
    else
        createdBy = created_by;
    let userData = await Users.getUserByEmail(email1, token1);
    console.log("userdata length "+ userData[0]);
    if (userData[0].length > 0) {
        return {errorCode: HttpStatus.CONFLICT, message : 'Email already exist'};
    }
    let gender = "";
    if(user.sex===undefined)
        gender = "";
    else
        gender = user.sex;
    if(user.name==='' || user.name===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Name cannot be blank.'};
    }
    if(user.user_type==='' || user.user_type===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Please send valid user type.'};
    }
    if(user.emailid==='' || user.emailid===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Email id cannot be blank.'};
    }
    if(user.mobile_number==='' || user.mobile_number===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Mobile number cannot be blank.'};
    }
    if(user.password==='' || user.password===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'password cannot be blank.'};
    }
    if(user.city==='' || user.city===undefined )
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'City can not be blank.'};
    }
    let newUserId = await bookshelf.transaction(async(t) => {
        let newUsers = await UsersDao.createRow({
            name : user.name,
            emailid : user.emailid,
            gender : gender,
            user_type: user.user_type,
            mobile_no: user.mobile_number,
            password : user.password,
            city: user.city,
            created_on: new Date(),
            created_by :createdBy
        }, t);

        return newUsers.id;
    });
    return ({
        message : newUserId+ ' is Created Successfully.',
        userID : newUserId
    });
}
export async function updateUser(reqData,token, reqfile, imagePath){
    let image = '';
    if(reqfile == undefined){
        return {errorCode: HttpStatus.NOT_FOUND, errors: 'Image Not Found'};
    }
    if (reqfile !== undefined) {
        image = reqfile.filename;
    }
    if(reqData.type==='' || user.type===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'type cannot be blank.'};
    }
    if(reqData.driver_id==='' || user.driver_id===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'driver_id cannot be blank.'};
    }
    let imagefieldName = reqData.type;
    await bookshelf.transaction(async(t) => {
       var obj = { updated_on: new Date()};
        obj[imagefieldName]= imagePath + '/' + image;

       await UsersDao.updateRow(parseInt(reqData.driver_id), obj, t);
    });
    let usersDetails = await Users.fetchUserByUserID(userid);
    return ({
        UserDetails : usersDetails[0],
        message : 'Updated Successfully'
    });
}

export async function getUsers() {
    let users = await Users.fetchAllUsers();
    console.log("userLists "+ JSON.stringify(users));
    let loginDetails =  await Users.fetchLoginDetails();
    return ({
        UserDetails : users[0],
        LoginDetails : loginDetails[0],
        message : ''
    });
}

export async function loginEmail(user, res) {
    const token = generateToken(user.userid);
    await bookshelf.transaction(async(t) => {
        await UsersDao.updateRow(user.userid, {last_login: new Date(), token : token}, t);
    });
    let usersDetails = await Users.fetchUserByUserID(user.userid);

    res.setHeader('DRPEDIA_TOKEN', token);

    return ({
        UserDetails : usersDetails[0],
        message : 'Login Successfully'
    });

}
/**
 * Generate  token by user id.
 *
 * @param deviceId
 * @returns {string}
 */
export function generateToken(userid) {
    let dbhash = microtime.now().toString() + userid;
    return crypto.createHash('md5').update(dbhash).digest('hex');
}