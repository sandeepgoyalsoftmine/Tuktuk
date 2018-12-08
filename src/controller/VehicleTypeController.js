import {Router} from 'express';
import HttpStatus from 'http-status-codes';
import * as VehicleService from '../services/VehicleService'
import path from 'path';
import * as user from "../services/userService";
import {checkToken} from "../middlewares/HeaderValidators";

let router = Router();
router.get('/',  function(req, res, next) {
    let contextPath = req.protocol + '://' + req.get('host');
    console.log("request "+req.session.userID);
    if(req.session.userID!=undefined) {
        user.getUserByEmail(req.session.userID).then(result => {
            console.log("result 0 ",result)
            if (result.length == 1) {
                var usertype = parseInt(result[0].user_type);
                if (parseInt(result[0].user_type) == 1) {
                    VehicleService.getVehicleType()
                        .then(result1 => {
                            res.render('VehicleType', {
                                path: contextPath, header: 'Vehcile Type', operation: '',
                                data: result1,
                                access1: 'true'
                            });
                        })
                }
                else {
                    res.render('VehicleType', {path: contextPath, header: 'Vehcile Type', operation: '', access1: 'false'});
                }
            } else {
                res.render('index', {path: contextPath, header: 'Login', operation: '', access1: 'false'});
            }
        })
    }else{
        res.render('index', {path: contextPath, header: 'Login', operation: '', access1:'false'});
    }
});
router.get('/getVehicleType',  (req, res, next) =>
{
    VehicleService.getVehicleType(res)
        .then(result =>
        {
            return res.status(HttpStatus.OK).json({
                statusCode : 200,
                message : '',
                data : result
            });
        })
});
router.get('/view/:id',  (req, res, next) =>
{

    VehicleService.getVehicleTypeByVehicleTypeID(req.params.id)
        .then(result =>
        {
            return res.status(HttpStatus.OK).json({
                statusCode : 200,
                message : '',
                data : result
            });
        })
});

router.post('/create', (req, res, next)=>
{
    console.log(req.session.userID, "test", req.body);
    VehicleService.createVehicleType(req.body, req.session.userID)
        .then(result => {
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

router.put('/edit/:id', (req, res, next)=>
{
    console.log("request "+ JSON.stringify(req.body));
    VehicleService.updateVehicleType(req.body, req.session.userID,req.params.id )
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



export default router;