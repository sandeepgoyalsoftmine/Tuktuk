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
    static fetchCustomerIDByMobileNumber(mobile_no){
        return bookshelf.knex.raw(queries.FETCH_CUSTOMER_ID_BY_MOBILE_NUMBER, {
            mobile_no: mobile_no
        })
    }
    static fetchRideIDFromRideDetailsByCustomerID(customer_id, status){
        return bookshelf.knex.raw(queries.FETCH_RIDE_ID_FROM_RIDE_DETAILS_BY_CUSTOMER_ID, {
            customer_id: customer_id,
            status: status
        })
    }
    static fetchMobileNumberByCustomerId(customerID){
        return bookshelf.knex.raw(queries.FETCH_MOBILE_NO_BY_CUSTOMER_ID, {
            customer_id: customerID
        })
    }

}

export default CustomerLoginEmailMobModel;