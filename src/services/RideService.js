import Users from "../models/Users";
import RideModels from "../models/RideModels";
import CustomerLoginEmailMobModel from "../CustomerLoginEmailMob/CustomerLoginEmailMobModel";
import {rideStatus} from '../Constants/enum';

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


export async function getRides(){
    let rideDetails = await RideModels.fetchAllTodaysRide();
    for( let i=0; i< rideDetails[0].length; i++){
        if(rideDetails[0][i].status==1){
            rideDetails[0][i].ride_status = rideStatus.RideRequested;
        }
        else if(rideDetails[0][i].status==2){
            rideDetails[0][i].ride_status = rideStatus.RideBooked;
        }
        else if(rideDetails[0][i].status==3){
            rideDetails[0][i].ride_status = rideStatus.RideProcessing;
        }
        else if(rideDetails[0][i].status==4){
            rideDetails[0][i].sos = 0;
            rideDetails[0][i].ride_status = rideStatus.RideCompleted;
        }
        else{
            rideDetails[0][i].sos = 0;
            rideDetails[0][i].ride_status = rideStatus.RideFailed;
        }
        delete rideDetails[0][i].status;
    }
    return {
        RideDetails : rideDetails[0]
    }
}