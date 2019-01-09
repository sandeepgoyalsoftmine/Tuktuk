import bookshelf from '../db';
import * as queries from "../queries/DriverDailyWise";



const TABLE_NAME = 'tbdriverdailywise';
class DriverDailyWiseModel extends bookshelf.Model {
    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }
    static fetchDailyWiseID(driver_id){
        return bookshelf.knex.raw(queries.FETCH_DAILY_WISE_ID_BY_DRIVER_ID_AND_TODAY_DATE,{
            driver_id:driver_id
        });
    }
}
export default DriverDailyWiseModel;