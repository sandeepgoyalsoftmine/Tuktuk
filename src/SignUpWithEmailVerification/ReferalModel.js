import bookshelf from '../db';
import * as queries from './ReferalQuery';
const TABLE_NAME = 'tbrefferalhistory';

/**
 * User model.
 */
class ReferalModel extends bookshelf.Model {

    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }
    static fetchReferalCountByCustomerId(customer_id){
        return bookshelf.knex.raw(queries.FETCH_COUNT_BY_CUSTOMER_ID, {
            'refferedby': customer_id
        })
    }
}
export default ReferalModel;