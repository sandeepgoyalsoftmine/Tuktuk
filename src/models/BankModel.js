import bookshelf from '../db';


const TABLE_NAME = 'tbbank';
class BankModel extends bookshelf.Model {
    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }

}
export default BankModel;