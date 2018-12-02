'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loginEmail = exports.getUsers = exports.updateUser = exports.createUser = exports.getCounts = exports.checkDuplicateEmail = exports.registerFbUser = exports.getUserByEmail = exports.markAttendance = exports.getAttendance = exports.login = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var login = exports.login = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(reqData, res) {
        var _this = this;

        var userData, token;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return _Users2.default.checkLogin(reqData.userID);

                    case 2:
                        userData = _context2.sent;

                        console.log("userDatsa " + (0, _stringify2.default)(userData[0]));

                        if (!(userData[0].length < 1)) {
                            _context2.next = 6;
                            break;
                        }

                        return _context2.abrupt('return', { errorCode: HttpStatus.BAD_REQUEST, message: 'User not exists' });

                    case 6:
                        if (!(userData[0][0].password != reqData.password)) {
                            _context2.next = 8;
                            break;
                        }

                        return _context2.abrupt('return', { errorCode: HttpStatus.BAD_REQUEST, message: 'Incorrect password' });

                    case 8:
                        if (!(userData[0].length == 1)) {
                            _context2.next = 16;
                            break;
                        }

                        token = generateToken(reqData.userid);
                        _context2.next = 12;
                        return _db2.default.transaction(function () {
                            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(t) {
                                return _regenerator2.default.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                _context.next = 2;
                                                return UsersDao.updateRow(userData[0][0].userid, { token: token, last_login: new Date() }, t);

                                            case 2:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, _this);
                            }));

                            return function (_x3) {
                                return _ref2.apply(this, arguments);
                            };
                        }());

                    case 12:
                        res.setHeader('TUKTUK_TOKEN', token);
                        return _context2.abrupt('return', { message: 'Login Successfully' });

                    case 16:
                        return _context2.abrupt('return', { errorCode: HttpStatus.BAD_REQUEST, message: 'Already Login' });

                    case 17:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function login(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var getAttendance = exports.getAttendance = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(token, req) {
        var userData, att, obj;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return _Users2.default.fetchUserByToken(token);

                    case 2:
                        userData = _context3.sent;

                        if (!(userData[0] < 1)) {
                            _context3.next = 5;
                            break;
                        }

                        return _context3.abrupt('return', { errorCode: HttpStatus.UNAUTHORIZED, message: 'Invalid Token' });

                    case 5:
                        att = userData1[0][0].status == 1 ? userData1[0][0].in_time : userData1[0][0].out_time;
                        obj = {
                            emialid: userData1[0][0].emailid,
                            attendance: userData1[0][0].status,
                            time: att
                        };
                        return _context3.abrupt('return', obj);

                    case 8:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function getAttendance(_x4, _x5) {
        return _ref3.apply(this, arguments);
    };
}();

var markAttendance = exports.markAttendance = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(reqData, token) {
        var _this2 = this;

        var userData, userData1, att, obj;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return _Users2.default.fetchUserByToken(token);

                    case 2:
                        userData = _context6.sent;

                        if (!(userData[0].length < 1)) {
                            _context6.next = 5;
                            break;
                        }

                        return _context6.abrupt('return', { errorCode: HttpStatus.UNAUTHORIZED, message: 'Invalid Token' });

                    case 5:
                        if (!(parseInt(userData[0][0].status) == parseInt(reqData.attendance))) {
                            _context6.next = 11;
                            break;
                        }

                        if (!(parseInt(userData[0][0].status) == 1)) {
                            _context6.next = 10;
                            break;
                        }

                        return _context6.abrupt('return', { errorCode: HttpStatus.CONFLICT, message: 'Already punch in' });

                    case 10:
                        return _context6.abrupt('return', { errorCode: HttpStatus.CONFLICT, message: 'Already punch out' });

                    case 11:
                        if (!(parseInt(reqData.attendance) == 1)) {
                            _context6.next = 16;
                            break;
                        }

                        _context6.next = 14;
                        return _db2.default.transaction(function () {
                            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(t) {
                                return _regenerator2.default.wrap(function _callee4$(_context4) {
                                    while (1) {
                                        switch (_context4.prev = _context4.next) {
                                            case 0:
                                                _context4.next = 2;
                                                return UsersDao.updateRow(userData[0][0].userid, { in_time: new Date(), status: 1 }, t);

                                            case 2:
                                            case 'end':
                                                return _context4.stop();
                                        }
                                    }
                                }, _callee4, _this2);
                            }));

                            return function (_x8) {
                                return _ref5.apply(this, arguments);
                            };
                        }());

                    case 14:
                        _context6.next = 18;
                        break;

                    case 16:
                        _context6.next = 18;
                        return _db2.default.transaction(function () {
                            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(t) {
                                return _regenerator2.default.wrap(function _callee5$(_context5) {
                                    while (1) {
                                        switch (_context5.prev = _context5.next) {
                                            case 0:
                                                _context5.next = 2;
                                                return UsersDao.updateRow(userData[0][0].userid, { out_time: new Date(), status: 0 }, t);

                                            case 2:
                                            case 'end':
                                                return _context5.stop();
                                        }
                                    }
                                }, _callee5, _this2);
                            }));

                            return function (_x9) {
                                return _ref6.apply(this, arguments);
                            };
                        }());

                    case 18:
                        _context6.next = 20;
                        return _Users2.default.fetchUserByToken(token);

                    case 20:
                        userData1 = _context6.sent;

                        if (!(userData1[0] < 1)) {
                            _context6.next = 23;
                            break;
                        }

                        return _context6.abrupt('return', { errorCode: HttpStatus.UNAUTHORIZED, message: 'Invalid Token' });

                    case 23:
                        att = userData1[0][0].status == 1 ? userData1[0][0].in_time : userData1[0][0].out_time;
                        obj = {
                            emialid: userData1[0][0].emailid,
                            attendance: userData1[0][0].status,
                            time: att
                        };
                        return _context6.abrupt('return', obj);

                    case 26:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));

    return function markAttendance(_x6, _x7) {
        return _ref4.apply(this, arguments);
    };
}();

