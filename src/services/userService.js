import Users from '../models/Users';
import TrackingTemp from '../models/TrackingTemp';
import * as UsersDao from '../dao/users';
import microtime from 'microtime';
import crypto from 'crypto';
import bookshelf from '../db';
import * as HttpStatus from "http-status-codes/index";
import  * as LoginHistoryDao from '../dao/LoginHistoryDao';
import * as TrackingTempDao from "../dao/TrackingTempDao";
import * as VehicleDao from "../dao/VehicleDao";
import * as CustomerBankDao from "../dao/CustomerBankDao";
import {rideStatus} from '../Constants/enum';

export async function  login(reqData, usertype1, deviceToken, res) {
    if(deviceToken===undefined)
        deviceToken='';
    let typeOfUser;
    if(reqData.userType !=undefined)
        typeOfUser = reqData.userType;
    else
        typeOfUser = usertype1;
    let userData = await Users.checkLogin(reqData.userID, typeOfUser);
    if (userData[0].length < 1) {
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'User not exists'};
    }
    if (userData[0][0].password != reqData.password) {
        return {errorCode: HttpStatus.UNAUTHORIZED, message: 'Incorrect password'};
    }
    let valueTOken;
    if(reqData.userid === undefined){
        if(reqData.userID=== undefined || reqData.userID===""){
            return {errorCode: HttpStatus.BAD_REQUEST, message: 'email id can not be blank'};
        }else{
            valueTOken = reqData.userID;
        }
    }else{
        valueTOken = reqData.userid;
    }
    if(userData[0].length == 1 ) {
        const token = generateToken(userData[0][0].userid);
        await bookshelf.transaction(async (t) => {
            await UsersDao.updateRow(userData[0][0].userid, {device_id:deviceToken,token: token, last_login: new Date()}, t);
        });
        let userDetails = await Users.fetchUserDetailsByToken(token);
        res.setHeader('TUKTUK_TOKEN', token);
        return {message: 'Login Successfully',
            UserDetails : userDetails[0][0]};
    }else{
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Already Login'};
    }
}
export async function getStatus(token){
    let userData = await Users.fetchStatusByToken(token);
    return {
        UserStatus : userData[0][0]
    }


}
export async function getDriverDuty(token){
    let userData = await Users.fetchDriverByToken(token);
    if(userData.length < 1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }
    return {
        driverDutyDetails : userData[0][0]
    }
}

export async function getDriverDocuments(token){
    let driverDocuments = await Users.fetchDiverDocuments(token);
    if(driverDocuments.length < 1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }
    return {
        driverDocuments : driverDocuments[0][0]
    }
}

export async function getAttendance(token,req)
{
    let userData = await Users.fetchUserByToken(token);
    if(userData.length < 1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }
    let attendanceDetails = await Users.fetchAttendanceDetails(token);
    let att = userData[0][0].login_status == 1? userData[0][0].in_time :userData[0][0].out_time

    let obj = {
        emialid: userData[0][0].emailid,
        attendance: userData[0][0].login_status,
        time:att
    }
    return obj;

}
export async function driverHistory(token){
    let userData = await Users.fetchDriverByToken(token);
    if (userData[0].length < 1) {
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }
    let driverHistory = await Users.fetchDriverHistory(userData[0][0].userid);
    for(let i=0; i< driverHistory[0].length;i++) {
        if (driverHistory[0][i].status == 4) {
            delete driverHistory[0][i].status;
            driverHistory[0][0].status = rideStatus.RideCompleted;
        }
        if (driverHistory[0][i].status == 3) {
            delete driverHistory[0][i].status;
            driverHistory[0][0].status = rideStatus.RideProcessing;
        }
        if (driverHistory[0][i].status == 2) {
            delete driverHistory[0][i].status;
            driverHistory[0][0].status = rideStatus.RideBooked;
        }
        let customerDetails = {
            name: driverHistory[0][i].name,
            rating: driverHistory[0][i].Rating,
        }

        let payment_details = {
            payment_method:"Cash",
            final_amount: driverHistory[0][i].extra_charges,
            total_amount: driverHistory[0][i].extra_charges - driverHistory[0][i].gst,
            gst: driverHistory[0][i].gst
        }
        delete driverHistory[0][i].extra_charges;
        delete driverHistory[0][i].gst;
        driverHistory[0][i].customer_details = customerDetails;
        driverHistory[0][i].payment_details = payment_details;
        delete driverHistory[0][i].Company;
        delete driverHistory[0][i].model;
        delete driverHistory[0][i].vehicle_number;
        delete driverHistory[0][i].name;
        delete driverHistory[0][i].Rating;
    }
    return {
        driverHistory : driverHistory[0]
    }
}

