import bookshelf from '../db';
import * as queries from './CustomerQueries';
const TABLE_NAME = 'tbcustomers';

/**
 * User model.
 */
class CustomerModel extends bookshelf.Model {

    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }
    static fetchCustomerDetailByUserID(user) {
        return bookshelf.knex.raw(queries.FETCH_CUSTOMER_DETAIL_BY_USERID, {
            'userID': user.userid,
            'email': user.email
        })
    };

    static fetchCustomerDetailBycustomer_ID(customer_id) {
        return bookshelf.knex.raw(queries.FETCH_CUSTOMER_DETAIL_BY_CUSTOMERID, {
            'customer_id': customer_id
        })
    };

}

export default CustomerModel;