var getUserByEmail = exports.getUserByEmail = function () {
    var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(email) {
        var userDetails;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.next = 2;
                        return _Users2.default.getUserByEmail(email);

                    case 2:
                        userDetails = _context7.sent;
                        return _context7.abrupt('return', userDetails[0]);

                    case 4:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));

    return function getUserByEmail(_x10) {
        return _ref7.apply(this, arguments);
    };
}();

var registerFbUser = exports.registerFbUser = function () {
    var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(reqData, res) {
        var duplicate, result, _result;

        return _regenerator2.default.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        _context8.next = 2;
                        return checkDuplicateEmail(reqData.user);

                    case 2:
                        duplicate = _context8.sent;

                        console.log("duplicate value " + duplicate);

                        if (duplicate) {
                            _context8.next = 11;
                            break;
                        }

                        _context8.next = 7;
                        return createUser(reqData.user, res);

                    case 7:
                        result = _context8.sent;
                        return _context8.abrupt('return', result);

                    case 11:
                        _context8.next = 13;
                        return loginEmail(reqData.user, res);

                    case 13:
                        _result = _context8.sent;
                        return _context8.abrupt('return', _result);

                    case 15:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, this);
    }));

    return function registerFbUser(_x11, _x12) {
        return _ref8.apply(this, arguments);
    };
}();

var checkDuplicateEmail = exports.checkDuplicateEmail = function () {
    var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(user) {
        var data;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        console.log("userInfo " + user.userid);
                        _context9.next = 3;
                        return _Users2.default.fetchUserDetail(user);

                    case 3:
                        data = _context9.sent;

                        if (!(data[0].length > 0)) {
                            _context9.next = 6;
                            break;
                        }

                        return _context9.abrupt('return', true);

                    case 6:
                        return _context9.abrupt('return', false);

                    case 7:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, this);
    }));

    return function checkDuplicateEmail(_x13) {
        return _ref9.apply(this, arguments);
    };
}();

var getCounts = exports.getCounts = function () {
    var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(token, req) {
        var userID, counts;
        return _regenerator2.default.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        _context10.next = 2;
                        return _Users2.default.fetchUserByToken(token);

                    case 2:
                        userID = _context10.sent;
                        _context10.next = 5;
                        return _Users2.default.fetchCountsByUSerID(userID[0][0].userid);

                    case 5:
                        counts = _context10.sent;
                        return _context10.abrupt('return', {
                            message: '',
                            Counts: counts[0]
                        });

                    case 7:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _callee10, this);
    }));

    return function getCounts(_x14, _x15) {
        return _ref10.apply(this, arguments);
    };
}();

var createUser = exports.createUser = function () {
    var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(user, created_by, res) {
        var _this3 = this;

        var userData, newUserId;
        return _regenerator2.default.wrap(function _callee12$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        _context12.next = 2;
                        return _Users2.default.getUserByEmail(user.emailid);

                    case 2:
                        userData = _context12.sent;

                        console.log("userdata length " + userData[0]);

                        if (!(userData[0].length > 0)) {
                            _context12.next = 6;
                            break;
                        }

                        return _context12.abrupt('return', { errorCode: HttpStatus.CONFLICT, message: 'Email already exist' });

                    case 6:
                        _context12.next = 8;
                        return _db2.default.transaction(function () {
                            var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(t) {
                                var newUsers;
                                return _regenerator2.default.wrap(function _callee11$(_context11) {
                                    while (1) {
                                        switch (_context11.prev = _context11.next) {
                                            case 0:
                                                _context11.next = 2;
                                                return UsersDao.createRow({
                                                    name: user.name,
                                                    emailid: user.emailid,
                                                    gender: user.sex,
                                                    dob: user.age,
                                                    user_type: user.user_type,
                                                    mobile_no: user.mobile_number,
                                                    password: user.password,
                                                    address: user.address,
                                                    created_on: new Date(),
                                                    created_by: created_by
                                                }, t);

                                            case 2:
                                                newUsers = _context11.sent;
                                                return _context11.abrupt('return', newUsers.userid);

                                            case 4:
                                            case 'end':
                                                return _context11.stop();
                                        }
                                    }
                                }, _callee11, _this3);
                            }));

                            return function (_x19) {
                                return _ref12.apply(this, arguments);
                            };
                        }());

                    case 8:
                        newUserId = _context12.sent;
                        return _context12.abrupt('return', {
                            message: 'User Created Successfully.'
                        });

                    case 10:
                    case 'end':
                        return _context12.stop();
                }
            }
        }, _callee12, this);
    }));

    return function createUser(_x16, _x17, _x18) {
        return _ref11.apply(this, arguments);
    };
}();

