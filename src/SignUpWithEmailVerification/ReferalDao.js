import ReferalModel from './ReferalModel';
/**
 * Add new users.
 *
 * @param newUser
 * @returns {Promise.<*>}
 */
export async function createRow(newReferal, transaction) {
    return await new ReferalModel(newReferal).save(null, {transacting: transaction});
}
/**
 * Update users.
 *
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */
export async function updateRow(refferal_history_id, data, transaction) {
    return await ReferalModel.where({'refferal_history_id':refferal_history_id}).save(data, {method: 'update', transacting: transaction});
}