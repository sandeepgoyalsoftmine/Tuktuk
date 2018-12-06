import bookshelf from '../db';
import * as HttpStatus from "http-status-codes/index";
import Users from "../models/Users";
import VehicleTypesModel from "../models/VehicleTypesModel";

export async function getVehicleType(token){
    let userData = await Users.fetchUserByToken(token);
    if(userData[0] < 1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }
    let vehicleTypes = await VehicleTypesModel.fetchVehicleTypes();
    return ({
        message : '',
        VehicleTypes : vehicleTypes[0]
    });

}