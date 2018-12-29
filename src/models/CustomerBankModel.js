import bookshelf from '../db';
import * as queries from "../queries/CustomerBankQuery";


const TABLE_NAME = 'tbcustomerbank';
class CustomerBankModel extends bookshelf.Model {
    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }

    static fetchBankDetailsWithDriver(){
        return bookshelf.knex.raw(queries.FETCH_BANK_DETAILS_WITH_DRIVER);
    }
    static fetchBankDetailsByBankID(bankid){
        return bookshelf.knex.raw(queries.FETCH_BANK_DETAILS_BY_BANK_ID,{
            bank_id: bankid
        });
    }
}
export default CustomerBankModel;