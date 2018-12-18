import {Router} from 'express';
import HttpStatus from 'http-status-codes';
import * as OTPGeneration from './OTPGeneration'
import * as SignUpService from "../";

let router = Router();

router.post('/', (req, res, next)=>
{
    OTPGeneration.otpVerifyForEmail(req.body, req.get('TUKTUK_TOKEN'),req.get('device_type'), req.get('version'))
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