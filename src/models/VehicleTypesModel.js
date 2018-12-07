import bookshelf from '../db';
import * as queries from "../queries/VehicleTypeQueries";


const TABLE_NAME = 'tbvehicletypes';
class VehicleTypesModel extends bookshelf.Model {
    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }
    static fetchVehicleTypes(){
        return bookshelf.knex.raw(queries.FETCH_VEHICLE_TYPES);
    }
    static fetchVehicleTypesByVehicleTypeID(vehicleTypeID){
        return bookshelf.knex.raw(queries.FETCH_VEHICLE_TYPES_BY_VEHICLE_TYPE_ID,{
            vehicle_id: vehicleTypeID
        });
    }
    static fetchVehicleTypeByVehicletype(vehicleType){
        return bookshelf.knex.raw(queries.FETCH_VEHICLE_TYPES_BY_VEHICLE_TYPE,{
            vehicleType: vehicleType
        });
    }

}
export default VehicleTypesModel;