'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var FETCH_USER_DETAIL = exports.FETCH_USER_DETAIL = '\n  SELECT u.userid, u.name, u.emailID  FROM tbuser AS u\n  WHERE u.userid =:userID\n';

var FETCH_USER_BY_USERID = exports.FETCH_USER_BY_USERID = ' Select u.userid, u.emailid from tbusers As u\n    WHERE u.userid =:userID\n';

var FETCH_USER_BY_TOKEN = exports.FETCH_USER_BY_TOKEN = '\n    Select u.userid, u.emailid, u.in_time, u.out_time, u.status from tbusers As u\n    WHERE u.token =:token\n';

var CHECK_LOGIN = exports.CHECK_LOGIN = '    Select userid, emailid, password, user_type from tbusers where emailid =:userid and user_type = 1\n';

var FETCH_ALL_USER = exports.FETCH_ALL_USER = ' Select userid, name, emailid, gender, dob, mobile_no from tbusers\n';

var FETCH_USER_BY_EMAIL = exports.FETCH_USER_BY_EMAIL = 'Select emailid, password, user_type from tbusers where emailid = :email';