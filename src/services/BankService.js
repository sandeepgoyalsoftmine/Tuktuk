import bookshelf from "../db";
import * as BankDao from "../dao/BankDao";
import Users from "../models/Users";
import * as HttpStatus from "http-status-codes/index";

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