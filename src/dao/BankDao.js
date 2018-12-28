import BankModel from '../models/BankModel';
/**
 * Add new users.
 *
 * @param newUser
 * @returns {Promise.<*>}
 */
export async function createRow(newBankDetails, transaction) {
    return await new BankModel(newBankDetails).save(null, {transacting: transaction});
}
/**
 * Update users.
 *
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */
export async function updateRow(userid, data, transaction) {
    return await BankModel.where({'userid':userid}).save(data, {method: 'update', transacting: transaction});
}