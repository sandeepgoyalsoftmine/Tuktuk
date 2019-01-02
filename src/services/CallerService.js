import * as HttpStatus from "http-status-codes/index";
import bookshelf from "../db";
import * as CallerDao from "../dao/CallerDao";
import CustomerLoginEmailMobModel from "../CustomerLoginEmailMob/CustomerLoginEmailMobModel";
import Users from "../models/Users";
import * as CustomerBankDao from "../dao/CustomerBankDao";
const RIDE_REQUESTED = 1;
const RIDE_BOOKED = 2;
const RIDE_PROCESS = 3;
const RIDE_COMPLETED = 4;
const RIDE_FAILED = 5;


export async function createCaller(reqData){
    console.log("request    "+JSON.stringify(reqData));
    if(isNaN(reqData.callid))
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Callid should be blank.'};
    }
    if(isNaN(reqData.callfrom))
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'call from should be blank.'};
    }
    if(isNaN(reqData.landingnumber))
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'landing number should be blank.'};
    }
    if(reqData.calltime==='' || reqData.calltime===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Call time cannot be blank.'};
    }
    let call_from_driver =0;
    let call_from_customer =0;
    let customerMobile = await CustomerLoginEmailMobModel.fetchCustomerIDByMobileNumber(reqData.callfrom);
    console.log("customerMobile "+ JSON.stringify(customerMobile));
    if(customerMobile[0].length < 1){
        let driverMobile = await Users.fetchUserIDByMobileNumber(reqData.callfrom);
        console.log("drier mobile  "+ JSON.stringify(driverMobile[0]));
        if(driverMobile[0].length < 1){
            return {errorCode: HttpStatus.BAD_REQUEST, message: 'Mobile Number not exist'};
        }else{
            console.log("riverMobile[0][0].userid  "+ driverMobile[0][0].userid);
            call_from_driver = driverMobile[0][0].userid;
        }
    }else{
        call_from_customer = customerMobile[0][0].customer_id;
    }
    let callerID = 0;
    let callToID, caller, callTo;
    console.log("call from customer "+ call_from_customer)
    if(call_from_customer === 0){
        caller = 'Driver';
        callerID = call_from_driver;
        console.log("caller id   "+ callerID);
        callToID = await Users.fetchRideIDFromRideDetailsByDriverID(callerID,RIDE_BOOKED);
        callTo = await CustomerLoginEmailMobModel.fetchMobileNumberByCustomerId(callToID[0][0].customer_id);
        console.log("calltooooooo   "+ JSON.stringify(callToID[0]));
    }else{
        caller = 'Customer';
        callerID = call_from_customer;
        callToID = await CustomerLoginEmailMobModel.fetchRideIDFromRideDetailsByCustomerID(callerID, RIDE_BOOKED);
        console.log("calling from calling to "+ JSON.stringify(callToID[0]));
        callTo = await Users.fetchMobileNumberByUserID(callToID[0][0].driver_id);
    }
    console.log("call to "+ JSON.stringify(callToID[0][0]));
    let newCallID = await bookshelf.transaction(async(t) => {
        let newCall = await CallerDao.createRow({
            call_id : reqData.callid,
            call_from : reqData.callfrom,
            landing_number : reqData.landingnumber,
            call_time : reqData.calltime,
            call_to:callTo[0][0].mobile_no,
            caller: caller,
            ride_id: callToID[0][0].id,
            created_on: new Date()
        }, t);
        return newCall.id;
    });
    return {
        callto:callTo[0][0].mobile_no
    };
}

export async function updateCaller(reqData){
    if(isNaN(reqData.callid))
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Callid should be number.'};
    }
    if(isNaN(reqData.callfrom))
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'call from should be number.'};
    }
    if(isNaN(reqData.callto))
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'call to should be number.'};
    }
    if(isNaN(reqData.duration))
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'duration should be number.'};
    }
    if(isNaN(reqData.landingnumber))
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'landing number should be number.'};
    }
    if(reqData.calltime==='' || reqData.calltime===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Call time cannot be blank.'};
    }
    if(reqData.status==='' || reqData.status===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'status cannot be blank.'};
    }
    await bookshelf.transaction(async (t) => {
        let updateBankDetails = await CallerDao.updateRow(reqData.callid,
            {
                status : reqData.status,
                duration : reqData.duration,
                updated_on: new Date()
            }, t);
    });
    return {
        message:"Call details successfully updated"
    }
}