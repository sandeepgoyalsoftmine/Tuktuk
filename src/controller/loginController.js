import {Router} from 'express';
import HttpStatus from 'http-status-codes';
import * as user from '../services/userService'
import * as schedule from '../schedule/schedule'
import * as DriverService from '../services/DriverService';

let router = Router();

import multer from 'multer';
import path from 'path';
import {checkToken} from "../middlewares/HeaderValidators";
var myfileName =[];
// var imgPath = '../../../../apache8//Tuktuk_images';
var imgPath = '../../public/images';
var dbImagePath = '../../public/images';
var myfileName2 = [];
let randomString = function () {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

let storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, imgPath));
        },
        filename: function (req, file, cb) {
            console.log("file    "+file);
            let ext = path.extname(file.originalname);
            cb(null, randomString() + ext);
        }
    });
let isFileValid = true;
let upload = multer(
    {
        storage: storage,
        fileFilter: function (req, file, callback) {
            console.log("real name "+ file);
            let ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                console.log("extension   "+ ext);
                isFileValid = false;
                return callback(false, null);
            }
            callback(null, true);
        }
    });
/* GET home page. */
router.get('/', function(req, res, next) {
    let contextPath = req.protocol + '://' + req.get('host');
    res.render('index', {path: contextPath, header: 'Login', operation: ''});
});

router.get('/getAttendance', checkToken, (req, res, next) =>
{
    user.getAttendance(req.get('TUKTUK_TOKEN'),res)
        .then(result =>
        {
            return res.status(HttpStatus.OK).json({
                statusCode : 200,
                message : '',
                data : result
            });
        })
});
router.get('/driverDocuments', checkToken, (req, res, next) =>
{
    user.getDriverDocuments(req.get('TUKTUK_TOKEN'),res)
        .then(result =>
        {
            return res.status(HttpStatus.OK).json({
                statusCode : 200,
                message : '',
                data : result
            });
        })
});
router.get('/driverDuty', checkToken, (req, res, next) =>
{
    user.getDriverDuty(req.get('TUKTUK_TOKEN'),res)
        .then(result =>
        {
            return res.status(HttpStatus.OK).json({
                statusCode : 200,
                message : '',
                data : result
            });
        })
});
router.get('/getStatus', checkToken, (req, res, next) =>
{

    user.getStatus(req.get('TUKTUK_TOKEN'),res)
        .then(result =>
        {
            return res.status(HttpStatus.OK).json({
                statusCode : 200,
                message : '',
                data : result
            });
        })
});
router.get('/getDriverList', (req, res, next) =>
{
    user.getAllDriversList(res)
        .then(result =>
        {
            console.log("result for driver list "+ JSON.stringify(result));
            return res.status(HttpStatus.OK).json({
                statusCode : 200,
                message : '',
                data : result
            });
        })
});
router.get('/start', (req, res, next) =>
{
    schedule.a()
        .then(result =>
        {
            console.log("result for driver list "+ JSON.stringify(result));
            return res.status(HttpStatus.OK).json({
                statusCode : 200,
                message : '',
                data : result
            });
        })
});
router.get('/view/:id', function(req, res, next) {
    let contextPath = req.protocol + '://' + req.get('host');
    if(req.session.userID!=undefined) {
        user.getUserByEmail(req.session.userID).then(result => {
            console.log("result 0 ",result)
            if (result.length == 1) {
                var usertype = parseInt(result[0].user_type);
                if (parseInt(result[0].user_type) == 1) {
                    user.getUserByUserID(req.params.id)
                        .then(result1 => {

                            return res.status(HttpStatus.OK).json({
                                statusCode : 200,
                                message : '',
                                data: result1
                            });
                        })
                }
                else {
                    res.render('users', {path: contextPath, header: 'Employee List', operation: '', access1: 'false'});
                }
            } else {
                res.render('index', {path: contextPath, header: 'Login', operation: '', access1: 'false'});
            }
        })
    }else{
        res.render('index', {path: contextPath, header: 'Login', operation: '', access1:'false'});
    }
});
router.get('/viewDoc/:id', function(req, res, next) {
    let contextPath = req.protocol + '://' + req.get('host');
    if(req.session.userID!=undefined) {
        user.getUserByEmail(req.session.userID).then(result => {
            console.log("result 0 ",result)
            if (result.length == 1) {
                var usertype = parseInt(result[0].user_type);
                if (parseInt(result[0].user_type) == 1) {
                    user.getUserDocByUserID(req.params.id)
                        .then(result1 => {

                            return res.status(HttpStatus.OK).json({
                                statusCode : 200,
                                message : '',
                                data : result1
                            });
                        })
                }
                else {
                    res.render('users', {path: contextPath, header: 'Employee List', operation: '', access1: 'false'});
                }
            } else {
                res.render('index', {path: contextPath, header: 'Login', operation: '', access1: 'false'});
            }
        })
    }else{
        res.render('index', {path: contextPath, header: 'Login', operation: '', access1:'false'});
    }
});


