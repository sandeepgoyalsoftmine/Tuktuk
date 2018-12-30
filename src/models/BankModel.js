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

    static fetchAllBanks(){
        return bookshelf.knex.raw(queries.FETCH_ALL_BANKS);
    }
    static fetchBankByName(bank_name){
        return bookshelf.knex.raw(queries.FETCH_BANK_BY_BANK_NAME, {
            bank_name: bank_name
        });
    }
    static fetchAccountByUserid(userid){
        return bookshelf.knex.raw(queries.FETCH_BANK_BY_USER_ID, {
            driver_id: userid
        });
    }
}
export default BankModel;