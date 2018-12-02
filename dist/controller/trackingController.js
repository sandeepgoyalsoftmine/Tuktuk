'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _HeaderValidators = require('../middlewares/HeaderValidators');

var _httpStatusCodes = require('http-status-codes');

var _httpStatusCodes2 = _interopRequireDefault(_httpStatusCodes);

var _TrackingServices = require('../services/TrackingServices');

var trackingService = _interopRequireWildcard(_TrackingServices);

var _UserService = require('../services/UserService');

var userServices = _interopRequireWildcard(_UserService);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import dateformat from "date-utils";


var router = (0, _express.Router)();

router.post('/create', function (req, res, next) {
    trackingService.createLocation(req.get('TUKTUK_TOKEN'), req.body).then(function (result) {
        if ('errorCode' in result) {
            return res.status(result.errorCode).json(result);
        }
        var contextPath = req.protocol + '://' + req.get('host');
        return res.status(_httpStatusCodes2.default.OK).json({
            statusCode: '200',
            message: '',
            data: result
        });
    });
});

router.get('/', function (req, res, next) {
    console.log("req.session.userID  " + req.session.userID);
    var contextPath = req.protocol + '://' + req.get('host');
    if (req.session.userID != undefined) {
        userServices.getUserByEmail(req.session.userID).then(function (result) {
            console.log("result 0 ", result);
            if (result.length == 1) {
                if (parseInt(result[0].user_type) == 1) {
                    userServices.getUsers().then(function (result1) {

                        console.log(result);
                        res.render('tracking', {
                            path: contextPath,
                            header: 'Tracking',
                            operation: '',
                            data: result1,
                            access1: 'true'
                        });
                    });
                } else {
                    res.render('tracking', { path: contextPath, header: 'Tracking', operation: '', access1: 'false' });
                }
            } else {
                res.render('index', { path: contextPath, header: 'Login', operation: '', access1: 'false' });
            }
        });
    } else {
        res.render('index', { path: contextPath, header: 'Login', operation: '', access1: 'false' });
    }
});

router.get('/track/:userid', function (req, res, next) {
    trackingService.getTrackingData(req.params.userid, req, res).then(function (result) {
        console.log(result);
        return res.status(_httpStatusCodes2.default.OK).json({
            statusCode: '200',
            message: '',
            data: result
        });
    });
});

// router.get('/test', (req, res, next) =>{
//
//     console.log(formattedDate)
//
// });

exports.default = router;