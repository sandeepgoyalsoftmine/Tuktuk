import bookshelf from '../db';
import * as queries from '../queries/users';
const TABLE_NAME = 'tbusers';

/**
 * User model.
 */
class Users extends bookshelf.Model {

    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }
    static fetchStatusByToken(token){
        return bookshelf.knex.raw(queries.FETCH_USERSTATUS_BY_TOKEN, {
            'token': token
        })
    }

    static checkLogin(userid, usertype1){
        console.log("email ID    "+userid);
        return bookshelf.knex.raw(queries.CHECK_LOGIN, {'userid': userid, 'usertype': usertype1 });
    }
    static fetchUserDetailsByToken(token){
        return bookshelf.knex.raw(queries.FETCH_USER_DETAILS_BY_TOKEN, {
            'token': token
        })
    }
    static fetchAllUsers() {
        return bookshelf.knex.raw(queries.FETCH_ALL_USER
        )
    };
    static fetchAllEmployees() {
        return bookshelf.knex.raw(queries.FETCH_ALL_EMPLOYEES
        )
    };
    static fetchDrivers(){
        return bookshelf.knex.raw(queries.FETCH_DRIVERS
        )
    }
    static fetchDriverIds(){
        return bookshelf.knex.raw(queries.FETCH_DRIVERS_ID
        )
    }
    static fetchDriversList(){
        return bookshelf.knex.raw(queries.FETCH_DRIVERS_LIST);
    }
    static fetchUserByToken(token) {
        return bookshelf.knex.raw(queries.FETCH_USER_BY_TOKEN, {
            'token': token
        })
    };

    static fetchDriverByToken(token) {
        return bookshelf.knex.raw(queries.FETCH_DRIVER_BY_TOKEN, {
            'token': token
        })
    };
    static fetchDiverDocuments(token){
        return bookshelf.knex.raw(queries.FETCH_DRIVER_DOCUMENTS_TOKEN, {
            'token': token
        })
    }
    static fetchAttendanceDetails(token) {
        return bookshelf.knex.raw(queries.FETCH_ATTENDANCE_DETAILS_BY_TOKEN, {
            'token': token
        })
    };
    static fetchCountsByUSerID(userid) {
        return bookshelf.knex.raw(queries.FETCH_COUNT_BY_USER, {
            'userID' : userid
        })
    };
    static fetchUserByUserID(userid){
        return bookshelf.knex.raw(queries.FETCH_USER_BY_USERID, {
            'userID' : userid
        })
    }
    static fetchUserDocumentsByUserID(userid){
        return bookshelf.knex.raw(queries.FETCH_USER_DOCUMENT_BY_USERID, {
            'userID' : userid
        })
    }
    static getUserByEmail(email){
        return bookshelf.knex.raw(queries.FETCH_USER_BY_EMAIL, {'email': email});
    }
    static getUserByEmailAndUserID(email, userid){
        return bookshelf.knex.raw(queries.FETCH_USER_BY_EMAIL_AND_USERID, {
            'userID' : userid,
            'emailid': email
        })
    }
    static fetchUnassignedDrivers(){
        return bookshelf.knex.raw(queries.FETCH_UNASSIGNED_DRIVERS);
    }

    static fetchUserDetail(user) {
        return bookshelf.knex.raw(queries.FETCH_USER_DETAIL, {
            'userID': user.userid
        })
    };
    static fetchUserIDByMobileNumber(mobile_no){
        return bookshelf.knex.raw(queries.fetchUserIDByMobileNumber, {
            mobile_no: mobile_no
        })
    }
    static fetchRideIDFromRideDetailsByDriverID(driver_id, status){
        return bookshelf.knex.raw(queries.fetchUserMobileNumberByIDANdStatus, {
            driver_id: driver_id,
            status:status
        })
    }
    static fetchMobileNumberByUserID(userid){
        return bookshelf.knex.raw(queries.FETCH_MOBILE_NO_BY_USER_ID, {
            userid: userid
        })
    }
    static fetchDriverHistory(userid){
        return bookshelf.knex.raw(queries.FETCH_DRIVER_RIDE_HISTORY, {
            userid: userid
        })
    }

}

export default Users;