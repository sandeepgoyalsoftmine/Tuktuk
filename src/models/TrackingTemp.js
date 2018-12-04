import bookshelf from '../db';
import * as queries from "../queries/trackingTempQuery";


const TABLE_NAME = 'tbtemp';
class TrackingTemp extends bookshelf.Model {
    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }
    static fetchLocations(email){
        console.log("emialssss   "+email);
        return bookshelf.knex.raw(queries.FETCH_LOCATION, {'email': email});
    }
    static fetchAttendance(){
        return bookshelf.knex.raw(queries.FETCH_ATTENDANCE);
    }
}
export default TrackingTemp;