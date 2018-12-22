import CustomerModel from './CustomerModel';
/**
 * Add new users.
 *
 * @param newUser
 * @returns {Promise.<*>}
 */
export async function createRow(newCustomer, transaction) {
    return await new CustomerModel(newCustomer).save(null, {transacting: transaction});
}
/**
 * Update users.
 *
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */
export async function updateRow(userid, data, transaction) {
    return await CustomerModel.where({'customer_id':userid}).save(data, {method: 'update', transacting: transaction});
}
