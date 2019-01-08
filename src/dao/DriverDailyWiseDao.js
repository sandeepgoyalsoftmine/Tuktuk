import DriverDailyWiseModel from '../models/DriverDailyWiseModel';
/**
 * Add new users.
 *
 * @param newUser
 * @returns {Promise.<*>}
 */
export async function createRow(newdriverDailyWise, transaction) {
    return await new DriverDailyWiseModel(newdriverDailyWise).save(null, {transacting: transaction});
}
/**
 * Update users.
 *
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */
export async function updateRow(dailywiseid, data, transaction) {
    return await DriverDailyWiseModel.where({'daily_wise_id':dailywiseid}).save(data, {method: 'update', transacting: transaction});
}