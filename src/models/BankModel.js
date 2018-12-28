import bookshelf from '../db';
import * as queries from "../queries/BankQuery";


const TABLE_NAME = 'tbbank';
class BankModel extends bookshelf.Model {
    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }

    static fetchBankDetailsWithDriver(){
        return bookshelf.knex.raw(queries.FETCH_BANK_DETAILS_WITH_DRIVER);
    }
}
export default BankModel;