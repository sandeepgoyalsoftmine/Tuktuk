import bookshelf from '../db';
import * as queries from "../queries/TrackingQuery";

const TABLE_NAME = 'tbtrackingdata';

class Tracking extends bookshelf.Model {
    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }

    static fetchLocationAccordingToTimeAndUserId(userid, startTime, endTime){
        console.log("in query");
        return bookshelf.knex.raw(queries.FETCH_LOCATIONS_BY_USERID_STARTTIME_ENDTIME, {
            'userid': userid,
            'startTime': startTime,
            'endTime': endTime
        })
    }
}
export default Tracking;