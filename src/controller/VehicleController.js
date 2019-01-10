import {Router} from 'express';
import {checkToken} from '../middlewares/HeaderValidators';
import HttpStatus from 'http-status-codes';
import * as user from "../services/userService";
import * as VehicleService from "../services/VehicleService";
import multer from 'multer';
import path from 'path';
let router = Router();

var myfileName2=[];
var imgPath = '../../public/images';
// var imgPath = '../../../../apache8//ONESS_Images';
var dbImagePath = '../../public/images';
// var dbImagePath = '/ONESS_Images';

let storage = multer.diskStorage(
    {
        destination: function (req, file, cb)
        {

            cb(null, path.join(__dirname,imgPath )  );
        },
        filename: function (req, file, cb)
        {
            var obj = {};
            console.log("original file" +file.originalname );
            var  myfileName1 = file.fieldname + "_" + Date.now() + "_" + file.originalname;
            obj.fieldname=file.fieldname;
            obj.imagepath = dbImagePath+"/"+myfileName1;
            myfileName2.push(obj);
            // console.log(myfileName2, " filename ");
            cb(null, myfileName1);
        }
    });
let isFileValid=true;
let upload = multer(
    {
        storage: storage
    });

router.get('/getVehicleDetails', (req, res, next) =>
{
    VehicleService.getVehicleDetailsByUserId(req.get('TUKTUK_TOKEN'))
        .then(result =>
        {
            if ('errorCode' in result) {
                return res.status(result.errorCode).json({
                    status : 'Success',
                    statusCode : result.errorCode,
                    message: result.message
                });
            }
            console.log("result for driver list "+ JSON.stringify(result));
            return res.status(HttpStatus.OK).json({
                statusCode : 200,
                message : '',
                data : result
            });
        })
});

router.get('/',  function(req, res, next) {
    let contextPath = req.protocol + '://' + req.get('host');
    console.log("request "+req.session.userID);
    if(req.session.userID!=undefined) {
        user.getUserByEmail(req.session.userID).then(result => {
            console.log("result 0 ",result)
            if (result.length == 1) {
                var usertype = parseInt(result[0].user_type);
                if (parseInt(result[0].user_type) == 1) {
                    VehicleService.getVehicleTypeWithUnassignedDriver()
                        .then(result1 => {
                            res.render('AddVehicle', {
                                path: contextPath, header: 'Add Vehicle', operation: '',
                                data: result1,
                                access1: 'true'
                            });
                        })
                }
                else {
                    res.render('AddVehicle', {path: contextPath, header: 'Add Vehicle', operation: '', access1: 'false'});
                }
            } else {
                res.render('index', {path: contextPath, header: 'Login', operation: '', access1: 'false'});
            }
        })
    }else{
        res.render('index', {path: contextPath, header: 'Login', operation: '', access1:'false'});
    }
});

var uploadimages = upload.fields([{ name: 'rcImage', maxCount: 1 }, { name: 'permitImage', maxCount: 1 },{name:'insuranceImage', maxCount:1}])
router.post('/create', uploadimages,(req, res, next)=>
{

    if (!isFileValid) {
        isFileValid = true;
        return res.status(HttpStatus.OK).json({
            statusCode: '200',
            message: 'Invalid File'
        });

    }
    else {
        console.log(req.session.userID, "test", req.body);
        console.log("filename  "+myfileName2+"   "+dbImagePath);
        if(myfileName2===undefined || myfileName2===""){
            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: '403',
                message: 'Invalid File.'
            });
        }
        VehicleService.createVehicle(myfileName2, dbImagePath, req.body, req.session.userID)
            .then(result => {
                if ('errorCode' in result) {
                    return res.status(result.errorCode).json({
                        status : 'Success',
                        statusCode : result.errorCode,
                        message: result.message
                    });
                }
                console.log(JSON.stringify(result));
                let contextPath = req.protocol + '://' + req.get('host');
                return res.status(HttpStatus.OK).json({
                    statusCode: 200,
                    message: '',
                    data: result
                });
            })

    }
});


router.get('/getVehicle', function(req, res, next) {
    let contextPath = req.protocol + '://' + req.get('host');
    if(req.session.userID!=undefined) {
        user.getUserByEmail(req.session.userID).then(result => {
            console.log("result 0 ",result)
            if (result.length == 1) {
                var usertype = parseInt(result[0].user_type);
                if (parseInt(result[0].user_type) == 1) {
                    VehicleService.getAllVehicle()
                        .then(result1 => {
                            res.render('VehicleList', {
                                path: contextPath, header: 'Vehicle List', operation: '',
                                data: result1,
                                access1: 'true'
                            });
                        })
                }
                else {
                    res.render('VehicleList', {path: contextPath, header: 'Vehicle List', operation: '', access1: 'false'});
                }
            } else {
                res.render('index', {path: contextPath, header: 'Login', operation: '', access1: 'false'});
            }
        })
    }else{
        res.render('index', {path: contextPath, header: 'Login', operation: '', access1:'false'});
    }
});


router.put('/edit', checkToken, (req, res, next)=>
{
    console.log("request "+ JSON.stringify(req.body));
    VehicleService.updateVehicle(req.body,req.get('TUKTUK_TOKEN'))
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