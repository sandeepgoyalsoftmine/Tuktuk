import RefferalModel from '../models/RefferalModel';
/**
 * Add new users.
 *
 * @param newUser
 * @returns {Promise.<*>}
 */
export async function createRow(newBank, transaction) {
    return await new RefferalModel(newBank).save(null, {transacting: transaction});
}
/**
 * Update users.
 *
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */
export async function updateRow(bankid, data, transaction) {
    return await RefferalModel.where({'bank_id':bankid}).save(data, {method: 'update', transacting: transaction});
}