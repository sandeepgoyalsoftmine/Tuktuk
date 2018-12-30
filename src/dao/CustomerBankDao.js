import CustomerBankModel from '../models/CustomerBankModel';
/**
 * Add new users.
 *
 * @param newUser
 * @returns {Promise.<*>}
 */
export async function createRow(newBankDetails, transaction) {
    return await new CustomerBankModel(newBankDetails).save(null, {transacting: transaction});
}
/**
 * Update users.
 *
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */
export async function updateRow(bankid, data, transaction) {
    return await CustomerBankModel.where({'bankid':bankid}).save(data, {method: 'update', transacting: transaction});
}

export async function updateRowAPI(userid, data, transaction) {
    return await CustomerBankModel.where({'driver_id':userid}).save(data, {method: 'update', transacting: transaction});
}