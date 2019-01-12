import {Router} from 'express';
import HttpStatus from 'http-status-codes';
import * as OTPGeneration from './OTPGeneration'
import * as SignUpService from "../";
import {checkTokenCustomer} from "../middlewares/HeaderValidators";

let router = Router();

router.post('/email',checkTokenCustomer, (req, res, next)=>
{
    OTPGeneration.otpVerifyForEmail(req.body, req.get('TUKTUK_TOKEN'),req.get('device_type'), req.get('version'), res)
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
router.post('/',checkTokenCustomer, (req, res, next)=>
{
    OTPGeneration.otpVerifyForMobile(req.body, req.get('TUKTUK_TOKEN'),req.get('device_type'), req.get('version'), res)
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

export default router;