var updateUser = exports.updateUser = function () {
    var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(token, reqData, userid) {
        var _this4 = this;

        var usersDetails;
        return _regenerator2.default.wrap(function _callee14$(_context14) {
            while (1) {
                switch (_context14.prev = _context14.next) {
                    case 0:
                        _context14.next = 2;
                        return _db2.default.transaction(function () {
                            var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(t) {
                                return _regenerator2.default.wrap(function _callee13$(_context13) {
                                    while (1) {
                                        switch (_context13.prev = _context13.next) {
                                            case 0:
                                                _context13.next = 2;
                                                return UsersDao.updateRow(userid, { photourl: reqData.photourl, name: reqData.name, emailid: reqData.emailid, dob: reqData.dob, gender: reqData.gender, mobile_no: reqData.mobile_no }, t);

                                            case 2:
                                            case 'end':
                                                return _context13.stop();
                                        }
                                    }
                                }, _callee13, _this4);
                            }));

                            return function (_x23) {
                                return _ref14.apply(this, arguments);
                            };
                        }());

                    case 2:
                        _context14.next = 4;
                        return _Users2.default.fetchUserByUserID(userid);

                    case 4:
                        usersDetails = _context14.sent;
                        return _context14.abrupt('return', {
                            UserDetails: usersDetails[0],
                            message: 'Updated Successfully'
                        });

                    case 6:
                    case 'end':
                        return _context14.stop();
                }
            }
        }, _callee14, this);
    }));

    return function updateUser(_x20, _x21, _x22) {
        return _ref13.apply(this, arguments);
    };
}();

var getUsers = exports.getUsers = function () {
    var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
        var users;
        return _regenerator2.default.wrap(function _callee15$(_context15) {
            while (1) {
                switch (_context15.prev = _context15.next) {
                    case 0:
                        _context15.next = 2;
                        return _Users2.default.fetchAllUsers();

                    case 2:
                        users = _context15.sent;

                        console.log("userLists " + (0, _stringify2.default)(users));
                        return _context15.abrupt('return', {
                            UserDetails: users[0],
                            message: ''
                        });

                    case 5:
                    case 'end':
                        return _context15.stop();
                }
            }
        }, _callee15, this);
    }));

    return function getUsers() {
        return _ref15.apply(this, arguments);
    };
}();

var loginEmail = exports.loginEmail = function () {
    var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(user, res) {
        var _this5 = this;

        var token, usersDetails;
        return _regenerator2.default.wrap(function _callee17$(_context17) {
            while (1) {
                switch (_context17.prev = _context17.next) {
                    case 0:
                        token = generateToken(user.userid);
                        _context17.next = 3;
                        return _db2.default.transaction(function () {
                            var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(t) {
                                return _regenerator2.default.wrap(function _callee16$(_context16) {
                                    while (1) {
                                        switch (_context16.prev = _context16.next) {
                                            case 0:
                                                _context16.next = 2;
                                                return UsersDao.updateRow(user.userid, { last_login: new Date(), token: token }, t);

                                            case 2:
                                            case 'end':
                                                return _context16.stop();
                                        }
                                    }
                                }, _callee16, _this5);
                            }));

                            return function (_x26) {
                                return _ref17.apply(this, arguments);
                            };
                        }());

                    case 3:
                        _context17.next = 5;
                        return _Users2.default.fetchUserByUserID(user.userid);

                    case 5:
                        usersDetails = _context17.sent;


                        res.setHeader('DRPEDIA_TOKEN', token);

                        return _context17.abrupt('return', {
                            UserDetails: usersDetails[0],
                            message: 'Login Successfully'
                        });

                    case 8:
                    case 'end':
                        return _context17.stop();
                }
            }
        }, _callee17, this);
    }));

    return function loginEmail(_x24, _x25) {
        return _ref16.apply(this, arguments);
    };
}();
/**
 * Generate  token by user id.
 *
 * @param deviceId
 * @returns {string}
 */


exports.generateToken = generateToken;

var _Users = require('../models/Users');

var _Users2 = _interopRequireDefault(_Users);

var _users = require('../dao/users');

var UsersDao = _interopRequireWildcard(_users);

var _microtime = require('microtime');

var _microtime2 = _interopRequireDefault(_microtime);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

var _index = require('http-status-codes/index');

var HttpStatus = _interopRequireWildcard(_index);

var _AttendenceSchema = require('../schema/domain/response/AttendenceSchema');

var _AttendenceSchema2 = _interopRequireDefault(_AttendenceSchema);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateToken(userid) {
    var dbhash = _microtime2.default.now().toString() + userid;
    return _crypto2.default.createHash('md5').update(dbhash).digest('hex');
}