import {Router} from 'express';

import loginController from './controller/loginController'
import trackingController from './controller/trackingController'
import VehicleController from './controller/VehicleController';
/**
 * Contains all API routes for the application.
 */
let router = Router();



router.use('/', loginController);
router.use('/tracking', trackingController);
router.use('/vehicle', VehicleController);

export default router;
