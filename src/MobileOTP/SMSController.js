import {Router} from 'express';
import HttpStatus from 'http-status-codes';

import * as SMSService from './SMSService';

let router = Router();
router.post('/', (req, res, next) =>
{
    SMSService.sendotp(req.body,req.get('TUKTUK_TOKEN'), req)
        .then(result =>
        {
            console.log("result for bank list "+ JSON.stringify(result));
            return res.status(HttpStatus.OK).json({
                statusCode : 200,
                message : '',
                data : result
            });
        })
});
export default router;