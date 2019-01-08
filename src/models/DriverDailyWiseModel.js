import bookshelf from '../db';



const TABLE_NAME = 'tbdriverdailywise';
class DriverDailyWiseModel extends bookshelf.Model {
    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }
}
export default DriverDailyWiseModel;