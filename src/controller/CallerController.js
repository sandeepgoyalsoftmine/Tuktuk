import * as CallerService from "../services/CallerService";
import HttpStatus from 'http-status-codes';
import {Router} from "express";
let router = Router();
router.post('/create' ,(req, res, next)=>
{
    console.log("in bank controller", );
    CallerService.createCaller(req.body)
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
router.put('/update' ,(req, res, next)=>
{
    console.log("in bank controller", );
    CallerService.updateCaller(req.body)
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