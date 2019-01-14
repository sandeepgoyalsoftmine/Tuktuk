import {Router} from 'express';
import HttpStatus from 'http-status-codes';
import * as SignUpService from './SignUpService'

let router = Router();

import multer from 'multer';
import path from 'path';
import {checkToken, checkTokenCustomer} from "../middlewares/HeaderValidators";
import * as user from "../services/userService";
var myfileName =[];
// var imgPath = '../../../../apache8//Tuktuk_images';
var imgPath = '../../public/assets/upload';
var dbImagePath = '../../public/assets/upload';
var myfileName2 = [];
let randomString = function () {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

let storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, imgPath));
        },
        filename: function (req, file, cb) {
            console.log("file    "+file);
            let ext = path.extname(file.originalname);
            cb(null, randomString() + ext);
        }
    });
let isFileValid = true;
let upload = multer(
    {
        storage: storage,
        fileFilter: function (req, file, callback) {
            console.log("real name "+ file);
            let ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                console.log("extension   "+ ext);
                isFileValid = false;
                return callback(false, null);
            }
            callback(null, true);
        }
    });

router.post('/create', (req, res, next)=>
{
    console.log(req.session.userID+ "   test   ", req.body);
    SignUpService.createUser(req.body, req.get('device_type'), req.get('version'), res)
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



export default  router;