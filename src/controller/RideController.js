import {Router} from 'express';
import HttpStatus from 'http-status-codes';
import * as RideService from "../services/RideService";
import {checkToken, checkTokenCustomer} from "../middlewares/HeaderValidators";
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