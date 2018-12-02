import {Router} from 'express';

import loginController from './controller/loginController'
import trackingController from './controller/trackingController'
/**
 * Contains all API routes for the application.
 */
let router = Router();



router.use('/', loginController);
router.use('/tracking', trackingController);

export default router;
