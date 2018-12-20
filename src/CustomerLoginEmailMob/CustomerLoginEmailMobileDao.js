import CustomerLoginEmailMobModel from './CustomerLoginEmailMobModel';
/**
 * Add new users.
 *
 * @param newUser
 * @returns {Promise.<*>}
 */
export async function createRow(newCustomer, transaction) {
    return await new CustomerLoginEmailMobModel(newCustomer).save(null, {transacting: transaction});
}
/**
 * Update users.
 *
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */
export async function updateRow(userid, data, transaction) {
    return await CustomerLoginEmailMobModel.where({'customer_id':userid}).save(data, {method: 'update', transacting: transaction});
}