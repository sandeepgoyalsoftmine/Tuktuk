import {Router} from 'express';
import passport from 'passport';
import HttpStatus from 'http-status-codes';
import * as CustomerService from './CustomerService';
import {checkToken, checkTokenCustomer} from "../middlewares/HeaderValidators";
import * as user from "../services/userService";
import * as RideService from "../services/RideService";


let FacebookTokenStrategy = require('passport-facebook-token');

let router = Router();

passport.use(new FacebookTokenStrategy(
    {
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_APP_SECRET,
        profileFields: ['id', 'emails', 'name', 'gender','birthday',   ]
    },
    function (accessToken, refreshToken, profile, done) {

        console.log("fb info" + JSON.stringify(profile));
        let user = {
            'email': profile.emails[0].value,
            'name': profile.name.givenName + ' ' + profile.name.familyName,
            'userid': profile.id,
            'gender': profile.gender,
            'photos' : profile.photos[0].value,
            'dob': profile._json.birthday,
            'token': accessToken
        };
        console.log("user data " + user.email + "  email " + profile.emails[0].value);
        return done(null, user);
    }

));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

router.post('/loginfb', passport.authenticate('facebook-token', {scope: ['email']}), (req, res) => {
    if (req.user) {
        console.log(" information " + JSON.stringify(req.user));
        CustomerService.registerFbUser(req.get('device_type'), req.get('version'),req,req.get('DEVICE_TOKEN'), res)
            .then(result => {
                return res.status(HttpStatus.OK).json({
                    statusCode: '200',
                    message: '',
                    data: result
                });
            });
    }
    else {
        return res.status(HttpStatus.OK).json({
            statusCode: 400,
            message: 'Invalid token'
        });
    }
});

router.get('/customerHistory', checkTokenCustomer, (req, res, next)=>
{
    CustomerService.customerHistory(req.get('TUKTUK_TOKEN'))
        .then(result => {
            console.log("result "+ JSON.stringify(result));
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

router.get('/', function(req, res, next) {
    let contextPath = req.protocol + '://' + req.get('host');
    if(req.session.userID!=undefined) {
        user.getUserByEmail(req.session.userID).then(result => {
            console.log("result 0 ",result)
            if (result.length == 1) {
                var usertype = parseInt(result[0].user_type);
                if (parseInt(result[0].user_type) == 1) {
                    CustomerService.getCustomers()
                        .then(result1 => {
                            console.log("customerlist "+ JSON.stringify(result1));
                            res.render('Customer', {
                                path: contextPath, header: 'Customer List', operation: '',
                                data: result1,
                                access1: 'true'
                            });
                        })
                }
                else {
                    res.render('Customer', {path: contextPath, header: 'Customer List', operation: '', access1: 'false'});
                }
            } else {
                res.render('index', {path: contextPath, header: 'Login', operation: '', access1: 'false'});
            }
        })
    }else{
        res.render('index', {path: contextPath, header: 'Login', operation: '', access1:'false'});
    }
});

export default router;