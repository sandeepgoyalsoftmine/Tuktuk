import EstimationModel from '../models/EstimationModel';


/**
 * Add new Products.
 *
 * @param newProduct
 * @returns {Promise.<*>}
 */
export async function createRow(newEstimation, transaction) {
    return await new EstimationModel(newEstimation).save(null, {transacting: transaction});
}






