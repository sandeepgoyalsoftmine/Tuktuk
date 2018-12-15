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
    static fetchUserByToken(token) {
        return bookshelf.knex.raw(queries.FETCH_USER_BY_TOKEN, {
            'token': token
        })
    };
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

}

export default Users;