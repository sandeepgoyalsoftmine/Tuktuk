import {Router} from 'express';

import loginController from './controller/loginController'
import trackingController from './controller/trackingController'
import VehicleTypeController from './controller/VehicleTypeController';
import VehcileController from './controller/VehicleController';
/**
 * Contains all API routes for the application.
 */
let router = Router();



router.use('/', loginController);
router.use('/tracking', trackingController);
router.use('/vehicle', VehicleTypeController);
router.use('/vehicles', VehcileController);

export default router;
