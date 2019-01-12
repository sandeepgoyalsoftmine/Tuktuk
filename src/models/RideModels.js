import bookshelf from '../db';
import * as queries from "../queries/RideQuery";



const TABLE_NAME = 'tb_ride_details';
class RideModels extends bookshelf.Model {
    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }
    static fetchRideByRideId(ride_id){
        return bookshelf.knex.raw(queries.FETCH_RIDE_BY_RIDE_ID, {
            ride_id: ride_id
        });
    }

    static fetchAllTodaysRide(){
        return bookshelf.knex.raw(queries.FETCH_ALL_TODAYS_RIDE);
    }

}
export default RideModels;