import bookshelf from "../db";
import * as CustomerBankDao from "../dao/CustomerBankDao";
import CustomerBankModel from "../models/CustomerBankModel";
import * as HttpStatus from "http-status-codes/index";
import VehicleTypesModel from "../models/VehicleTypesModel";
import * as VehicleTypeDAO from "../dao/VehicleTypeDAO";
import Users from "../models/Users";




export async function getBankDetails(){
    console.log("in get customerBAnk");
    let driverBankDetials =  await CustomerBankModel.fetchBankDetailsWithDriver();
    return ({
        BankDetails : driverBankDetials[0],
        message : ''
    });
}

export async function getBankDetailsByBankID(bankid) {
    console.log("bank id "+ bankid)
    let driverBankDetials =  await CustomerBankModel.fetchBankDetailsByBankID(bankid);
    return ({
        BankDetails : driverBankDetials[0],
        message : ''
    });
}

export async function updateBankDetails(reqData, createdBy){
    if(reqData.bankname==='' || reqData.bankname===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Bank Name cannot be blank.'};
    }
    if(reqData.accountholder==='' || reqData.accountholder===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Account Holder name can not be blank'};
    }
    if(reqData.accountno==='' || reqData.accountno===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Account number cannot be blank.'};
    }
    if(reqData.ifsccode==='' || reqData.ifsccode===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'IFSC code cannot be blank.'};
    }
    let checkbank = await CustomerBankModel.fetchBankDetailsByBankID(reqData.bankid);
    console.log("check Bank   "+ JSON.stringify(checkbank[0]));
    if(checkbank[0].length<1){
        return {errorCode: HttpStatus.CONFLICT, message: reqData.bankid+' Not exist.'};
    }
    await bookshelf.transaction(async (t) => {
        let updateBankDetails = await CustomerBankDao.updateRow(reqData.bankid,
            {
                bank_name : reqData.bankname,
                account_holder : reqData.accountholder,
                account: reqData.accountno,
                ifsc_code: reqData.ifsccode,
                updated_on: new Date(),
                updated_by :createdBy
            }, t);
    });
    return {
        message : "Updated Successfully"
    };

}
export async function updateAccount(reqData, token){

    let userData = await Users.fetchDriverByToken(token);
    if(userData[0].length < 1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }
    if(reqData.bankname==='' || reqData.bankname===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Bank Name cannot be blank.'};
    }
    if(reqData.accountholder==='' || reqData.accountholder===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Account Holder name can not be blank'};
    }
    if(reqData.accountno==='' || reqData.accountno===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Account number cannot be blank.'};
    }
    if(reqData.ifsccode==='' || reqData.ifsccode===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'IFSC code cannot be blank.'};
    }

    await bookshelf.transaction(async (t) => {
        let updateBankDetails = await CustomerBankDao.updateRowAPI(userData[0][0].userid,
            {
                bank_name : reqData.bankname,
                account_holder : reqData.accountholder,
                account: reqData.accountno,
                ifsc_code: reqData.ifsccode,
                updated_on: new Date(),
                updated_by :userData[0][0].userid
            }, t);
    });
    return {
        message : "Updated Successfully"
    };

}


export async function createBankDetails(reqData, sessionID){
    console.log("reqDatas   "+ JSON.stringify(reqData)+"    session "+ sessionID);
    if(reqData.bank_name==='' || reqData.bank_name===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Bank Name cannot be blank.'};
    }
    if(reqData.account_holder==='' || reqData.account_holder===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Account Holder name can not be blank'};
    }
    if(reqData.account_no==='' || reqData.account_no===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Account number cannot be blank.'};
    }
    if(reqData.ifsc_code==='' || reqData.ifsc_code===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'IFSC code cannot be blank.'};
    }
    if(reqData.user_id==='' || reqData.user_id===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Driver id cannot be blank.'};
    }
    let newBankID = await bookshelf.transaction(async(t) => {
        let newBank = await CustomerBankDao.createRow({
            driver_id :reqData.user_id ,
            bank_name : reqData.bank_name,
            account_holder : reqData.account_holder,
            account: reqData.account_no,
            ifsc_code: reqData.ifsc_code,
            created_on: new Date(),
            created_by :sessionID
        }, t);

        return newBank.id;
    });
    return ({
        message : 'Bank id: '+newBankID+ ' is Created Successfully.',
        userID : newBankID
    });

}