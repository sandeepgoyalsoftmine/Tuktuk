import {Router} from 'express';
import HttpStatus from 'http-status-codes';
import * as userService from "../services/userService";
import * as RefferalService from '../services/RefferalService';
import * as BankService from "../services/BankService";


// import dateformat from "date-utils";


let router = Router();

router.get('/', function(req, res, next) {
    let contextPath = req.protocol + '://' + req.get('host');
    if(req.session.userID!=undefined) {
        userService.getUserByEmail(req.session.userID).then(result => {
            console.log("result 0 ",result)
            if (result.length == 1) {
                var usertype = parseInt(result[0].user_type);
                if (parseInt(result[0].user_type) == 1) {
                    RefferalService.getRefferals()
                        .then(result1 => {
                            console.log("Bank Details "+ JSON.stringify(result1));
                            res.render('AddDiscount', {
                                path: contextPath, header: 'Add Refferal Discount', operation: '',
                                data: result1,
                                access1: 'true'
                            });
                        })
                }
                else {
                    res.render('AddDiscount', {path: contextPath, header: 'Add Refferal Discount', operation: '', access1: 'false'});
                }
            } else {
                res.render('index', {path: contextPath, header: 'Login', operation: '', access1: 'false'});
            }
        })
    }else{
        res.render('index', {path: contextPath, header: 'Login', operation: '', access1:'false'});
    }
});

router.post('/create' ,(req, res, next)=>
{
    console.log("in refferal controller", req);
    RefferalService.createDiscount(req.body, req.session.userID)
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

export default router;