export async function driverDuty(reqData, token){
    if((reqData.driver_duty_status).toUpperCase() === "ON" || (reqData.driver_duty_status).toUpperCase() === "OFF"){

    }else{
        return {errorCode: HttpStatus.BAD_REQUEST, message : 'Duty should be On or Off'};
    }
    let userData = await Users.fetchDriverByToken(token);
    if (userData[0].length < 1) {
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }
    console.log("userdata   "+JSON.stringify(userData[0][0]))
    if((userData[0][0].driver_duty_status).toUpperCase() === (reqData.driver_duty_status).toUpperCase()){
        if((userData[0][0].driver_duty_status).toUpperCase() === "ON")
            return {errorCode: HttpStatus.CONFLICT, message : 'Already On Duty'};
        else
            return {errorCode: HttpStatus.CONFLICT, message : 'Already off out'};
    }
    await bookshelf.transaction(async (t) => {
        await UsersDao.updateRow(userData[0][0].userid, {driver_duty_status: reqData.driver_duty_status, updated_on : new Date()}, t);
    });
    userData = await Users.fetchDriverByToken(token);
    return userData[0][0];
}

export async function markAttendance(reqData, token){
    let userData = await Users.fetchUserByToken(token);
    if (userData[0].length < 1) {
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }
    if(parseInt(userData[0][0].login_status) == parseInt(reqData.attendance)){
        if(parseInt(userData[0][0].login_status) == 1)
            return {errorCode: HttpStatus.CONFLICT, message : 'Already punch in'};
        else
            return {errorCode: HttpStatus.CONFLICT, message : 'Already punch out'};
    }
    if(parseInt(reqData.attendance)==1) {
        await bookshelf.transaction(async (t) => {
            await UsersDao.updateRow(userData[0][0].userid, {in_time: new Date(), login_status : 1}, t);
        });
        await bookshelf.transaction(async (t) => {
            let newTrackingTempID = await TrackingTempDao.updateRow(userData[0][0].emailid,
                {
                    login_status : 'Present'
                }, t);
        });
        let newUserId = await bookshelf.transaction(async(t) => {
            let newUsers = await LoginHistoryDao.createRow({
                emailid : userData[0][0].emailid,
                in_time: new Date(),
                userid: userData[0][0].userid
            }, t);

            return newUsers.id;
        });
    }else{
        await bookshelf.transaction(async (t) => {
            await UsersDao.updateRow(userData[0][0].userid, {out_time: new Date(), login_status: 0}, t);
        });
        let newUserId = await bookshelf.transaction(async(t) => {
            let newUsers = await LoginHistoryDao.createRow({
                emailid : userData[0][0].emailid,
                out_time: new Date(),
                userid: userData[0][0].userid
            }, t);

            return newUsers.id;
        });

    }

    let userData1 = await Users.fetchUserByToken(token);
    if(userData1[0] < 1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }

    let att = userData1[0][0].login_status == 1? userData1[0][0].in_time :userData1[0][0].out_time;

    let obj = {
        emialid: userData1[0][0].emailid,
        attendance: userData1[0][0].login_status,
        time:att
    };

    return obj;
}

