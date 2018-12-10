import bookshelf from '../db';
import * as queries from "../queries/VehicleQuery";

const TABLE_NAME = 'tbvehicle';
class VehicleModel extends bookshelf.Model {
    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }
    static fetchAllVehicles(){
        return bookshelf.knex.raw(queries.FETCH_ALL_VEHICLE);
    }


}
export default VehicleModel;