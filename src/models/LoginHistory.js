import bookshelf from '../db';


const TABLE_NAME = 'tbloginhistory';
class LoginHistory extends bookshelf.Model {
    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }

}
export default LoginHistory;