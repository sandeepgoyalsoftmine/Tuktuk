'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

var _users = require('../queries/users');

var queries = _interopRequireWildcard(_users);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TABLE_NAME = 'tbusers';

/**
 * User model.
 */

var Users = function (_bookshelf$Model) {
    (0, _inherits3.default)(Users, _bookshelf$Model);

    function Users() {
        (0, _classCallCheck3.default)(this, Users);
        return (0, _possibleConstructorReturn3.default)(this, (Users.__proto__ || (0, _getPrototypeOf2.default)(Users)).apply(this, arguments));
    }

    (0, _createClass3.default)(Users, [{
        key: 'tableName',
        get: function get() {
            return TABLE_NAME;
        }
    }, {
        key: 'hasTimestamps',
        get: function get() {
            return false;
        }
    }], [{
        key: 'checkLogin',
        value: function checkLogin(userid) {
            console.log("email ID    " + userid);
            return _db2.default.knex.raw(queries.CHECK_LOGIN, { 'userid': userid });
        }
    }, {
        key: 'fetchAllUsers',
        value: function fetchAllUsers() {
            return _db2.default.knex.raw(queries.FETCH_ALL_USER);
        }
    }, {
        key: 'fetchUserByToken',
        value: function fetchUserByToken(token) {
            return _db2.default.knex.raw(queries.FETCH_USER_BY_TOKEN, {
                'token': token
            });
        }
    }, {
        key: 'fetchCountsByUSerID',
        value: function fetchCountsByUSerID(userid) {
            return _db2.default.knex.raw(queries.FETCH_COUNT_BY_USER, {
                'userID': userid
            });
        }
    }, {
        key: 'fetchUserByUserID',
        value: function fetchUserByUserID(userid) {
            return _db2.default.knex.raw(queries.FETCH_USER_BY_USERID, {
                'userID': userid
            });
        }
    }, {
        key: 'getUserByEmail',
        value: function getUserByEmail(email) {
            return _db2.default.knex.raw(queries.FETCH_USER_BY_EMAIL, { 'email': email });
        }
    }]);
    return Users;
}(_db2.default.Model);

exports.default = Users;