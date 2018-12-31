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
export async function updateRow(discount_id, data, transaction) {
    return await RefferalModel.where({'discount_id':discount_id}).save(data, {method: 'update', transacting: transaction});
}