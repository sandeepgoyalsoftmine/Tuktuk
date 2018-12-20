import bookshelf from '../db';
import * as queries from './UserQueries';
const TABLE_NAME = 'tbcustomers';

/**
 * User model.
 */
class UserModel extends bookshelf.Model {

    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }
    static fetchUserWithEmailMobile(email, mobile_no) {
        return bookshelf.knex.raw(queries.FETCH_USER_WITH_EMAIL_MOBILE, {
            'mobile_no': mobile_no,
            'email': email
        })
    };
    static fetchOtpForEmail(token, otp){
        return bookshelf.knex.raw(queries.FETCH_OTP_WITH_token, {
            'email_otp': otp,
            'token': token
        })
    }
    static fetchCustomerwithToken(token){
        return bookshelf.knex.raw(queries.FETCH_CUSTOMER_WITH_token, {
            'token': token
        })
    }

}

export default UserModel;