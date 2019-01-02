import CallerModel from '../models/CallerModel';
/**
 * Add new users.
 *
 * @param newUser
 * @returns {Promise.<*>}
 */
export async function createRow(newCall, transaction) {
    return await new CallerModel(newCall).save(null, {transacting: transaction});
}
/**
 * Update users.
 *
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */
export async function updateRow(call_id, data, transaction) {
    return await CallerModel.where({'call_id':call_id}).save(data, {method: 'update', transacting: transaction});
}