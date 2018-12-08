import bookshelf from '../db';
import * as queries from "../queries/VehicleTypeQueries";


const TABLE_NAME = 'tbvehicle';
class VehicleModel extends bookshelf.Model {
    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }
    static fetchVehicleTypes(){
        return bookshelf.knex.raw(queries.FETCH_VEHICLE_TYPES);
    }


}
export default VehicleModel;