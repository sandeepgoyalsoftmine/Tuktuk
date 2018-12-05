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

    static checkLogin(userid, usertype1){
        console.log("email ID    "+userid);
        return bookshelf.knex.raw(queries.CHECK_LOGIN, {'userid': userid, 'usertype': usertype1 });
    }
    static fetchAllUsers() {
        return bookshelf.knex.raw(queries.FETCH_ALL_USER
        )
    };
    static fetchCompleteUsers(){
        return bookshelf.knex.raw(queries.FETCH_COMPLETE_USER
        )
    }
    static fetchUserByToken(token) {
        return bookshelf.knex.raw(queries.FETCH_USER_BY_TOKEN, {
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
    static getUserByEmail(email){
        return bookshelf.knex.raw(queries.FETCH_USER_BY_EMAIL, {'email': email});
    }
    static getUserByEmailAndUserID(email, userid){
        return bookshelf.knex.raw(queries.FETCH_USER_BY_EMAIL_AND_USERID, {
            'userID' : userid,
            'emailid': email
        })
    }

}

export default Users;