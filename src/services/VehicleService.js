import bookshelf from '../db';
import * as HttpStatus from "http-status-codes/index";
import VehicleModel from "../models/VehicleModel";
import VehicleTypesModel from "../models/VehicleTypesModel";
import * as VehicleTypeDAO from '../dao/VehicleTypeDAO';
import * as VehicleDao from '../dao/VehicleDao';
import Users from "../models/Users";
import * as UsersDao from "../dao/users";


export async function getVehicleTypeWithUnassignedDriver(){
    let vehicleTypes = await VehicleTypesModel.fetchVehicleTypes();
    let unasignedDrivers = await Users.fetchUnassignedDrivers();
    return ({
        message : '',
        VehicleTypes : vehicleTypes[0],
        UnassignedDriver : unasignedDrivers[0]
    });
}
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

export async function getAllVehicle(){
    let vehicles = await  VehicleModel.fetchAllVehicles();
    let vehicleTypes = await VehicleTypesModel.fetchVehicleTypes();
    let unasignedDrivers = await Users.fetchUnassignedDrivers();
    return ({
        message:'',
        Vehicles :vehicles[0],
        VehicleTypes : vehicleTypes[0]
    })
}

export async function getVehicleDetailsByVehicleId(vehicleId){
    let vehicleDetails = await VehicleModel.fetchVehicleDetailsWithvehicleId(vehicleId);
    return {
        message:"",
        VehicleDetails: vehicleDetails[0]
    }
}
export async function getVehicleDetailsByUserId(token){
    let userData = await Users.fetchDriverByToken(token);
    if(userData[0].length < 1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }
    let vehicleDetails = await VehicleModel.fetchVehicleDetailsWithUserID(userData[0][0].userid);
    let vehicleStatus = true;
    if(vehicleDetails[0].length > 0){
        if(vehicleDetails[0][0].vehicle_type==null)
            vehicleStatus = false;
        if(vehicleDetails[0][0].make==null)
            vehicleStatus = false;
        if(vehicleDetails[0][0].model==null)
            vehicleStatus = false;
        if(vehicleDetails[0][0].vehicle_number==null)
            vehicleStatus = false;
        if(vehicleDetails[0][0].rc_no==null)
            vehicleStatus = false;
        if(vehicleDetails[0][0].permit_no==null)
            vehicleStatus = false;
        if(vehicleDetails[0][0].insurance_no==null)
            vehicleStatus = false;
    }else{
        vehicleStatus = false;
    }
    return {
        VehicleDetails:vehicleDetails[0][0],
        status:vehicleStatus
    }

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



export async function createVehicle(myfileName, dbImagePath, reqData, userID){

    if(reqData.vehicle_Type === undefined || reqData.vehicle_Type===""  || reqData.vehicle_Type==='Select'){
        return {errorCode: HttpStatus.BAD_REQUEST, message : 'Invalid Vehicle type Please Select from given selection.'}
    }if(reqData.make === undefined || reqData.make===""){
        return {errorCode: HttpStatus.BAD_REQUEST, message : 'Invalid company.'}
    }if(reqData.model === undefined || reqData.model===""){
        return {errorCode: HttpStatus.BAD_REQUEST, message : 'Invalid Model.'}
    }if(reqData.vehicle_number === undefined || reqData.vehicle_number===""){
        return {errorCode: HttpStatus.BAD_REQUEST, message : 'Invalid vehicle number.'}
    }if(reqData.rc_no === undefined || reqData.rc_no===""){
        return {errorCode: HttpStatus.BAD_REQUEST, message : 'Invalid Rc number.'}
    }if(reqData.permitNo === undefined || reqData.permitNo===""){
        return {errorCode: HttpStatus.BAD_REQUEST, message : 'Invalid permit number.'}
    }if(reqData.insuranceNo === undefined || reqData.insuranceNo===""){
        return {errorCode: HttpStatus.BAD_REQUEST, message : 'Invalid Insurance number.'}
    }
    let rc_image="";
    let permit_image = "";
    let insurance_image = "";
    console.log("myfilesname  "+ JSON.stringify(myfileName));
    for(let i=0;i< myfileName.length;i++){
        if(myfileName[i].fieldname==="rcImage"){
            rc_image = myfileName[i].imagepath;
        }else if(myfileName[i].fieldname==="permitImage"){
            permit_image = myfileName[i].imagepath;
        }else{
            insurance_image = myfileName[i].imagepath;
        }
    }
    console.log(rc_image+"    "+permit_image+"    "+insurance_image);
    let assignedValue=0;
    if(reqData.driver === undefined || reqData.driver ==="" || reqData.driver === "Select"){
        let newVehicleID = await bookshelf.transaction(async(t) =>
        {
            let newVehicle = await VehicleDao.createRow(
                {
                    vehicle_type : reqData.vehicle_Type,
                    make: reqData.make,
                    model: reqData.model,
                    vehicle_number: reqData.vehicle_number,
                    rc_no: reqData.rc_no,
                    permit_no: reqData.permitNo,
                    insurance_no: reqData.insuranceNo,
                    rc_image: rc_image,
                    permit_path: permit_image,
                    insurance_path: insurance_image,
                    created_by : userID,
                    created_on: new Date()
                }, t);
            if (!newVehicle.id) {
                return {errorCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Server error'};
            }
        });
    }else{
        assignedValue = 1;
        await bookshelf.transaction(async (t) => {
            await UsersDao.updateRow(reqData.driver, {driver_assigned: assignedValue}, t);
        });
        let newVehicleID = await bookshelf.transaction(async(t) =>
        {
            let newVehicle = await VehicleDao.createRow(
                {
                    vehicle_type : reqData.vehicle_Type,
                    make: reqData.make,
                    model: reqData.model,
                    vehicle_number: reqData.vehicle_number,
                    rc_no: reqData.rc_no,
                    permit_no: reqData.permitNo,
                    insurance_no: reqData.insuranceNo,
                    rc_image: rc_image,
                    permit_path: permit_image,
                    insurance_path: insurance_image,
                    created_by : userID,
                    assigned_driver_id : reqData.driver,
                    created_on: new Date()
                }, t);
            if (!newVehicle.id) {
                return {errorCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Server error'};
            }
        });
    }

    return {
        message : "Successfully Added"
    };
}
export async function updateVehicle(reqData, token){
    let userData = await Users.fetchDriverByToken(token);
    if(userData[0].length < 1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }
    if(reqData.vehicle_Type === undefined || reqData.vehicle_Type===""  || reqData.vehicle_Type==='Select'){
        return {errorCode: HttpStatus.BAD_REQUEST, message : 'Invalid Vehicle type Please Select from given selection.'}
    }if(reqData.make === undefined || reqData.make===""){
        return {errorCode: HttpStatus.BAD_REQUEST, message : 'Invalid company.'}
    }if(reqData.model === undefined || reqData.model===""){
        return {errorCode: HttpStatus.BAD_REQUEST, message : 'Invalid Model.'}
    }if(reqData.vehicle_number === undefined || reqData.vehicle_number===""){
        return {errorCode: HttpStatus.BAD_REQUEST, message : 'Invalid vehicle number.'}
    }
    console.log("USerID   "+userData[0][0].userid);
    await bookshelf.transaction(async (t) => {
        await VehicleDao.updateRow(userData[0][0].userid,
            {
                vehicle_type: reqData.vehicle_Type,
                make: reqData.make,
                model: reqData.model,
                vehicle_number: reqData.vehicle_number,
                rc_no: reqData.rc_no,
                permit_no: reqData.permit_no,
                insurance_no: reqData.insurance_no,
                updated_by: userData[0][0].userid,
                updated_on: new Date()
            }, t);
    });
    let VehicleDetails = await VehicleModel.fetchVehicleDetailsWithUserID(userData[0][0].userid);
    return ({
        VehicleDetails : VehicleDetails[0][0],
        message : 'Vehicle Updated Successfully'
    });

}
export async function updateVehicleDetails(reqData,vehicleId, userID){
    let vehicleDetails = await VehicleModel.fetchVehicleDetailsWithvehicleId(vehicleId);
    if(vehicleDetails[0].length < 1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Vehicle not exist'};
    }
    if(reqData.vehicle_Type === undefined || reqData.vehicle_Type===""  || reqData.vehicle_Type==='Select'){
        return {errorCode: HttpStatus.BAD_REQUEST, message : 'Invalid Vehicle type Please Select from given selection.'}
    }if(reqData.make === undefined || reqData.make===""){
        return {errorCode: HttpStatus.BAD_REQUEST, message : 'Invalid company.'}
    }if(reqData.model === undefined || reqData.model===""){
        return {errorCode: HttpStatus.BAD_REQUEST, message : 'Invalid Model.'}
    }if(reqData.vehicle_number === undefined || reqData.vehicle_number===""){
        return {errorCode: HttpStatus.BAD_REQUEST, message : 'Invalid vehicle number.'}
    }
    await bookshelf.transaction(async (t) => {
        await VehicleDao.updateVehicleRow(vehicleId,
            {
                vehicle_type: reqData.vehicle_Type,
                make: reqData.make,
                model: reqData.model,
                vehicle_number: reqData.vehicle_number,
                rc_no: reqData.rc_no,
                permit_no: reqData.permit_no,
                insurance_no: reqData.insurance_no,
                updated_by: userID,
                updated_on: new Date()
            }, t);
    });
    return ({
        message : 'Vehicle Updated Successfully'
    });

}