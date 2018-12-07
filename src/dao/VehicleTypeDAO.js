import VehicleTypesModel from '../models/VehicleTypesModel';


/**
 * Add new Products.
 *
 * @param newProduct
 * @returns {Promise.<*>}
 */
export async function createRow(newVehicleType, transaction) {
    return await new VehicleTypesModel(newVehicleType).save(null, {transacting: transaction});
}

export async function updateRow(id, data, transaction) {
    return await VehicleTypesModel.where({'vehicle_id': id}).save(data, {method: 'update', transacting: transaction});
}




