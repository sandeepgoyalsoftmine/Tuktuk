import RefferalModel from "../models/RefferalModel";
import bookshelf from "../db";
import * as HttpStatus from "http-status-codes/index";
import * as ReferalDao from "../dao/ReferalDao";
import BankModel from "../models/BankModel";

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