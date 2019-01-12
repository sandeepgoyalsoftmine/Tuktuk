import {Router} from 'express';
import HttpStatus from 'http-status-codes';
import * as RideService from "../services/RideService";
import {checkToken, checkTokenCustomer} from "../middlewares/HeaderValidators";
import * as user from "../services/userService";
let router = Router();
router.put('/customerRating', checkToken ,(req, res, next)=>
{
    console.log("in ride controller");
    RideService.createCustomerRating(req.get('TUKTUK_TOKEN'),req.body)
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

router.get('/', function(req, res, next) {
    let contextPath = req.protocol + '://' + req.get('host');
    if(req.session.userID!=undefined) {
        user.getUserByEmail(req.session.userID).then(result => {
            console.log("result 0 ",result)
            if (result.length == 1) {
                var usertype = parseInt(result[0].user_type);
                if (parseInt(result[0].user_type) == 1) {
                    RideService.getRides()
                        .then(result1 => {
                            res.render('BookingPanel', {
                                path: contextPath, header: 'Booking Panel', operation: '',
                                data: result1,
                                access1: 'true'
                            });
                        })
                }
                else {
                    res.render('BookingPanel', {path: contextPath, header: 'Booking Panel', operation: '', access1: 'false'});
                }
            } else {
                res.render('index', {path: contextPath, header: 'Login', operation: '', access1: 'false'});
            }
        })
    }else{
        res.render('index', {path: contextPath, header: 'Login', operation: '', access1:'false'});
    }
});

router.put('/driverRating', checkTokenCustomer ,(req, res, next)=>
{
    console.log("in ride controller");
    RideService.createDriverRating(req.get('TUKTUK_TOKEN'),req.body)
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