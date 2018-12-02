import HttpStatus from 'http-status-codes';
import User from '../models/Users';
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
    console.log(req.get('DRPEDIA_TOKEN'));
    let token = req.get('DRPEDIA_TOKEN');
    if (!token)
    {
        req.session.destroy();
        res.statusCode = HttpStatus.FORBIDDEN;
        return res.json({errors: {auth: ['Header DRPEDIA_TOKEN contains no data.']}});
    }
    else
    {
        console.log(token+"   test");
        let user = await User.fetchUserByToken(token);
        console.log(user[0][0]);
        if(!user[0][0])
        {
            req.session.destroy();
            res.statusCode = HttpStatus.FORBIDDEN;
            return res.json({errors: {auth: ['Header DRPEDIA_TOKEN contains invalid Token.']}});
        }
    }
    next();
}

export {checkToken};