router.post('/login', (req, res, next) =>
{
    console.log("User request:",req.body);
    let userType = 3;
    user.login(req.body, userType,req.get('DEVICE_TOKEN'), res)
        .then(result =>
        {
            if('errorCode' in result){
                return res.status(result.errorCode).json({
                    status : 'Success',
                    statusCode :result.errorCode,
                    message: result.message
                });
                (result.errorCode).json(result);
            }
            console.log("result   ", result)
            req.session.userID=req.body.userID;
            req.session.role=result.role;
            req.session.save();
            res.status(HttpStatus.OK).json({
                status : 'Success',
                statusCode : 200,
                data : result
            });
        }).catch(err => next(err));
});
router.post('/loginPortal', (req, res, next) =>
{
    console.log("User request:",req.body);
    let usertype = 1;
    user.login(req.body, usertype,'', res)
        .then(result =>
        {
            if('errorCode' in result){
                return res.status(result.errorCode).json({
                    status : 'Success',
                    statusCode :result.errorCode,
                    message: result.message
                });
                (result.errorCode).json(result);
            }
            console.log("result   ", result)
            req.session.userID=req.body.userID;
            req.session.role=result.role;
            req.session.save();
            res.status(HttpStatus.OK).json({
                status : 'Success',
                statusCode : 200,
                data : result
            });
        }).catch(err => next(err));
});

router.get('/signup', function(req, res, next) {
    let contextPath = req.protocol + '://' + req.get('host');
    if(req.session.userID!=undefined) {
        user.getUserByEmail(req.session.userID).then(result => {
            console.log("result 0 ",result)
            if (result.length == 1) {
                var usertype = parseInt(result[0].user_type);
                if (parseInt(result[0].user_type) == 1) {
                    res.render('signup', {path: contextPath, header: 'Sign Up', operation: '', access1: 'true', type1:usertype});
                }
                else {
                    res.render('signup', {path: contextPath, header: 'Sign Up', operation: '', access1: 'false'});
                }
            } else {
                res.render('index', {path: contextPath, header: 'Login', operation: '', access1: 'false'});
            }
        })
    }else{
        res.render('index', {path: contextPath, header: 'Login', operation: '', access1:'false'});
    }
});
router.get('/getEmployee', function(req, res, next) {
    let contextPath = req.protocol + '://' + req.get('host');
    if(req.session.userID!=undefined) {
        user.getUserByEmail(req.session.userID).then(result => {
            console.log("result 0 ",result)
            if (result.length == 1) {
                var usertype = parseInt(result[0].user_type);
                if (parseInt(result[0].user_type) == 1) {
                    user.getEmployees()
                        .then(result1 => {
                            res.render('users', {
                                path: contextPath, header: 'Employee List', operation: '',
                                data: result1,
                                access1: 'true'
                            });
                        })
                }
                else {
                    res.render('users', {path: contextPath, header: 'Employee List', operation: '', access1: 'false'});
                }
            } else {
                res.render('index', {path: contextPath, header: 'Login', operation: '', access1: 'false'});
            }
        })
    }else{
        res.render('index', {path: contextPath, header: 'Login', operation: '', access1:'false'});
    }
});
router.get('/getDrivers', function(req, res, next) {
    let contextPath = req.protocol + '://' + req.get('host');
    if(req.session.userID!=undefined) {
        user.getUserByEmail(req.session.userID).then(result => {
            console.log("result 0 ",result)
            if (result.length == 1) {
                var usertype = parseInt(result[0].user_type);
                if (parseInt(result[0].user_type) == 1) {
                    user.getAllDrivers()
                        .then(result1 => {
                            res.render('driversList', {
                                path: contextPath, header: 'Driver List', operation: '',
                                data: result1,
                                access1: 'true'
                            });
                        })
                }
                else {
                    res.render('driversList', {path: contextPath, header: 'Driver List', operation: '', access1: 'false'});
                }
            } else {
                res.render('index', {path: contextPath, header: 'Login', operation: '', access1: 'false'});
            }
        })
    }else{
        res.render('index', {path: contextPath, header: 'Login', operation: '', access1:'false'});
    }
});

