import {Router} from 'express';
import HttpStatus from 'http-status-codes';
import * as user from '../services/userService'

let router = Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    let contextPath = req.protocol + '://' + req.get('host');
    res.render('index', {path: contextPath, header: 'Login', operation: ''});
});

router.get('/getAttendance', (req, res, next) =>
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

router.post('/login', (req, res, next) =>
{
    console.log("User request:",req.body);
    user.login(req.body, res)
        .then(result =>
        {
            if('errorCode' in result){
                return res.status(HttpStatus.OK).json({
                    status : 'Success',
                    statusCode :400,
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

router.get('/loginHistory', function(req, res, next) {
    let contextPath = req.protocol + '://' + req.get('host');
    if(req.session.userID!=undefined) {
        user.getUserByEmail(req.session.userID).then(result => {
            console.log("result 0 ",result)
            if (result.length == 1) {
                var usertype = parseInt(result[0].user_type);
                if (parseInt(result[0].user_type) == 1) {
                    user.getUsers()
                        .then(result1 => {
                            res.render('loginHistory', {
                                path: contextPath, header: 'Attendence Sheet', operation: '',
                                data: result1,
                                access1: 'true'
                            });
                        })
                }
                else {
                    res.render('loginHistory', {path: contextPath, header: 'Attendence Sheet', operation: '', access1: 'false'});
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
                return res.status(HttpStatus.OK).json({
                    status : 'Success',
                    statusCode : result.errorCode,
                    message: result.message
                });
                (result.errorCode).json(result);
            }
            let contextPath = req.protocol + '://' + req.get('host');
            return res.status(HttpStatus.OK).json({
                statusCode : result,
                message : '',
                data : result
            });
        })


});

router.post('/attendance', (req, res, next)=>
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



export default router;