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
    static fetchVehicleDetailsWithUserID(userid){
        return bookshelf.knex.raw(queries.FETCH_VEHICLE_DETAILS_BY_USER_ID,{
            userid: userid
        });
    }
    static fetchVehicleDetailsWithvehicleId(vehiceleId){
        return bookshelf.knex.raw(queries.FETCH_VEHICLE_DETAILS_BY_VEHICLE_ID,{
            vehiceleId: vehiceleId
        });
    }


}
export default VehicleModel;