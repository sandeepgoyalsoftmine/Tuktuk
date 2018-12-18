import UserModel from './UserModel';
/**
 * Add new users.
 *
 * @param newUser
 * @returns {Promise.<*>}
 */
export async function createRow(newUser, transaction) {
    return await new UserModel(newUser).save(null, {transacting: transaction});
}
/**
 * Update users.
 *
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */
export async function updateRow(customer_id, data, transaction) {
    return await UserModel.where({'customer_id':customer_id}).save(data, {method: 'update', transacting: transaction});
}