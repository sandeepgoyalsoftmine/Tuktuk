import Users from '../models/Users';
/**
 * Add new users.
 *
 * @param newUser
 * @returns {Promise.<*>}
 */
export async function createRow(newUser, transaction) {
    return await new Users(newUser).save(null, {transacting: transaction});
}
/**
 * Update users.
 *
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */
export async function updateRow(userid, data, transaction) {
    return await Users.where({'userid':userid}).save(data, {method: 'update', transacting: transaction});
}