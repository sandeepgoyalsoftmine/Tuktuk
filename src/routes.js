import {Router} from 'express';

import loginController from './controller/loginController'
import trackingController from './controller/trackingController'
import VehicleTypeController from './controller/VehicleTypeController';
import VehcileController from './controller/VehicleController';
import loginFbController from './CustomerFBLogin/CustomerLoginController'
/**
 * Contains all API routes for the application.
 */
let router = Router();



router.use('/', loginController);
router.use('/tracking', trackingController);
router.use('/vehicle', VehicleTypeController);
router.use('/vehicles', VehcileController);
router.use('/customer', loginFbController);

export default router;
