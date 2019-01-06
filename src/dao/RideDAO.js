import RideModels from '../models/RideModels';
/**
 * Add new users.
 *
 * @param newUser
 * @returns {Promise.<*>}
 */
export async function createRow(newRide, transaction) {
    return await new RideModels(newRide).save(null, {transacting: transaction});
}
/**
 * Update users.
 *
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */
export async function updateRow(ride_id, data, transaction) {
    return await RideModels.where({'id':ride_id}).save(data, {method: 'update', transacting: transaction});
}