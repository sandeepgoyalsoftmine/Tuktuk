import Tracking from '../models/Tracking';

/**
 * Add new Products.
 *
 * @param newProduct
 * @returns {Promise.<*>}
 */
export async function createRow(newLocation, transaction) {
    return await new Tracking(newLocation).save(null, {transacting: transaction});
}