export async function getUserByEmail(email) {
    let userDetails =await Users.getUserByEmail(email,"");
    return userDetails[0];
}

export async function getAllDriversList(){
    let drivers = await Users.fetchDriversList();
    return {
        driverList: drivers[0]
    };
}





export async function createUser(user, created_by, res) {
    let createdBy;
    if(created_by===undefined) {
        createdBy = '';
    }
    else
        createdBy = created_by;
    let userData = await Users.getUserByEmail(user.emailid);
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
    if(user.user_type==='' || user.user_type===undefined || user.user_type==='Select')
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Please select valid user type.'};
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
    let newUserId;
    console.log("user.user_type  "+user.user_type+"      created_by  "+created_by);
    console.log("user.vehicle_type   "+user.vehicle_type);
    if(user.user_type == 2){
        if(user.vehicle_type==='' || user.vehicle_type===undefined ||user.vehicle_type==='Select')
        {
            return {errorCode: HttpStatus.BAD_REQUEST, message: 'Please Select valid Vehicle type.'};
        }
        newUserId = await bookshelf.transaction(async(t) => {
            let newUsers = await UsersDao.createRow({
                name : user.name,
                emailid : user.emailid,
                gender : gender,
                user_type: user.user_type,
                mobile_no: user.mobile_number,
                password : user.password,
                city: user.city,
                dob: user.age,
                vehicle_type: user.vehicle_type,
                driving_licence_number: user.driving_licence_number,
                pan_card_number : user.pan_card_number,
                certificate_of_registration_number : user.certificate_of_registration_number,
                motor_insurence_number: user.motor_insurence_number,
                police_verification_number: user.police_verification_number,
                aadhar_card_number : user.aadhar_card_number,
                created_on: new Date(),
                created_by :createdBy
            }, t);

            return newUsers.id;
        });
        let newVehicleID = await bookshelf.transaction(async(t) => {
            let newVehicle = await VehicleDao.createRow(
                {
                    vehicle_type: user.vehicle_type,
                    status: 'Deactivate',
                    assigned_driver_id: newUserId,
                    created_by: createdBy,
                    created_on: new Date()
                }, t);
            if (!newVehicle.id) {
                return {errorCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Server error'};
            }
        });
        let newBankID = await bookshelf.transaction(async(t) => {
            let newBank = await CustomerBankDao.createRow({
                driver_id :newUserId,
                created_on: new Date(),
                created_by :createdBy
            }, t);

            return newBank.id;
        });

    }else{
        newUserId = await bookshelf.transaction(async(t) => {
        let newUsers = await UsersDao.createRow({
            name : user.name,
            emailid : user.emailid,
            gender : gender,
            user_type: user.user_type,
            mobile_no: user.mobile_number,
            password : user.password,
            city: user.city,
            dob: user.age,
            status:'Deactivate',
            created_on: new Date(),
            created_by :createdBy
        }, t);

        return newUsers.id;
    });
    }
    if(parseInt(user.user_type)==3) {
        let newUserTempId = await bookshelf.transaction(async (t) => {
            let newUsersTemp = await TrackingTempDao.createRow({
                emailid: user.emailid,
                lat: 0,
                lng: 0,
                created_on: new Date()
            }, t);

            return newUsersTemp.id;
        });
    }
    return ({
        message : newUserId+ ' is Created Successfully.',
        userID : newUserId
    });
}
export  async function updateStatus(reqData, token, userID){

    let usersDetails = await Users.fetchUserByUserID(userID);
    if(usersDetails[0].length < 0){
        return {errorCode: HttpStatus.NOT_FOUND, message: 'Employee not exist'};
    }
    if(parseInt(usersDetails[0][0].user_type) !== 2){
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'User should be driver'};
    }
    if(usersDetails[0][0].status==="Deactivate" && reqData.status ==="Deactivate"){
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Driver Already Deactivate'};
    }
    if(usersDetails[0][0].status==="Deactivate"){
        await bookshelf.transaction(async (t) => {
            await UsersDao.updateRow(userID, {
                status: 'Activate',
                updated_on: new Date()
            }, t);
        });
    }
    if(usersDetails[0][0].status==="Activate" && reqData.status ==="Activate"){
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Driver Already Activate'};
    }
    if(usersDetails[0][0].status==="Activate"){
        await bookshelf.transaction(async (t) => {
            await UsersDao.updateRow(userID, {
                status: 'Deactivate',
                updated_on: new Date()
            }, t);
        });
    }
    return {message: 'Updated Successfully'};


}
export async function updateDeviceToken(token, device_id){
    let userData = await Users.fetchUserByToken(token);
    if(userData.length < 1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }
    await bookshelf.transaction(async (t) => {
        await UsersDao.updateRow(userData[0][0].userid, {
            device_id: device_id,
            updated_on: new Date()
        }, t);
    });
    return {message: 'Updated Successfully'};
}
export async function updateUserData(reqData, created_by, userID){
    let usersDetails = await Users.fetchUserByUserID(userID);
    if(usersDetails[0].length < 0){
        return {errorCode: HttpStatus.NOT_FOUND, message: 'Employee not exist'};
    }
    let email1 = '', token1 = '';
    let userData = await Users.getUserByEmail(reqData.emailid);
    console.log("userdata length "+ userData[0]);
    if (userData[0].length > 0) {
        console.log(parseInt(userData[0][0].userid)+"    useridddddd "+ parseInt(userID));
        if (parseInt(userData[0][0].userid) != parseInt(userID)) {
            return {errorCode: HttpStatus.CONFLICT, message: 'Email is mapped with another user'};
        }
    }
    let gender = "";
    if(reqData.sex===undefined)
        gender = "";
    else
        gender = reqData.sex;
    if(reqData.name==='' || reqData.name===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Name cannot be blank.'};
    }
    if(reqData.user_type==='' || reqData.user_type===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Please send valid user type.'};
    }
    if(reqData.emailid==='' || reqData.emailid===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Email id cannot be blank.'};
    }
    if(reqData.mobile_number==='' || reqData.mobile_number===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Mobile number cannot be blank.'};
    }

    if(reqData.city==='' || reqData.city===undefined )
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'City can not be blank.'};
    }
    let newUserId;
    if(reqData.user_type == 2 && created_by !=undefined) {
        if (reqData.vehicle_type === '' || reqData.vehicle_type === undefined || reqData.vehicle_type === 'Select') {
            return {errorCode: HttpStatus.BAD_REQUEST, message: 'Please Select valid Vehicle type.'};
        }

        await bookshelf.transaction(async (t) => {
            await UsersDao.updateRow(userID, {
                name: reqData.name,
                emailid: reqData.emailid,
                gender: gender,
                user_type: reqData.user_type,
                mobile_no: reqData.mobile_number,
                city: reqData.city,
                dob: reqData.age,
                vehicle_type: reqData.vehicle_type,
                driving_licence_number: reqData.driving_licence_number,
                pan_card_number: reqData.pan_card_number,
                certificate_of_registration_number: reqData.certificate_of_registration_number,
                motor_insurence_number: reqData.motor_insurence_number,
                police_verification_number: reqData.police_verification_number,
                aadhar_card_number: reqData.aadhar_card_number,
                status: reqData.status,
                updated_on: new Date()
            }, t);
        });
    }else{
        await bookshelf.transaction(async (t) => {
            await UsersDao.updateRow(userID, {
                name: reqData.name,
                emailid: reqData.emailid,
                gender: gender,
                user_type: reqData.user_type,
                mobile_no: reqData.mobile_number,
                city: reqData.city,
                dob: reqData.age,
                status: 'Activate',
                driving_licence_number: '',
                pan_card_number: '',
                certificate_of_registration_number: '',
                motor_insurence_number: '',
                police_verification_number: '',
                aadhar_card_number: '',
                vehicle_type:'',
                updated_on: new Date()
            }, t);
        });
    }
    return {message: 'Updated Successfully'};
}
export async function updateUser(reqData,token, reqfile, imagePath){
    let image = '';
    if(reqfile == undefined){
        return {errorCode: HttpStatus.NOT_FOUND, errors: 'Image Not Found'};
    }
    if (reqfile !== undefined) {
        image = reqfile.filename;
    }
    if(reqData.type==='' || reqData.type===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'type cannot be blank.'};
    }
    if(reqData.driver_id==='' || reqData.driver_id===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'driver_id cannot be blank.'};
    }
    let imagefieldName = reqData.type;
    await bookshelf.transaction(async(t) => {
       var obj = { updated_on: new Date()};
        obj[imagefieldName]= imagePath + '/' + image;

       await UsersDao.updateRow(parseInt(reqData.driver_id), obj, t);
    });
    let usersDetails = await Users.fetchUserByUserID(reqData.driver_id);
    return ({
        UserDetails : usersDetails[0],
        message : 'Updated Successfully'
    });
}
export async function updateUserForPortal(reqData,token, reqfile, imagePath, driver_id){
    let image = '';
    if(reqfile == undefined){
        return {errorCode: HttpStatus.NOT_FOUND, errors: 'Image Not Found'};
    }
    if (reqfile !== undefined) {
        image = reqfile.filename;
    }
    if(reqData.type==='' || reqData.type===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'type cannot be blank.'};
    }

    let imagefieldName = reqData.type;

    if(reqData.type==="driver_pic") {
        await bookshelf.transaction(async (t) => {
            var obj = {updated_on: new Date()};
            obj[imagefieldName] = imagePath + '/' + image;

            await UsersDao.updateRow(parseInt(driver_id), obj, t);
        });
    }else{
        if(reqData.field==='' || reqData.field===undefined)
        {
            return {errorCode: HttpStatus.BAD_REQUEST, message: 'value cannot be blank.'};
        }
        let fieldNumber = reqData.field;
        await bookshelf.transaction(async (t) => {
            var obj = {updated_on: new Date(), };
            obj[imagefieldName] = imagePath + '/' + image;
            obj[fieldNumber] = reqData.fieldNumber;
            await UsersDao.updateRow(parseInt(driver_id), obj, t);
        });
    }
    let usersDetails = await Users.fetchUserByUserID(driver_id)
    console.log("done from back");
    return ({
        UserDetails : usersDetails[0],
        message : 'Updated Successfully'
    });
}

export async function getEmployeeAttendance() {
    let employeeAttendance =  await TrackingTemp.fetchAttendance();


    return ({
        LoginDetails : employeeAttendance[0],
        message : ''
    });
}
export async function getEmployees() {
    let users = await Users.fetchAllEmployees();
    console.log("userLists "+ JSON.stringify(users));
    let loginDetails =  await TrackingTemp.fetchAttendance();
    return ({
        UserDetails : users[0],
        LoginDetails : loginDetails[0],
        message : ''
    });
}

export async function getAllDrivers() {
    let users = await Users.fetchDrivers();
    console.log("userLists "+ JSON.stringify(users));
    return ({
        UserDetails : users[0],
        message : ''
    });
}
export  async function getUserByUserID(userid){
    let users = await Users.fetchUserByUserID(userid);
    console.log("userLists "+ JSON.stringify(users));
    return ({
        UserDetails : users[0],
        message : ''
    });
}
export  async function getUserDocByUserID(userid){
    let users = await Users.fetchUserDocumentsByUserID(userid);
    console.log("userLists "+ JSON.stringify(users));
    return ({
        UserDocuments : users[0],
        message : ''
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

