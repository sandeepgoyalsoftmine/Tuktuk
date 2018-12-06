import {Router} from 'express';
import HttpStatus from 'http-status-codes';
import * as VehicleService from '../services/VehicleService'
import path from 'path';

let router = Router();
router.get('/getVehicleType', (req, res, next) =>
{

    VehicleService.getVehicleType(req.get('TUKTUK_TOKEN'),res)
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