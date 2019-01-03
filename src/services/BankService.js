import BankModel from "../models/BankModel";
import * as HttpStatus from "http-status-codes/index";
import * as BankDao from "../dao/BankDao";
import bookshelf from "../db";
import Users from "../models/Users";

export async function getBanks(){
    let banks =  await BankModel.fetchAllBanks();
    return ({
        Banks : banks[0],
        message : ''
    });
}

export async function getAllbankList(){
    let banks =  await BankModel.fetchAllBanks();
    return ({
        Banks : banks[0],
        message : ''
    });
}

export async function getAccountDetails(token){
    let userData = await Users.fetchDriverByToken(token);
    if(userData.length < 1){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid Token'};
    }
    let account = await BankModel.fetchAccountByUserid(userData[0][0].userid);
    let accountStatus = false;
    if(account[0].length > 0){
        accountStatus = true;
    }
    return {
        AccountDetails:account[0][0],
        status:accountStatus
    }
}
export async function createBank(reqData, sessionID){
    console.log("reqDatas   "+ JSON.stringify(reqData)+"    session "+ sessionID);
    if(reqData.bank_name==='' || reqData.bank_name===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Bank Name cannot be blank.'};
    }
    if(reqData.short_name==='' || reqData.short_name===undefined)
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'short name can not be blank'};
    }
    let bank = await BankModel.fetchBankByName(reqData.bank_name);
    if(bank[0].length>0){
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Bank Name Already Exist'};
    }
    let newBankID = await bookshelf.transaction(async(t) => {
        let newBank = await BankDao.createRow({
            bank_name : reqData.bank_name,
            short_name : reqData.short_name,
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