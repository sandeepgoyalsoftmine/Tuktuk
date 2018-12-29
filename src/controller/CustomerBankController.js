import {Router} from 'express';
import {checkToken} from '../middlewares/HeaderValidators';
import HttpStatus from 'http-status-codes';
import * as userService from "../services/userService";
import * as CustomerBankService from '../services/CustomerBankService';
import * as VehicleService from "../services/VehicleService";

// import dateformat from "date-utils";


let router = Router();

router.post('/create' ,(req, res, next)=>
{
    console.log("in bank controller", req);
    CustomerBankService.createBankDetails(req.body, req.session.userID)
        .then(result => {
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

router.put('/edit/:id', (req, res, next)=>
{
    console.log("request "+ JSON.stringify(req.body));
    CustomerBankService.updateBankDetails(req.body, req.session.userID,req.params.id )
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

router.get('/getBankDetails', function(req, res, next) {
    let contextPath = req.protocol + '://' + req.get('host');
    if(req.session.userID!=undefined) {
        userService.getUserByEmail(req.session.userID).then(result => {
            console.log("result 0 ",result)
            if (result.length == 1) {
                var usertype = parseInt(result[0].user_type);
                if (parseInt(result[0].user_type) == 1) {
                    CustomerBankService.getBankDetails()
                        .then(result1 => {
                            console.log("Bank Details "+ JSON.stringify(result1));
                            res.render('BankDetails', {
                                path: contextPath, header: 'Bank Details', operation: '',
                                data: result1,
                                access1: 'true'
                            });
                        })
                }
                else {
                    res.render('BankDetails', {path: contextPath, header: 'Bank Details', operation: '', access1: 'false'});
                }
            } else {
                res.render('index', {path: contextPath, header: 'Login', operation: '', access1: 'false'});
            }
        })
    }else{
        res.render('index', {path: contextPath, header: 'Login', operation: '', access1:'false'});
    }
});

router.get('/view/:id', function(req, res, next) {
    let contextPath = req.protocol + '://' + req.get('host');
    if(req.session.userID!=undefined) {
        userService.getUserByEmail(req.session.userID).then(result => {
            console.log("result 0 ",result)
            if (result.length == 1) {
                var usertype = parseInt(result[0].user_type);
                if (parseInt(result[0].user_type) == 1) {
                    CustomerBankService.getBankDetailsByBankID(req.params.id)
                        .then(result1 => {
                            console.log("bank details for edit "+ JSON.stringify(result1));
                            return res.status(HttpStatus.OK).json({
                                statusCode : 200,
                                message : '',
                                data: result1
                            });
                        })
                }
                else {
                    res.render('BankDetails', {path: contextPath, header: 'Bank Details', operation: '', access1: 'false'});
                }
            } else {
                res.render('index', {path: contextPath, header: 'Login', operation: '', access1: 'false'});
            }
        })
    }else{
        res.render('index', {path: contextPath, header: 'Login', operation: '', access1:'false'});
    }
});




router.get('/addBank/:id', function(req, res, next) {
    console.log("req.session.userID  "+req.session.userID);
    let contextPath = req.protocol + '://' + req.get('host');
    if(req.session.userID!=undefined) {
        userService.getUserByEmail(req.session.userID).then(result => {
            console.log("result 0 ",result)
            if (result.length == 1) {
                if (parseInt(result[0].user_type) ==1) {
                    userService.getUserByUserID(req.params.id)
                        .then(result1 => {

                            console.log(result);
                            res.render('AddBank', {
                                path: contextPath,
                                header: 'Add Bank',
                                operation: '',
                                data: result1,
                                access1: 'true'
                            });
                        })
                }
                else {
                    res.render('AddBank', {path: contextPath, header: 'Add Bank', operation: '', access1: 'false'});
                }
            } else {
                res.render('index', {path: contextPath, header: 'Login', operation: '', access1: 'false'});
            }
        })
    }else{
        res.render('index', {path: contextPath, header: 'Login', operation: '', access1:'false'});
    }
});


export default router;