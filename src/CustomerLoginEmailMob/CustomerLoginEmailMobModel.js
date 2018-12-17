import bookshelf from '../db';
import * as queries from './CustomerLoginQueries';
const TABLE_NAME = 'tbcustomers';

/**
 * User model.
 */
class CustomerLoginEmailMobModel extends bookshelf.Model {

    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }

    static fetchCustomerDetailByEmailOrMobile(id) {
        return bookshelf.knex.raw(queries.FETCH_CUSTOMER_DETAIL_BY_ID, {
            'id': id
        })
    };
    static fetchCustomerByToken(token){
        return bookshelf.knex.raw(queries.FETCH_CUSTOMER_BY_TOKEN, {
            token: token
        })
    }

}

export default CustomerLoginEmailMobModel;