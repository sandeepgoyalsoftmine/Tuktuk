import VehicleModel from '../models/VehicleModel';


/**
 * Add new Products.
 *
 * @param newProduct
 * @returns {Promise.<*>}
 */
export async function createRow(newVehicle, transaction) {
    return await new VehicleModel(newVehicle).save(null, {transacting: transaction});
}

export async function updateRow(id, data, transaction) {
    return await VehicleModel.where({'assigned_driver_id': id}).save(data, {method: 'update', transacting: transaction});
}




