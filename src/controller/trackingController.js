import {Router} from 'express';
import {checkToken} from '../middlewares/HeaderValidators';
import HttpStatus from 'http-status-codes';
import * as trackingService from "../services/TrackingServices";
import * as userServices from '../services/UserService';

// import dateformat from "date-utils";


let router = Router();

router.post('/create', (req, res, next)=>
{
    trackingService.createLocation(req.get('TUKTUK_TOKEN'),req.body)
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
    console.log("req.session.userID  "+req.session.userID);
    let contextPath = req.protocol + '://' + req.get('host');
    if(req.session.userID!=undefined) {
        userServices.getUserByEmail(req.session.userID).then(result => {
            console.log("result 0 ",result)
            if (result.length == 1) {
                if (parseInt(result[0].user_type) ==1) {
                    userServices.getEmployees()
                        .then(result1 => {

                            console.log(result);
                            res.render('tracking', {
                                path: contextPath,
                                header: 'Tracking',
                                operation: '',
                                data: result1,
                                access1: 'true'
                            });
                        })
                }
                else {
                    res.render('tracking', {path: contextPath, header: 'Tracking', operation: '', access1: 'false'});
                }
            } else {
                res.render('index', {path: contextPath, header: 'Login', operation: '', access1: 'false'});
            }
        })
    }else{
        res.render('index', {path: contextPath, header: 'Login', operation: '', access1:'false'});
    }






})

router.get('/track/:userid', (req, res, next) =>
{
    trackingService.getTrackingData(req.params.userid,req,res)
        .then(result =>
        {
            console.log(result);
            return res.status(HttpStatus.OK).json({
                statusCode : '200',
                message : '',
                data : result
            });
        })

});

// router.get('/test', (req, res, next) =>{
//
//     console.log(formattedDate)
//
// });

export default router;