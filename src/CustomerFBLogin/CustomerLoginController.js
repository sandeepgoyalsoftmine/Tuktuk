import {Router} from 'express';
import passport from 'passport';
import HttpStatus from 'http-status-codes';
import * as CustomerService from './CustomerService';


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
        CustomerService.registerFbUser(req, res)
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
            statusCode: '400',
            message: 'Invalid token'
        });
    }
});