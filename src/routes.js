import {Router} from 'express';

import loginController from './controller/loginController'
import trackingController from './controller/trackingController'
import VehicleTypeController from './controller/VehicleTypeController';
import VehcileController from './controller/VehicleController';
import loginFbController from './CustomerFBLogin/CustomerLoginController'
import SignUpController from './SignUpWithEmailVerification/SignUpController';
import OtpController from './OtpForEmail/OtpController';
import CustomerLoginEmailMobController from './CustomerLoginEmailMob/CustomerLoginEmailMobController'
import CustomerBankController from './controller/CustomerBankController'
import BankController from './controller/BankController';
import RefferalController from './controller/RefferalController';
import CallerController from './controller/CallerController';
import SMSController from './MobileOTP/SMSController';
import RideController from './controller/RideController';
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
router.use('/bank', CustomerBankController);
router.use('/banks', BankController);
router.use('/discount', RefferalController);
router.use('/caller',CallerController);
router.use('/sms', SMSController);
router.use('/ride', RideController);
export default router;
