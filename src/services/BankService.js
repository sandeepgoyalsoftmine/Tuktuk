import bookshelf from "../db";
import * as BankDao from "../dao/BankDao";
import BankModel from "../models/BankModel";
import * as HttpStatus from "http-status-codes/index";
import VehicleTypesModel from "../models/VehicleTypesModel";
import * as VehicleTypeDAO from "../dao/VehicleTypeDAO";




export async function getBankDetails(){
    let driverBankDetials =  await BankModel.fetchBankDetailsWithDriver();
    return ({
        BankDetails : driverBankDetials[0],
        message : ''
    });
}

export async function getBankDetailsByBankID(bankid) {
    let driverBankDetials =  await BankModel.fetchBankDetailsByBankID(bankid);
    return ({
        BankDetails : driverBankDetials[0],
        message : ''
    });
}

export async function updateBankDetails(reqData, createdBy){

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
    let checkbank = await BankModel.fetchBankDetailsByBankID(reqData.bank_id);
    console.log("check Bank   "+ JSON.stringify(checkbank[0]));
    if(checkbank[0].length<1){
        return {errorCode: HttpStatus.CONFLICT, message: reqData.bank_id+' Not exist.'};
    }
    await bookshelf.transaction(async (t) => {
        let updateBankDetails = await BankDao.updateRow(reqData.bank_id,
            {
                bank_name : reqData.bank_name,
                account_holder : reqData.account_holder,
                account: reqData.account_no,
                ifsc_code: reqData.ifsc_code,
                updated_on: new Date(),
                updated_by :createdBy
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
        let newBank = await BankDao.createRow({
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