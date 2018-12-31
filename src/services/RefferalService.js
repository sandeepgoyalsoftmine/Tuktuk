import RefferalModel from "../models/RefferalModel";
import bookshelf from "../db";
import * as HttpStatus from "http-status-codes/index";
import * as ReferalDao from "../dao/ReferalDao";
import BankModel from "../models/BankModel";
import CustomerBankModel from "../models/CustomerBankModel";
import * as CustomerBankDao from "../dao/CustomerBankDao";

export async function getRefferals(){
    let refferals =  await RefferalModel.fetchAllDiscount();
    return ({
        Discount : refferals[0],
        message : ''
    });
}

export async function createDiscount(reqData, sessionID){
    console.log("reqDatas   "+ JSON.stringify(reqData)+"    session "+ sessionID);
    if(isNaN(reqData.discount_ride_km))
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Km should be Number.'};
    }
    let referral = await RefferalModel.fetchDiscountByRideKm(reqData.discount_ride_km);
    if(referral[0].length>0){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Discount Ride per kM Already Exist'};
    }
    let newRefferalID = await bookshelf.transaction(async(t) => {
        let newrefferal = await ReferalDao.createRow({
            discount_ride_km : reqData.discount_ride_km,
            status : 'Deactivate',
            created_on: new Date(),
            created_by :sessionID
        }, t);

        return newrefferal.id;
    });
    return ({
        message : 'Refferal id: '+newRefferalID+ ' is Created Successfully.',
        userID : newRefferalID
    });
}

export  async function getRefferalByDiscountID(discount_id){
        console.log("bank id "+ discount_id)
        let driverBankDetials =  await RefferalModel.fetchRefferalByDiscountID(discount_id);
        return ({
            Discount : driverBankDetials[0],
            message : ''
        });
}

export async function updateDiscount(reqData, sessionID, discount_id){
    console.log("reqDatas   "+ JSON.stringify(reqData)+"    session "+ sessionID);
    if(isNaN(reqData.discountridekm))
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Km should be Number.'};
    }
    if(reqData.status==='' || reqData.status===undefined || reqData.status==='Select')
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Please select valid status.'};
    }
    let referral = await RefferalModel.fetchDiscountByRideKm(reqData.discountridekm);
    console.log("diascount    "+ referral[0][0].discount_id +"   "+ discount_id);
    if(referral[0].length>0 &&(referral[0][0].discount_id != discount_id)){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Discount Ride per kM Already Exist'};
    }

    let refferalID = await RefferalModel.fetchRefferalByDiscountID(discount_id);
    console.log("check refferalID   "+ JSON.stringify(refferalID[0]));
    if(refferalID[0].length<0){
        return {errorCode: HttpStatus.CONFLICT, message: discount_id+' Not exist.'};
    }
    await bookshelf.transaction(async (t) => {
        let updateDiscountDetails = await ReferalDao.updateRow(discount_id,
            {
                discount_ride_km : reqData.discountridekm,
                status : reqData.status,
                updated_on: new Date(),
                updated_by :sessionID
            }, t);
    });
    console.log("before check");
    if(reqData.status==="Activate"){
        let deactivateAll = await RefferalModel.deactivateAll(discount_id);
    }
    return {
        message : "Updated Successfully"
    };

}