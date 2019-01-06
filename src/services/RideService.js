import Users from "../models/Users";
import RideModels from "../models/RideModels";
import CustomerLoginEmailMobModel from "../CustomerLoginEmailMob/CustomerLoginEmailMobModel";

import * as HttpStatus from "http-status-codes/index";
import * as RideDAO from "../dao/RideDAO";
import bookshelf from "../db";

export async function createCustomerRating(token, reqData){
    let userData = await Users.fetchDriverByToken(token);
    if(userData[0].length < 1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }
    let checkRideId = await RideModels.fetchRideByRideId(reqData.ride_id);
    if(checkRideId[0].length < 1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Ride id'};
    }
    await bookshelf.transaction(async (t) => {
        let updateRideDetails = await RideDAO.updateRow(reqData.ride_id,
            {
                customer_rating: reqData.rating
            }, t);
    });
    return {
        message:"Driver rated successfully"
    }
}

export async function createDriverRating(token, reqData){
    let userData = await CustomerLoginEmailMobModel.fetchCustomerByToken(token);
    if(userData[0].length < 1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }
    let checkRideId = await RideModels.fetchRideByRideId(reqData.ride_id);
    if(checkRideId[0].length < 1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Ride id'};
    }
    await bookshelf.transaction(async (t) => {
        let updateRideDetails = await RideDAO.updateRow(reqData.ride_id,
            {
                driver_rating: reqData.rating
            }, t);
    });
    return {
        message:"Customer rated successfully"
    }
}