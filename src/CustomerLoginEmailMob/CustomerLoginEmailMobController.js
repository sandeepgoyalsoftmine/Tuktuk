import {Router} from 'express';
import HttpStatus from 'http-status-codes';
import * as CustomerLoginEmailMobService from "./CustomerLoginEmailMobService";
import {checkToken, checkTokenCustomer} from "../middlewares/HeaderValidators";

let router = Router();

router.post('/', (req, res, next) =>
{
    console.log("Customer request:",req.body);
    CustomerLoginEmailMobService.login(req.get('device_type'), req.get('version'), req.body, req.get('DEVICE_TOKEN'),  res)
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

router.put('/deviceToken',checkTokenCustomer, (req, res, next)=>
{
    console.log("request "+ JSON.stringify(req.body));
    CustomerLoginEmailMobService.updateDeviceToken(req.get('TUKTUK_TOKEN'),req.get('DEVICE_TOKEN'))
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


router.get('/referalCount',checkTokenCustomer, (req, res, next) =>
{
    CustomerLoginEmailMobService.getReferalCount( req.get('TUKTUK_TOKEN'))
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
        })
});


export default router;