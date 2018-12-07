import bookshelf from '../db';
import * as HttpStatus from "http-status-codes/index";
import Users from "../models/Users";
import VehicleTypesModel from "../models/VehicleTypesModel";
import * as VehicleTypeDAO from '../dao/VehicleTypeDAO';

export async function getVehicleType(){
    let vehicleTypes = await VehicleTypesModel.fetchVehicleTypes();
    return ({
        message : '',
        VehicleTypes : vehicleTypes[0]
    });

}

export async function getVehicleTypeByVehicleTypeID(vehicleTypeID){
    let vehicleTypes = await VehicleTypesModel.fetchVehicleTypesByVehicleTypeID(vehicleTypeID);
    return ({
        message : '',
        VehicleTypes : vehicleTypes[0]
    });
}

export  async function createVehicleType(reqData, createdBy){
    if(reqData.vehicle_type === undefined || reqData.vehicle_type===""){
        return {errorCode: HttpStatus.BAD_REQUEST, message : 'Invalid Vehicle type.'}
    }
    let checkVehicleType = await VehicleTypesModel.fetchVehicleTypeByVehicletype(reqData.vehicle_type);
    console.log("check VehicleType   "+ JSON.stringify(checkVehicleType[0]));
    if(checkVehicleType[0].length>0){
        return {errorCode: HttpStatus.CONFLICT, message: reqData.vehicle_type+' already exist.'};
    }
    let newVehicleType = await bookshelf.transaction(async(t) =>
    {
        let newVehicle = await VehicleTypeDAO.createRow(
            {
                vehicle_type : reqData.vehicle_type,
                created_on: new Date()
            }, t);
        if (!newVehicle.id) {
            return {errorCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Server Error'};
        }
    });
    return {
        message : "Successfully Added"
    };
}

export  async function updateVehicleType(reqData, createdBy, vehicleTypeID){
    if(reqData.vehicleType === undefined || reqData.vehicleType===""){
        return {errorCode: HttpStatus.BAD_REQUEST, message : 'Invalid Vehciel type.'}
    }
    let checkVehicleType = await VehicleTypesModel.fetchVehicleTypeByVehicletype(reqData.vehicleType);
    console.log("check VehicleType   "+ JSON.stringify(checkVehicleType[0]));
    if(checkVehicleType[0].length>0 && (parseInt(vehicleTypeID) != checkVehicleType[0][0].vehicle_id) ){
        return {errorCode: HttpStatus.CONFLICT, message: reqData.vehicleType+' already exist.'};
    }
    await bookshelf.transaction(async (t) => {
        let updateVehicelType = await VehicleTypeDAO.updateRow(vehicleTypeID,
            {
                vehicle_type: reqData.vehicleType,
                updated_on : new Date()
            }, t);
    });
    return {
        message : "Updated Successfully"
    };
}