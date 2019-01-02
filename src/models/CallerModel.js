import bookshelf from '../db';
import * as queries from "../queries/BankQuery";


const TABLE_NAME = 'tbcaller';
class CallerModel extends bookshelf.Model {
    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }
}
export default CallerModel;