router.get('/getEmployeeAttendance', function(req, res, next) {
    let contextPath = req.protocol + '://' + req.get('host');
    console.log("request "+req.session.userID);
    if(req.session.userID!=undefined) {
        user.getUserByEmail(req.session.userID).then(result => {
            console.log("result 0 ",result)
            if (result.length == 1) {
                var usertype = parseInt(result[0].user_type);
                if (parseInt(result[0].user_type) == 1) {
                    user.getEmployeeAttendance()
                        .then(result1 => {
                            res.render('attendance', {
                                path: contextPath, header: 'Attendence Sheet', operation: '',
                                data: result1,
                                access1: 'true'
                            });
                        })
                }
                else {
                    res.render('attendance', {path: contextPath, header: 'Attendence Sheet', operation: '', access1: 'false'});
                }
            } else {
                res.render('index', {path: contextPath, header: 'Login', operation: '', access1: 'false'});
            }
        })
    }else{
        res.render('index', {path: contextPath, header: 'Login', operation: '', access1:'false'});
    }
});

router.post('/create', (req, res, next)=>
{
    console.log(req.session.userID+ "   test   ", req.body);
    user.createUser(req.body, req.session.userID)
        .then(result => {
            if('errorCode' in result){
                return res.status(result.errorCode).json({
                    status : 'Success',
                    statusCode : result.errorCode,
                    message: result.message
                });
            }
            let contextPath = req.protocol + '://' + req.get('host');
            return res.status(HttpStatus.OK).json({
                statusCode : 200,
                message : '',
                data : result
            });
        })
});
router.put('/edit', upload.single('image'), (req, res, next)=>
{
    console.log("request "+ JSON.stringify(req.body)+"  "+req.file);
    user.updateUser(req.body, req.get('TUKTUK_TOKEN'), req.file, dbImagePath )
        .then(result => {
            console.log("Reponse "+ JSON.stringify(result));
            if ('errorCode' in result) {
                return res.status(result.errorCode).json(result);
            }
            let contextPath = req.protocol + '://' + req.get('host');
            return res.status(HttpStatus.OK).json({
                statusCode : '200',
                message : '',
                data : result
            });
        })
});

