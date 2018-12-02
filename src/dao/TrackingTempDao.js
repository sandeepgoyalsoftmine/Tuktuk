import TrackingTemp from '../models/TrackingTemp';


/**
 * Add new Products.
 *
 * @param newProduct
 * @returns {Promise.<*>}
 */
export async function createRow(newLocation, transaction) {
    return await new TrackingTemp(newLocation).save(null, {transacting: transaction});
}

export async function updateRow(id, data, transaction) {
    return await TrackingTemp.where({'emailid': id}).save(data, {method: 'update', transacting: transaction});
}




