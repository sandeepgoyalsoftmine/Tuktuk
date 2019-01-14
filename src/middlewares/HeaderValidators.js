import HttpStatus from 'http-status-codes';
import User from '../models/Users';
import UserModel from "../SignUpWithEmailVerification/UserModel";
/**
 * Check if header DRPEDIA_TOKEN exists.
 *
 * @param req
 * @param res
 * @param next
 */
async function checkToken(req, res, next)
{
   // console.log(req);
    console.log(req.get('TUKTUK_TOKEN'));
    let token = req.get('TUKTUK_TOKEN');
    if (!token)
    {
        req.session.destroy();
        res.statusCode = HttpStatus.UNAUTHORIZED;
        return res.json({errors: {auth: ['Header TUKTUK_TOKEN contains no data.']}});
    }
    else
    {
        console.log(token+"   test");
        let user = await User.fetchUserByToken(token);
        console.log(user[0][0]);
        if(!user[0][0])
        {
            req.session.destroy();
            res.statusCode = HttpStatus.UNAUTHORIZED;
            return res.json({errors: {auth: ['Header TUKTUK_TOKEN contains invalid Token.']}});
        }
    }
    next();
}

async function checkTokenCustomer(req, res, next)
{
    // console.log(req);
    console.log(req.get('TUKTUK_TOKEN'));
    let token = req.get('TUKTUK_TOKEN');
    if (!token)
    {
        req.session.destroy();
        res.statusCode = HttpStatus.FORBIDDEN;
        return res.status(HttpStatus.UNAUTHORIZED).json({
            statusCode : 401,
            message: "Header TUKTUK_TOKEN contains No data"
        });
    }
    else
    {
        console.log(token+"   test");
        let user = await UserModel.fetchCustomerwithToken(token);
        console.log(user[0][0]);
        if(!user[0][0])
        {
            req.session.destroy();
            return res.status(HttpStatus.UNAUTHORIZED).json({
                statusCode : 401,
                message: "Header TUKTUK_TOKEN contains invalid data"
            });
        }
    }
    next();
}

export {checkToken, checkTokenCustomer};
