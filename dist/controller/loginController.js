'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _express = require('express');

var _httpStatusCodes = require('http-status-codes');

var _httpStatusCodes2 = _interopRequireDefault(_httpStatusCodes);

var _userService = require('../services/userService');

var user = _interopRequireWildcard(_userService);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();

/* GET home page. */
router.get('/', function (req, res, next) {
    var contextPath = req.protocol + '://' + req.get('host');
    res.render('index', { path: contextPath, header: 'Login', operation: '' });
});

router.get('/getAttendance', function (req, res, next) {

    user.getAttendance(req.get('TUKTUK_TOKEN'), res).then(function (result) {
        return res.status(_httpStatusCodes2.default.OK).json({
            statusCode: 200,
            message: '',
            data: result
        });
    });
});

router.post('/login', function (req, res, next) {
    console.log("User request:", req.body);
    user.login(req.body, res).then(function (result) {
        if ('errorCode' in result) {
            return res.status(_httpStatusCodes2.default.OK).json({
                status: 'Success',
                statusCode: 400,
                message: result.message
            });
            result.errorCode.json(result);
        }
        console.log("result   ", result);
        req.session.userID = req.body.userID;
        req.session.role = result.role;
        req.session.save();
        res.status(_httpStatusCodes2.default.OK).json({
            status: 'Success',
            statusCode: 200,
            data: result
        });
    }).catch(function (err) {
        return next(err);
    });
});

router.get('/signup', function (req, res, next) {
    var contextPath = req.protocol + '://' + req.get('host');
    if (req.session.userID != undefined) {
        user.getUserByEmail(req.session.userID).then(function (result) {
            console.log("result 0 ", result);
            if (result.length == 1) {
                var usertype = parseInt(result[0].user_type);
                if (parseInt(result[0].user_type) == 1) {
                    res.render('signup', { path: contextPath, header: 'Sign Up', operation: '', access1: 'true', type1: usertype });
                } else {
                    res.render('signup', { path: contextPath, header: 'Sign Up', operation: '', access1: 'false' });
                }
            } else {
                res.render('index', { path: contextPath, header: 'Login', operation: '', access1: 'false' });
            }
        });
    } else {
        res.render('index', { path: contextPath, header: 'Login', operation: '', access1: 'false' });
    }
});

router.get('/loginHistory', function (req, res, next) {
    var contextPath = req.protocol + '://' + req.get('host');
    if (req.session.userID != undefined) {
        user.getUserByEmail(req.session.userID).then(function (result) {
            console.log("result 0 ", result);
            if (result.length == 1) {
                var usertype = parseInt(result[0].user_type);
                if (parseInt(result[0].user_type) == 1) {
                    user.getUsers().then(function (result1) {
                        res.render('loginHistory', {
                            path: contextPath, header: 'Attendence Sheet', operation: '',
                            data: result1,
                            access1: 'true'
                        });
                    });
                } else {
                    res.render('loginHistory', { path: contextPath, header: 'Attendence Sheet', operation: '', access1: 'false' });
                }
            } else {
                res.render('index', { path: contextPath, header: 'Login', operation: '', access1: 'false' });
            }
        });
    } else {
        res.render('index', { path: contextPath, header: 'Login', operation: '', access1: 'false' });
    }
});

router.post('/create', function (req, res, next) {
    console.log(req.session.userID + "   test   ", req.body);
    user.createUser(req.body, req.session.userID).then(function (result) {
        if ('errorCode' in result) {
            return res.status(_httpStatusCodes2.default.OK).json({
                status: 'Success',
                statusCode: result.errorCode,
                message: result.message
            });
            result.errorCode.json(result);
        }
        var contextPath = req.protocol + '://' + req.get('host');
        return res.status(_httpStatusCodes2.default.OK).json({
            statusCode: result,
            message: '',
            data: result
        });
    });
});

router.post('/attendance', function (req, res, next) {
    user.markAttendance(req.body, req.get('TUKTUK_TOKEN')).then(function (result) {
        console.log("result " + (0, _stringify2.default)(result));
        if ('errorCode' in result) {
            return res.status(result.errorCode).json({
                status: 'Success',
                statusCode: result.errorCode,
                message: result.message
            });
        }
        var contextPath = req.protocol + '://' + req.get('host');
        return res.status(_httpStatusCodes2.default.OK).json({
            statusCode: 200,
            message: '',
            data: result
        });
    });
});

exports.default = router;