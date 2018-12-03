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
        return bookshelf.knex('tbtemp').where('emailid',email)
            .select('lat', 'lng', 'created_on', 'emailid');
    }
    static fetchAttendance(){
        return bookshelf.knex.raw(queries.FETCH_ATTENDANCE);
    }
}
export default TrackingTemp;