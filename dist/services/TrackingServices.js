"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getAreaType = exports.getTrackingData = exports.createLocation = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var createLocation = exports.createLocation = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(token, reqData) {
        var _this = this;

        var userID, trackingID;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return _Users2.default.fetchUserByToken(token);

                    case 2:
                        userID = _context3.sent;

                        console.log(userID[0][0].emailid, (0, _stringify2.default)(reqData));
                        _context3.next = 6;
                        return _db2.default.transaction(function () {
                            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(t) {
                                var newLocation;
                                return _regenerator2.default.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                _context.next = 2;
                                                return TrackingDao.createRow({
                                                    emailid: userID[0][0].emailid,
                                                    lat: reqData.latitude,
                                                    lng: reqData.longitude,
                                                    datetime: reqData.dateTime,
                                                    tracking_type: reqData.trackingType,
                                                    created_on: new Date()
                                                }, t);

                                            case 2:
                                                newLocation = _context.sent;

                                            case 3:
                                            case "end":
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, _this);
                            }));

                            return function (_x3) {
                                return _ref2.apply(this, arguments);
                            };
                        }());

                    case 6:
                        trackingID = _context3.sent;

                        console.log("email    " + userID[0][0].emailid);

                        if (!(reqData.trackingType == 'L')) {
                            _context3.next = 11;
                            break;
                        }

                        _context3.next = 11;
                        return _db2.default.transaction(function () {
                            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(t) {
                                var newTrackingTempID;
                                return _regenerator2.default.wrap(function _callee2$(_context2) {
                                    while (1) {
                                        switch (_context2.prev = _context2.next) {
                                            case 0:
                                                _context2.next = 2;
                                                return TrackingTempDao.updateRow(userID[0][0].emailid, {
                                                    lat: reqData.latitude,
                                                    lng: reqData.longitude,
                                                    datetime: reqData.dateTime,
                                                    created_on: new Date()
                                                }, t);

                                            case 2:
                                                newTrackingTempID = _context2.sent;

                                            case 3:
                                            case "end":
                                                return _context2.stop();
                                        }
                                    }
                                }, _callee2, _this);
                            }));

                            return function (_x4) {
                                return _ref3.apply(this, arguments);
                            };
                        }());

                    case 11:
                        return _context3.abrupt("return", {
                            message: 'location saved successfully.'
                        });

                    case 12:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function createLocation(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var getTrackingData = exports.getTrackingData = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(userid, req) {
        var userID, locations;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        console.log("userid   " + userid);
                        _context4.next = 3;
                        return _Users2.default.fetchUserByUserID(userid);

                    case 3:
                        userID = _context4.sent;

                        console.log("in Services" + userID[0][0].emailid);
                        _context4.next = 7;
                        return _TrackingTemp2.default.fetchLocations(userID[0][0].emailid);

                    case 7:
                        locations = _context4.sent;
                        return _context4.abrupt("return", {
                            message: '',
                            locations: locations[0]
                        });

                    case 9:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function getTrackingData(_x5, _x6) {
        return _ref4.apply(this, arguments);
    };
}();

var getAreaType = exports.getAreaType = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req) {
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function getAreaType(_x7) {
        return _ref5.apply(this, arguments);
    };
}();

var _db = require("../db");

var _db2 = _interopRequireDefault(_db);

var _TrackingDao = require("../dao/TrackingDao");

var TrackingDao = _interopRequireWildcard(_TrackingDao);

var _TrackingTempDao = require("../dao/TrackingTempDao");

var TrackingTempDao = _interopRequireWildcard(_TrackingTempDao);

var _Users = require("../models/Users");

var _Users2 = _interopRequireDefault(_Users);

var _TrackingTemp = require("../models/TrackingTemp");

var _TrackingTemp2 = _interopRequireDefault(_TrackingTemp);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }