import {Router} from 'express';

import loginController from './controller/loginController'
import trackingController from './controller/trackingController'
import VehicleTypeController from './controller/VehicleTypeController';
import VehcileController from './controller/VehicleController';
import loginFbController from './CustomerFBLogin/CustomerLoginController'
import SignUpController from './SignUpWithEmailVerification/SignUpController';
import OtpController from './OtpForEmail/OtpController';
import CustomerLoginEmailMobController from './CustomerLoginEmailMob/CustomerLoginEmailMobController'
import BankController from './controller/BankController'
/**
 * Contains all API routes for the application.
 */
let router = Router();


router.use('/', loginController);
router.use('/tracking', trackingController);
router.use('/vehicle', VehicleTypeController);
router.use('/vehicles', VehcileController);
router.use('/customer', loginFbController);
router.use('/signup', SignUpController);
router.use('/otpverify', OtpController);
router.use('/customerLogin', CustomerLoginEmailMobController);
router.use('/bank', BankController);

export default router;
