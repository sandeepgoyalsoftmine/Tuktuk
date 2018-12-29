import {Router} from 'express';
import HttpStatus from 'http-status-codes';
import * as CustomerLoginEmailMobService from "./CustomerLoginEmailMobService";
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


export default router;