router.put('/editDoc/:id', upload.single('image'), (req, res, next)=>
{
    console.log("request "+ JSON.stringify  (req.body)+"  "+req.file);
    user.updateUserForPortal(req.body, req.get('TUKTUK_TOKEN'), req.file, dbImagePath, req.params.id )
        .then(result => {
            console.log("Reponse "+ JSON.stringify(result));
            if ('errorCode' in result) {
                return res.status(result.errorCode).json(result);
            }
            let contextPath = req.protocol + '://' + req.get('host');
            return res.status(HttpStatus.OK).json({
                statusCode : '200',
                message : '',
                data : result
            });
        })
});
router.put('/userEdit/:id', (req, res, next)=>
{
    console.log("request "+ JSON.stringify(req.body));
    user.updateUserData(req.body, req.session.userID,req.params.id )
        .then(result => {
            console.log("Reponse "+ JSON.stringify(result));
            if ('errorCode' in result) {
                return res.status(result.errorCode).json({
                    status : 'Success',
                    statusCode : result.errorCode,
                    message: result.message
                });
            }
            let contextPath = req.protocol + '://' + req.get('host');
            return res.status(HttpStatus.OK).json({
                statusCode : '200',
                message : '',
                data : result
            });
        })
});
router.put('/deviceToken',checkToken, (req, res, next)=>
{
    console.log("request "+ JSON.stringify(req.body));
    user.updateDeviceToken(req.get('TUKTUK_TOKEN'),req.get('DEVICE_TOKEN'))
        .then(result => {
            console.log("Reponse "+ JSON.stringify(result));
            if ('errorCode' in result) {
                return res.status(result.errorCode).json({
                    status : 'Success',
                    statusCode : result.errorCode,
                    message: result.message
                });
            }
            let contextPath = req.protocol + '://' + req.get('host');
            return res.status(HttpStatus.OK).json({
                statusCode : '200',
                message : '',
                data : result
            });
        })
});
router.put('/updateStatus/:id', checkToken, (req, res, next)=>
{
    console.log("request "+ JSON.stringify(req.body));
    user.updateStatus(req.body,req.get('TUKTUK_TOKEN') ,req.params.id )
        .then(result => {
            console.log("Reponse "+ JSON.stringify(result));
            if ('errorCode' in result) {
                return res.status(result.errorCode).json({
                    status : 'Success',
                    statusCode : result.errorCode,
                    message: result.message
                });
            }
            let contextPath = req.protocol + '://' + req.get('host');
            return res.status(HttpStatus.OK).json({
                statusCode : '200',
                message : '',
                data : result
            });
        })
});
router.post('/attendance', checkToken, (req, res, next)=>
{
    user.markAttendance(req.body,  req.get('TUKTUK_TOKEN'))
        .then(result => {
            console.log("result "+ JSON.stringify(result));
            if('errorCode' in result){
                return res.status(result.errorCode).json({
                    status : 'Success',
                    statusCode : result.errorCode,
                    message: result.message
                });
            }
            let contextPath = req.protocol + '://' + req.get('host');
            return res.status(HttpStatus.OK).json({
                statusCode : 200,
                message : '',
                data : result
            });
        })
});

router.post('/driverDuty', checkToken, (req, res, next)=>
{
    user.driverDuty(req.body,  req.get('TUKTUK_TOKEN'))
        .then(result => {
            console.log("result "+ JSON.stringify(result));
            if('errorCode' in result){
                return res.status(result.errorCode).json({
                    status : 'Success',
                    statusCode : result.errorCode,
                    message: result.message
                });
            }
            let contextPath = req.protocol + '://' + req.get('host');
            return res.status(HttpStatus.OK).json({
                statusCode : 200,
                message : '',
                data : result
            });
        })
});
router.get('/driverHistory', checkToken, (req, res, next)=>
{
    user.driverHistory(req.get('TUKTUK_TOKEN'))
        .then(result => {
            console.log("result "+ JSON.stringify(result));
            if('errorCode' in result){
                return res.status(result.errorCode).json({
                    status : 'Success',
                    statusCode : result.errorCode,
                    message: result.message
                });
            }
            let contextPath = req.protocol + '://' + req.get('host');
            return res.status(HttpStatus.OK).json({
                statusCode : 200,
                message : '',
                data : result
            });
        })
});
router.post('/getEstimate', (req, res, next) =>
{
    DriverService.getEstimatedFare(req.body,res)
        .then(result =>
        {
            return res.status(HttpStatus.OK).json({
                statusCode : 200,
                message : '',
                data : result
            });
        })
});
router.post('/getInvoice', (req, res, next) =>
{
    DriverService.getInvoice(req.body, res)
        .then(result =>
        {
            return res.status(HttpStatus.OK).json({
                statusCode : 200,
                message : '',
                data : result
            });
        })
});



export default router;